"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

interface CategoryIconProps {
  name: string
  color?: string
  className?: string
}

export function CategoryIcon({ name, color = "#000000", className }: CategoryIconProps) {
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<any>>)[name] || LucideIcons.CreditCard

  return (
    <div
      className={cn("flex items-center justify-center rounded-full p-1", className)}
      style={{ backgroundColor: `${color}20` }} // 20 is for 12% opacity
    >
      <IconComponent style={{ color }} className="h-4 w-4" />
    </div>
  )
}
