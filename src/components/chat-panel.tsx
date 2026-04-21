"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface Message {
  id: string
  content: string
  createdAt: string
  sender: { id: string; name: string | null }
}

interface Props {
  currentUserId: string
  communityId?: string
  partnerId?: string
}

export default function ChatPanel({ currentUserId, communityId, partnerId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const apiUrl = communityId
    ? `/api/messages?communityId=${communityId}`
    : `/api/messages?partnerId=${partnerId}`

  const fetchMessages = useCallback(async () => {
    const res = await fetch(apiUrl)
    if (res.ok) setMessages(await res.json())
  }, [apiUrl])

  useEffect(() => {
    fetchMessages()
    const id = setInterval(fetchMessages, 3000)
    return () => clearInterval(id)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setSending(true)
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.trim(), communityId, receiverId: partnerId }),
    })
    setInput("")
    setSending(false)
    fetchMessages()
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">No messages yet</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender.id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[75%]`}>
                {!isOwn && (
                  <span className="text-xs text-gray-500 mb-1 px-1">{msg.sender.name}</span>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm break-words ${
                    isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t p-3 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  )
}
