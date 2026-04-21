import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import BuildDate from "@/components/build-date"

const navLinks = [
  ["Dashboard", "/dashboard"],
  ["Communities", "/communities"],
  ["Connections", "/connections"],
] as const

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-white shadow-sm flex flex-col shrink-0">
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold text-blue-600">AI Training</h1>
          <p className="text-xs text-gray-500 mt-1 truncate">{session.user.name}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-3">
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button
              type="submit"
              className="w-full text-sm text-gray-500 hover:text-gray-700 text-left"
            >
              Sign Out
            </button>
          </form>
          <div className="text-xs text-gray-300 leading-relaxed">
            <div>{process.env.BUILD_COMMIT}</div>
            <BuildDate isoDate={process.env.BUILD_DATE!} />
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
