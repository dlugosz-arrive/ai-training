"use client"

import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import Link from "next/link"

interface Props {
  communityId: string
  roomName: string
  token: string
  serverUrl: string
}

export default function StreamRoom({ communityId, token, serverUrl }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href={`/communities/${communityId}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to community
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-500">LIVE</span>
        </div>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden" style={{ minHeight: "600px" }}>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          data-lk-theme="default"
          style={{ height: "100%" }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  )
}
