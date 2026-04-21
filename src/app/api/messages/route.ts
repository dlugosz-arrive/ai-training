import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const messageSelect = {
  id: true,
  content: true,
  createdAt: true,
  sender: { select: { id: true, name: true } },
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = req.nextUrl
  const communityId = searchParams.get("communityId")
  const partnerId = searchParams.get("partnerId")

  if (communityId) {
    const membership = await prisma.membership.findUnique({
      where: { userId_communityId: { userId: session.user.id, communityId } },
    })
    if (!membership) return NextResponse.json({ error: "Not a member" }, { status: 403 })

    const messages = await prisma.message.findMany({
      where: { communityId },
      select: messageSelect,
      orderBy: { createdAt: "asc" },
      take: 100,
    })
    return NextResponse.json(messages)
  }

  if (partnerId) {
    const userId = session.user.id
    const messages = await prisma.message.findMany({
      where: {
        communityId: null,
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      select: messageSelect,
      orderBy: { createdAt: "asc" },
      take: 100,
    })
    return NextResponse.json(messages)
  }

  return NextResponse.json({ error: "communityId or partnerId required" }, { status: 400 })
}

const createSchema = z.object({
  content: z.string().min(1).max(2000),
  communityId: z.string().optional(),
  receiverId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const { content, communityId, receiverId } = parsed.data

  if (!communityId && !receiverId) {
    return NextResponse.json({ error: "communityId or receiverId required" }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: { content, senderId: session.user.id, communityId, receiverId },
    select: messageSelect,
  })

  return NextResponse.json(message, { status: 201 })
}
