import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import Papa from "papaparse"
import { payoutUploads } from "@/db/schema"
import { db } from "@/db/drizzle"
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname
        /* clientPayload */
      ) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "text/csv",
            "application/octet-stream",
            "application/vnd.ms-excel",
          ],
          addRandomSuffix: true,
          callbackUrl: process.env.VERCEL_BLOB_CALLBACK_URL,
        }
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload completed", blob, tokenPayload)

        try {
          // 1️⃣ Fetch CSV
          const res = await fetch(blob.url)
          const csv = await res.text()

          // 2️⃣ Parse CSV
          const parsed = Papa.parse(csv, { header: true })

          // 3️⃣ Insert parsed data as JSON
          const inserted = await db
            .insert(payoutUploads)
            .values({
              data: parsed.data,
            })
            .returning()

          console.log("✅ CSV saved as JSON:", inserted[0])
        } catch (err) {
          console.error("CSV processing failed", err)
          throw err
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
