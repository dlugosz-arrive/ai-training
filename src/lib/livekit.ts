import { AccessToken } from "livekit-server-sdk"

export async function generateToken(
  userId: string,
  userName: string,
  roomName: string
) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: userId, name: userName }
  )
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  })
  return await at.toJwt()
}
