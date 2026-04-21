import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { action } = await req.json()

  const connection = await prisma.connection.findUnique({ where: { id } })
  if (!connection || connection.receiverId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.connection.update({
    where: { id },
    data: { status: action === "accept" ? "ACCEPTED" : "REJECTED" },
  })
  return NextResponse.json(updated)
}
