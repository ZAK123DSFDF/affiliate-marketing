// lib/server/getUploadFile.ts
import { NextResponse } from "next/server"

export interface UploadFileResult {
  file: File
  uploadPath: string
}

export async function getUploadFile(
  request: Request
): Promise<UploadFileResult | NextResponse> {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const path = formData.get("path") as string | undefined
  const uploadPath = path ? `${path}/${file.name}` : file.name

  return { file, uploadPath }
}
