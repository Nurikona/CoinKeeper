"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import * as LucideIcons from "lucide-react"

// Common icons for financial categories
const commonIcons = [
  "CreditCard",
  "Wallet",
  "ShoppingCart",
  "Home",
  "Car",
  "Utensils",
  "Coffee",
  "Bus",
  "Plane",
  "Briefcase",
  "Gift",
  "Heart",
  "DollarSign",
  "Smartphone",
  "Tv",
  "Shirt",
  "Scissors",
  "Dumbbell",
  "Pill",
  "Book",
  "Gamepad2",
  "Music",
  "Film",
  "Ticket",
  "Landmark",
  "Droplets",
  "Flame",
  "Lightbulb",
  "Wifi",
  "Baby",
  "Dog",
  "Cat",
  "Wrench",
  "Hammer",
]

interface CategoryIconPickerProps {
  selectedIcon: string
  onSelectIcon: (icon: string) => void
}

export function CategoryIconPicker({ selectedIcon, onSelectIcon }: CategoryIconPickerProps) {
  const [open, setOpen] = useState(false)

  // Get the selected icon component
  const SelectedIcon = (LucideIcons as Record<string, React.ComponentType<any>>)[selectedIcon] || LucideIcons.CreditCard

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center">
            <SelectedIcon className="mr-2 h-4 w-4" />
            {selectedIcon}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandList className="max-h-[300px]">
            <CommandGroup>
              {commonIcons.map((icon) => {
                const IconComponent = (LucideIcons as Record<string, React.ComponentType<any>>)[icon]

                return (
                  <CommandItem
                    key={icon}
                    value={icon}
                    onSelect={() => {
                      onSelectIcon(icon)
                      setOpen(false)
                    }}
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span>{icon}</span>
                    {selectedIcon === icon && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
