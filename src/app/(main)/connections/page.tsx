import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ConnectionActions from "./connection-actions"
import RemoveConnection from "./remove-connection"
import SendConnectionRequest from "./send-connection-request"

export default async function ConnectionsPage() {
  const session = await auth()
  const userId = session!.user.id

  const [accepted, pending, suggestions] = await Promise.all([
    prisma.connection.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: {
        requester: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    }),
    prisma.connection.findMany({
      where: { receiverId: userId, status: "PENDING" },
      include: { requester: { select: { id: true, name: true } } },
    }),
    prisma.user.findMany({
      where: {
        id: { not: userId },
        sentConnections: { none: { receiverId: userId } },
        receivedConnections: { none: { requesterId: userId } },
      },
      select: { id: true, name: true },
      take: 20,
    }),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">Connections</h1>

      {pending.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Pending Requests ({pending.length})
          </h2>
          <div className="bg-white rounded-xl shadow divide-y">
            {pending.map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <span className="font-medium">{c.requester.name}</span>
                <ConnectionActions connectionId={c.id} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">
          My Connections ({accepted.length})
        </h2>
        {accepted.length === 0 ? (
          <p className="text-gray-500 text-sm">No connections yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow divide-y">
            {accepted.map((c) => {
              const other = c.requesterId === userId ? c.receiver : c.requester
              return (
                <div key={c.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                      {other.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="text-sm font-medium">{other.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/messages/${other.id}`}
                      className="px-3 py-1 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50"
                    >
                      Message
                    </Link>
                    <RemoveConnection connectionId={c.id} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Find People</h2>
        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-sm">No new people to connect with.</p>
        ) : (
          <div className="bg-white rounded-xl shadow divide-y">
            {suggestions.map((user) => (
              <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm shrink-0">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <SendConnectionRequest receiverId={user.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
