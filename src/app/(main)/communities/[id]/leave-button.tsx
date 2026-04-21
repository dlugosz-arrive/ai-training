"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LeaveButton({ communityId }: { communityId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function leave() {
    if (!confirm("Leave this community?")) return
    setLoading(true)
    await fetch(`/api/communities/${communityId}/leave`, { method: "POST" })
    router.push("/communities")
  }

  return (
    <button
      onClick={leave}
      disabled={loading}
      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Leaving..." : "Leave Community"}
    </button>
  )
}
