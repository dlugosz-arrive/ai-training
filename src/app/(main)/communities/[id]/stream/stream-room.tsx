"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import Link from "next/link"

interface Props {
  communityId: string
  roomName: string
  token: string
  serverUrl: string
  streamId: string
  isHost: boolean
}

export default function StreamRoom({
  communityId,
  token,
  serverUrl,
  streamId,
  isHost,
}: Props) {
  const router = useRouter()
  const [ending, setEnding] = useState(false)
  const [connectionError, setConnectionError] = useState("")

  async function endStream() {
    setEnding(true)
    await fetch(`/api/streams/${streamId}/end`, { method: "POST" })
    router.push(`/communities/${communityId}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        {isHost && (
          <button
            onClick={endStream}
            disabled={ending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
          >
            {ending ? "Ending..." : "End Stream"}
          </button>
        )}
      </div>
      {connectionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {connectionError}
        </div>
      )}
      <div className="flex-1 rounded-xl overflow-hidden" style={{ minHeight: "600px" }}>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          data-lk-theme="default"
          style={{ height: "100%" }}
          onError={(err) => setConnectionError(`Connection error: ${err.message}`)}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  )
}
