import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Destructure to log in a more readable format
  const {
    boneAgeMonths,
    confidenceScore,
    standardDeviation,
    timestamp,
    imageUrl,
  } = body

  console.log("🖨️ Logged Prediction:")
  console.log("Bone Age:", boneAgeMonths, "months")
  console.log("Confidence:", confidenceScore)
  console.log("Std Dev:", standardDeviation)
  console.log("Timestamp:", timestamp)
  console.log("Image URL:", imageUrl)

  return NextResponse.json({ status: "ok" })
}
