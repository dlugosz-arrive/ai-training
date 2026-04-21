import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateToken } from "@/lib/livekit"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const room = req.nextUrl.searchParams.get("room")
  if (!room) return NextResponse.json({ error: "room required" }, { status: 400 })

  const token = await generateToken(
    session.user.id,
    session.user.name ?? "Anonymous",
    room
  )
  return NextResponse.json({ token })
}
