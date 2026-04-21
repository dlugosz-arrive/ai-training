import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createSchema = z.object({
  communityId: z.string(),
  title: z.string().min(1).max(200),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const { communityId, title } = parsed.data

  const membership = await prisma.membership.findUnique({
    where: { userId_communityId: { userId: session.user.id, communityId } },
  })
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 })
  }

  const stream = await prisma.stream.create({
    data: {
      roomName: `${communityId}-${Date.now()}`,
      title,
      communityId,
      hostId: session.user.id,
    },
  })
  return NextResponse.json(stream, { status: 201 })
}
