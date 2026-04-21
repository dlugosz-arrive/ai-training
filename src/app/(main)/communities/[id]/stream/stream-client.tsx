"use client"

import dynamic from "next/dynamic"

const StreamRoom = dynamic(() => import("./stream-room"), { ssr: false })

interface Props {
  communityId: string
  roomName: string
  token: string
  serverUrl: string
  streamId: string
  isHost: boolean
}

export default function StreamClient(props: Props) {
  return <StreamRoom {...props} />
}
