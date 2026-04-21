import dynamic from "next/dynamic"
import { auth } from "@/lib/auth"
import { generateToken } from "@/lib/livekit"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

// ssr: false prevents livekit-client from running on the server (it uses browser WebRTC APIs)
const StreamRoom = dynamic(() => import("./stream-room"), { ssr: false })

export default async function StreamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ room?: string }>
}) {
  const [{ id }, { room }] = await Promise.all([params, searchParams])
  if (!room) redirect(`/communities/${id}`)

  const session = await auth()
  if (!session) redirect("/login")

  const [token, stream] = await Promise.all([
    generateToken(session.user.id, session.user.name ?? "Anonymous", room),
    prisma.stream.findUnique({ where: { roomName: room } }),
  ])

  if (!stream || stream.status === "ENDED") redirect(`/communities/${id}`)

  return (
    <StreamRoom
      communityId={id}
      roomName={room}
      token={token}
      serverUrl={process.env.LIVEKIT_URL!}
      streamId={stream.id}
      isHost={stream.hostId === session.user.id}
    />
  )
}
