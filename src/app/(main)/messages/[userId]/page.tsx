import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ChatPanel from "@/components/chat-panel"

export default async function DirectMessagePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId: partnerId } = await params
  const session = await auth()
  const userId = session!.user.id

  const [partner, connection] = await Promise.all([
    prisma.user.findUnique({ where: { id: partnerId }, select: { id: true, name: true } }),
    prisma.connection.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: userId, receiverId: partnerId },
          { requesterId: partnerId, receiverId: userId },
        ],
      },
    }),
  ])

  if (!partner || !connection) notFound()

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-full" style={{ height: "calc(100vh - 8rem)" }}>
      <div className="flex items-center gap-3 mb-4">
        <Link href="/messages" className="text-sm text-blue-600 hover:underline">
          ← Messages
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
            {partner.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="font-semibold">{partner.name}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ChatPanel currentUserId={userId} partnerId={partnerId} />
      </div>
    </div>
  )
}
