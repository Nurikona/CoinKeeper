"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Statistics",
    href: "/stats",
  },
  {
    name: "Settings",
    href: "/settings",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="text-xl font-bold transition-colors hover:text-primary">
        Wallet
      </Link>
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
