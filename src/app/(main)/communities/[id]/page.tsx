import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import JoinButton from "./join-button"
import LeaveButton from "./leave-button"
import StartStreamButton from "./start-stream-button"

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const userId = session!.user.id

  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { user: { select: { id: true, name: true } } },
      },
      streams: {
        where: { status: "LIVE" },
        include: { host: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!community) notFound()

  const isMember = community.memberships.some((m) => m.userId === userId)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{community.name}</h1>
            <p className="text-blue-600 mt-1">{community.topic}</p>
            {community.description && (
              <p className="text-gray-600 mt-2">{community.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {community.memberships.length} member
              {community.memberships.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="shrink-0">
            {isMember ? (
              <div className="flex gap-2">
                <StartStreamButton communityId={community.id} />
                <LeaveButton communityId={community.id} />
              </div>
            ) : (
              <JoinButton communityId={community.id} />
            )}
          </div>
        </div>
      </div>

      {community.streams.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Live Streams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {community.streams.map((stream) => (
              <Link
                key={stream.id}
                href={`/communities/${community.id}/stream?room=${stream.roomName}`}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-red-500 font-semibold">LIVE</span>
                </div>
                <p className="font-semibold">{stream.title}</p>
                <p className="text-sm text-gray-500">Hosted by {stream.host.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Members</h2>
        <div className="bg-white rounded-xl shadow divide-y">
          {community.memberships.map(({ user }) => (
            <div key={user.id} className="px-6 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
