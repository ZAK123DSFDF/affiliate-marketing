import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { parsePaypalCSV } from "@/lib/server/parsePaypalCSV"
import util from "util"
import {
  processTransactions,
  Transaction,
} from "@/lib/server/processTransactions"
import { getUploadFile } from "@/lib/server/getUploadFile"
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})
export async function POST(request: Request) {
  try {
    const result = await getUploadFile(request)
    if (result instanceof NextResponse) return result
    const { file, uploadPath } = result
    const csvText = await file.text()
    let parsed
    try {
      parsed = parsePaypalCSV(csvText)
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Invalid CSV format" },
        { status: 400 }
      )
    }
    const transactions: Transaction[] = parsed.transactions.map((t) => ({
      Unique_Identifier: t.Unique_Identifier,
      Recipient: t.Recipient,
      Status: t.Status,
      Amount: t.Amount.amount,
    }))
    await processTransactions(transactions)
    console.log("parsed", util.inspect(parsed, { depth: null, colors: true }))
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: uploadPath,
        Body: csvText,
        ContentType: "text/csv",
      })
    )

    return NextResponse.json({
      message: "File uploaded successfully",
      parsedData: parsed,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
