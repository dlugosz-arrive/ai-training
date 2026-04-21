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

  const stream = await prisma.stream.findUnique({ where: { id } })
  if (!stream || stream.hostId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.stream.update({
    where: { id },
    data: { status: "ENDED", endedAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
