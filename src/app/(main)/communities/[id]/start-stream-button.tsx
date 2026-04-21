"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function StartStreamButton({ communityId }: { communityId: string }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function startStream() {
    if (!title.trim()) return
    setLoading(true)
    const res = await fetch("/api/streams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ communityId, title }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/communities/${communityId}/stream?room=${data.roomName}`)
    }
    setLoading(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
      >
        Start Stream
      </button>
    )
  }

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Stream title"
        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <button
        onClick={startStream}
        disabled={loading || !title.trim()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
      >
        {loading ? "Starting..." : "Go Live"}
      </button>
      <button
        onClick={() => setShowForm(false)}
        className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  )
}
