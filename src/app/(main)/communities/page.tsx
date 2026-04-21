import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function CommunitiesPage() {
  const session = await auth()
  const userId = session!.user.id

  const [communities, memberships] = await Promise.all([
    prisma.community.findMany({
      include: {
        _count: { select: { memberships: true } },
        streams: { where: { status: "LIVE" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.membership.findMany({
      where: { userId },
      select: { communityId: true },
    }),
  ])

  const joinedIds = new Set(memberships.map((m) => m.communityId))

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Communities</h1>
        <Link
          href="/communities/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          New Community
        </Link>
      </div>
      {communities.length === 0 && (
        <p className="text-gray-500">No communities yet. Create the first one!</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/communities/${c.id}`}
            className="p-5 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-lg truncate">{c.name}</p>
                <p className="text-sm text-blue-600">{c.topic}</p>
                {c.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>
              {joinedIds.has(c.id) && (
                <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Joined
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <span>{c._count.memberships} members</span>
              {c.streams.length > 0 && (
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
