"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Predefined colors for categories
const colors = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
  "#0f172a", // slate
  "#44403c", // stone
  "#1e293b", // slate
]

interface CategoryColorPickerProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

export function CategoryColorPicker({ selectedColor, onSelectColor }: CategoryColorPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: selectedColor }} />
            {selectedColor}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                selectedColor === color ? "ring-2 ring-offset-2" : "",
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onSelectColor(color)
                setOpen(false)
              }}
            >
              {selectedColor === color && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
