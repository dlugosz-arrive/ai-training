"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function JoinButton({ communityId }: { communityId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function join() {
    setLoading(true)
    await fetch(`/api/communities/${communityId}/join`, { method: "POST" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={join}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Joining..." : "Join Community"}
    </button>
  )
}
