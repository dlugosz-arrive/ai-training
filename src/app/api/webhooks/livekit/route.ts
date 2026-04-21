import { NextRequest, NextResponse } from "next/server"
import { webhookReceiver } from "@/lib/livekit"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const authorization = req.headers.get("Authorization")

  try {
    const event = await webhookReceiver().receive(body, authorization ?? undefined)

    if (event.event === "room_finished" && event.room?.name) {
      await prisma.stream.updateMany({
        where: { roomName: event.room.name, status: "LIVE" },
        data: { status: "ENDED", endedAt: new Date() },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }
}
