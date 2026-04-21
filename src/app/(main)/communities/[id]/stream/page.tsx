import { auth } from "@/lib/auth"
import { generateToken } from "@/lib/livekit"
import { redirect } from "next/navigation"
import StreamRoom from "./stream-room"

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

  const token = await generateToken(
    session.user.id,
    session.user.name ?? "Anonymous",
    room
  )

  return (
    <StreamRoom
      communityId={id}
      roomName={room}
      token={token}
      serverUrl={process.env.LIVEKIT_URL!}
    />
  )
}
