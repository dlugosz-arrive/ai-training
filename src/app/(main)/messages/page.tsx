import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function MessagesPage() {
  const session = await auth()
  const userId = session!.user.id

  const connections = await prisma.connection.findMany({
    where: { status: "ACCEPTED", OR: [{ requesterId: userId }, { receiverId: userId }] },
    include: {
      requester: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  })

  const partners = connections.map((c) =>
    c.requesterId === userId ? c.receiver : c.requester
  )

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      {partners.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No connections yet.{" "}
          <Link href="/connections" className="text-blue-600 hover:underline">
            Find people to connect with
          </Link>
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow divide-y">
          {partners.map((p) => (
            <Link
              key={p.id}
              href={`/messages/${p.id}`}
              className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold shrink-0">
                {p.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span className="font-medium">{p.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
