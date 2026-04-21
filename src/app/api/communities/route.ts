import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createSchema = z.object({
  name: z.string().min(2).max(100),
  topic: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
})

export async function GET() {
  const communities = await prisma.community.findMany({
    include: { _count: { select: { memberships: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(communities)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const community = await prisma.community.create({
    data: {
      ...parsed.data,
      memberships: {
        create: { userId: session.user.id, role: "ADMIN" },
      },
    },
  })

  return NextResponse.json(community, { status: 201 })
}
