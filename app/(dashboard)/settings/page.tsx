"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addCategory, deleteCategory } from "@/lib/redux/features/category-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { CategoryColorPicker } from "@/components/category-color-picker"
import { CategoryIconPicker } from "@/components/category-icon-picker"
import { v4 as uuidv4 } from "uuid"

export default function SettingsPage() {
  const dispatch = useDispatch()
  const { categories } = useSelector((state: RootState) => state.categories)

  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "CreditCard",
    color: "#4f46e5",
  })

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      dispatch(
        addCategory({
          id: uuidv4(),
          name: newCategory.name.trim(),
          icon: newCategory.icon,
          color: newCategory.color,
        }),
      )
      setNewCategory({
        name: "",
        icon: "CreditCard",
        color: "#4f46e5",
      })
    }
  }

  const handleDeleteCategory = (id: string) => {
    dispatch(deleteCategory(id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your transaction categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Groceries"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <CategoryIconPicker
                  selectedIcon={newCategory.icon}
                  onSelectIcon={(icon) => setNewCategory({ ...newCategory, icon })}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <CategoryColorPicker
                  selectedColor={newCategory.color}
                  onSelectColor={(color) => setNewCategory({ ...newCategory, color })}
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
              <div>Category</div>
              <div>Icon</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category.id} className="grid grid-cols-3 gap-4 p-4 items-center">
                  <div>{category.name}</div>
                  <div>
                    <CategoryIcon name={category.icon} color={category.color} />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No categories found. Add your first category above.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
