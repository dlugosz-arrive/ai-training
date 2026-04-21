"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCommunityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const fd = new FormData(e.currentTarget)
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        topic: fd.get("topic"),
        description: fd.get("description"),
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Failed to create community")
      setLoading(false)
    } else {
      const data = await res.json()
      router.push(`/communities/${data.id}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Community</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Community Name</label>
          <input
            name="name"
            required
            placeholder="1:72 Scale Aircraft Builders"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input
            name="topic"
            required
            placeholder="Scale Models"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="What is this community about?"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? "Creating..." : "Create Community"}
        </button>
      </form>
    </div>
  )
}
