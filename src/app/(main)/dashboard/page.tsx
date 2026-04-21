import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [memberships, pendingCount, activeStreams] = await Promise.all([
    prisma.membership.findMany({
      where: { userId },
      include: {
        community: {
          include: { streams: { where: { status: "LIVE" } } },
        },
      },
      take: 6,
    }),
    prisma.connection.count({ where: { receiverId: userId, status: "PENDING" } }),
    prisma.stream.findMany({
      where: { status: "LIVE" },
      include: {
        community: { select: { id: true, name: true } },
        host: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session!.user.name}
        </h1>
        {pendingCount > 0 && (
          <p className="mt-2 text-sm text-blue-700">
            You have {pendingCount} pending connection request
            {pendingCount > 1 ? "s" : ""}.{" "}
            <Link href="/connections" className="underline">
              View
            </Link>
          </p>
        )}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Live Now</h2>
        {activeStreams.length === 0 ? (
          <p className="text-gray-500 text-sm">No active streams right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeStreams.map((stream) => (
              <Link
                key={stream.id}
                href={`/communities/${stream.community.id}/stream?room=${stream.roomName}`}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-red-500 font-semibold">LIVE</span>
                </div>
                <p className="font-semibold truncate">{stream.title}</p>
                <p className="text-sm text-gray-500">
                  {stream.community.name} · {stream.host.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Communities</h2>
          <Link href="/communities" className="text-sm text-blue-600 hover:underline">
            Browse all
          </Link>
        </div>
        {memberships.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You haven&apos;t joined any communities.{" "}
            <Link href="/communities" className="text-blue-600 hover:underline">
              Find one
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memberships.map(({ community }) => (
              <Link
                key={community.id}
                href={`/communities/${community.id}`}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <p className="font-semibold">{community.name}</p>
                <p className="text-sm text-gray-500">{community.topic}</p>
                {community.streams.length > 0 && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
