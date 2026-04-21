"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ConnectionActions({ connectionId }: { connectionId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function respond(action: "accept" | "reject") {
    setLoading(true)
    await fetch(`/api/connections/${connectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => respond("accept")}
        disabled={loading}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        Accept
      </button>
      <button
        onClick={() => respond("reject")}
        disabled={loading}
        className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  )
}
