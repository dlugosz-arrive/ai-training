import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: communityId } = await params

  await prisma.membership.upsert({
    where: {
      userId_communityId: { userId: session.user.id, communityId },
    },
    create: { userId: session.user.id, communityId },
    update: {},
  })

  return NextResponse.json({ success: true })
}
