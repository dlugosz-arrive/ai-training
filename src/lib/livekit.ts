import { AccessToken, RoomServiceClient, WebhookReceiver } from "livekit-server-sdk"

function livekitHttpUrl() {
  return process.env.LIVEKIT_URL!.replace(/^wss?:\/\//, "https://")
}

export function roomService() {
  return new RoomServiceClient(
    livekitHttpUrl(),
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  )
}

export function webhookReceiver() {
  return new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
  )
}

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
