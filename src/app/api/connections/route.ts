import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id
  const connections = await prisma.connection.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
    include: {
      requester: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  })
  return NextResponse.json(connections)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { receiverId } = await req.json()
  if (!receiverId) {
    return NextResponse.json({ error: "receiverId required" }, { status: 400 })
  }

  const connection = await prisma.connection.create({
    data: { requesterId: session.user.id, receiverId },
  })
  return NextResponse.json(connection, { status: 201 })
}
