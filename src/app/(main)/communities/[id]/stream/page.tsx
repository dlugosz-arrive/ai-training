import { Suspense } from "react"
import StreamRoom from "./stream-room"

export default async function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading stream...</div>}>
      <StreamRoom communityId={id} />
    </Suspense>
  )
}
