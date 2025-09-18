import { create } from "zustand"
import { upload } from "@vercel/blob/client"
export type FileStatus = "pending" | "processing" | "success" | "error"

export interface UploadedFile {
  id: string
  name: string
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
  addFile: (uploadId: string, file: File, path?: string) => Promise<void>
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
      // Prepend folder path if provided
      const uploadPath = path ? `${path}/${file.name}` : file.name

      await upload(uploadPath, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => {
          set((state) => {
            const current = state.uploads[uploadId]
            if (!current) return state
            return {
              uploads: {
                ...state.uploads,
                [uploadId]: {
                  ...current,
                  files: current.files.map((f) =>
                    f.id === newFile.id ? { ...f, progress: percentage } : f
                  ),
                },
              },
            }
          })
        },
      })

      // Mark as success
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
  },

  retryFile: (uploadId, id) => {
    // Simple retry: just mark as processing for now
    set((state) => {
      const current = state.uploads[uploadId]
      if (!current) return state
      return {
        uploads: {
          ...state.uploads,
          [uploadId]: {
            ...current,
            files: current.files.map((f) =>
              f.id === id ? { ...f, status: "processing", progress: 100 } : f
            ),
          },
        },
      }
    })

    setTimeout(() => {
      set((state) => {
        const current = state.uploads[uploadId]
        if (!current) return state
        return {
          uploads: {
            ...state.uploads,
            [uploadId]: {
              ...current,
              files: current.files.map((f) =>
                f.id === id ? { ...f, status: "success" } : f
              ),
            },
          },
        }
      })
    }, 1200)
  },
}))
