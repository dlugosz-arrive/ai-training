"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import Link from "next/link"

export default function StreamRoom({ communityId }: { communityId: string }) {
  const searchParams = useSearchParams()
  const roomName = searchParams.get("room")
  const [token, setToken] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!roomName) return
    fetch(`/api/streams/token?room=${encodeURIComponent(roomName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token)
        } else {
          setError("Failed to get stream token")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Connection error")
        setLoading(false)
      })
  }, [roomName])

  if (!roomName) {
    return <div className="p-8 text-gray-500">No room specified.</div>
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Connecting to stream...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

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
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          style={{ height: "100%" }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  )
}
