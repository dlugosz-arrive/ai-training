"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SendConnectionRequest({ receiverId }: { receiverId: string }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()

  async function send() {
    setLoading(true)
    await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId }),
    })
    setSent(true)
    setLoading(false)
    router.refresh()
  }

  if (sent) {
    return <span className="text-sm text-gray-400">Request sent</span>
  }

  return (
    <button
      onClick={send}
      disabled={loading}
      className="px-3 py-1 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 disabled:opacity-50"
    >
      {loading ? "Sending..." : "Connect"}
    </button>
  )
}
