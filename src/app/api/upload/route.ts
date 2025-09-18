import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

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
        const newPathname = `csvFiles/${pathname}`
        return {
          pathname: newPathname,
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "text/csv",
          ],
          addRandomSuffix: true,
          callbackUrl: process.env.VERCEL_BLOB_CALLBACK_URL,
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload completed", blob, tokenPayload)
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
