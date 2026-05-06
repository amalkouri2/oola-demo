"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, role, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="bg-black border-b border-[rgb(var(--border))]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="text-gold text-2xl font-bold">
            Oola Platform
          </Link>

          <nav className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-[rgb(var(--muted-foreground))] hidden sm:inline">
                  {user.email}
                </span>

                {role === "seller" && (
                  <Link
                    href="/seller"
                    className="text-sm text-gold hover:underline"
                  >
                    لوحة البائع
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-sm text-[rgb(var(--muted-foreground))] hover:text-white transition-colors"
                >
                  خروج
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
