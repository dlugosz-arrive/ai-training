"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RemoveConnection({ connectionId }: { connectionId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function remove() {
    if (!confirm("Remove this connection?")) return
    setLoading(true)
    await fetch(`/api/connections/${connectionId}/remove`, { method: "POST" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={remove}
      disabled={loading}
      className="px-3 py-1 border border-gray-300 text-gray-500 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  )
}
