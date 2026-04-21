"use client"

export default function BuildDate({ isoDate }: { isoDate: string }) {
  return (
    <span>
      {new Date(isoDate).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      })}
    </span>
  )
}
