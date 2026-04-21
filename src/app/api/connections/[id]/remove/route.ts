import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const userId = session.user.id

  await prisma.connection.deleteMany({
    where: {
      id,
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
  })

  return NextResponse.json({ success: true })
}
