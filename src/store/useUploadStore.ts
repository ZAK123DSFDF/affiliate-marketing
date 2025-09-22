import { create } from "zustand"
import { showStandaloneToast } from "@/util/showStandaloneToast"
export type FileStatus = "pending" | "processing" | "success" | "error"

export interface UploadedFile {
  id: string
  name: string
  file: File
  progress: number
  status: FileStatus
}

interface UploadNamespace {
  files: UploadedFile[]
  errorMessage: string | null
}

interface UseUploadStore {
  uploads: Record<string, UploadNamespace>
  setErrorMessage: (uploadId: string, msg: string | null) => void
  addFile: (uploadId: string, file: File, path?: string) => Promise<string>
  removeFile: (uploadId: string, id: string) => void
  retryFile: (uploadId: string, id: string) => void
}

export const useUploadStore = create<UseUploadStore>((set) => ({
  uploads: {},

  setErrorMessage: (uploadId, msg) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [uploadId]: {
          ...(state.uploads[uploadId] || { files: [], errorMessage: null }),
          errorMessage: msg,
        },
      },
    })),

  addFile: async (uploadId: string, file: File, path?: string) => {
    const newFile: UploadedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      file,
      progress: 0,
      status: "pending",
    }

    // Add file to state immediately
    set((state) => {
      const current = state.uploads[uploadId] || {
        files: [],
        errorMessage: null,
      }
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: { ...current, files: [...current.files, newFile] },
        },
      }
    })

    try {
      const formData = new FormData()
      if (path) formData.append("path", path)
      formData.append("file", file)

      // POST to your new backend API
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      // Mark success
      set((state) => {
        const current = state.uploads[uploadId]
        if (!current) return state
        return {
          uploads: {
            ...state.uploads,
            [uploadId]: {
              ...current,
              files: current.files.map((f) =>
                f.id === newFile.id
                  ? { ...f, status: "success", progress: 100 }
                  : f
              ),
            },
          },
        }
      })
    } catch (err) {
      console.error("Upload Error:", err)
      set((state) => {
        const current = state.uploads[uploadId]
        if (!current) return state
        return {
          uploads: {
            ...state.uploads,
            [uploadId]: {
              ...current,
              files: current.files.map((f) =>
                f.id === newFile.id ? { ...f, status: "error" } : f
              ),
            },
          },
        }
      })
    }
    return newFile.id
  },
  removeFile: (uploadId, id) =>
    set((state) => {
      const current = state.uploads[uploadId]
      if (!current) return state
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...current,
            files: current.files.filter((f) => f.id !== id),
          },
        },
      }
    }),
  retryFile: (uploadId, id) => {
    const state = useUploadStore.getState()
    const current = state.uploads[uploadId]
    if (!current) return

    const fileToRetry = current.files.find((f) => f.id === id)
    if (!fileToRetry) return

    // remove old failed entry
    state.removeFile(uploadId, id)

    // retry upload immediately
    state
      .addFile(uploadId, fileToRetry.file)
      .then((newId) => {
        showStandaloneToast({
          type: "success",
          title: "Retry Successful",
          description: `${fileToRetry.file.name} uploaded on retry.`,
        })

        // auto-cleanup after 1.5s

        useUploadStore.getState().removeFile(uploadId, newId)
      })
      .catch(() => {
        showStandaloneToast({
          type: "error",
          title: "Retry Failed",
          description: `${fileToRetry.file.name} could not be uploaded.`,
        })
      })
  },
}))
