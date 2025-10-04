interface ValidateAndUploadParams {
  file: File
  type: "csv" | "image"
  maxSizeMB: number
  uploadId: string
  path?: string
  endpoint?: string
  addFile: (
    uploadId: string,
    file: File,
    path?: string,
    endpoint?: string
  ) => Promise<{ id: string; url: string }>
  triggerError: (msg: string) => void
  handleSuccess: (
    file: File,
    fileId: string,
    uploadId: string,
    url: string
  ) => void
  handleFailure: (file: File, err: any, uploadId: string) => void
}

export async function validateAndUploadFile({
  file,
  type,
  maxSizeMB,
  uploadId,
  path,
  endpoint,
  addFile,
  triggerError,
  handleSuccess,
  handleFailure,
}: ValidateAndUploadParams) {
  const MAX_SIZE = maxSizeMB * 1024 * 1024

  if (file.size > MAX_SIZE) {
    return triggerError(`"${file.name}" is too large (max ${maxSizeMB}MB).`)
  }
  if (type === "csv" && !file.name.toLowerCase().endsWith(".csv")) {
    return triggerError(`"${file.name}" is not a CSV file.`)
  }
  if (type === "image" && !file.type.startsWith("image/")) {
    return triggerError(`"${file.name}" is not an image file.`)
  }

  try {
    const { id, url } = await addFile(
      uploadId,
      file,
      path,
      endpoint || `/api/upload/${type}`
    )
    handleSuccess(file, id, uploadId, url)
  } catch (err) {
    handleFailure(file, err, uploadId)
  }
}
