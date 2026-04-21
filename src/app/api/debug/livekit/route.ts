import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    key_prefix: process.env.LIVEKIT_API_KEY?.slice(0, 6) ?? "MISSING",
    key_length: process.env.LIVEKIT_API_KEY?.length ?? 0,
    secret_length: process.env.LIVEKIT_API_SECRET?.length ?? 0,
    url: process.env.LIVEKIT_URL ?? "MISSING",
  })
}
