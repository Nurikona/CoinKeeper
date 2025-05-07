import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Category } from "@/types"

interface CategoryState {
  categories: Category[]
}

// Sample categories for demo purposes
const initialCategories: Category[] = [
  {
    id: "salary",
    name: "Salary",
    icon: "Briefcase",
    color: "#22c55e",
  },
  {
    id: "housing",
    name: "Housing",
    icon: "Home",
    color: "#3b82f6",
  },
  {
    id: "groceries",
    name: "Groceries",
    icon: "ShoppingCart",
    color: "#f97316",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "Car",
    color: "#8b5cf6",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Film",
    color: "#ec4899",
  },
  {
    id: "dining",
    name: "Dining",
    icon: "Utensils",
    color: "#f43f5e",
  },
  {
    id: "other",
    name: "Other",
    icon: "CreditCard",
    color: "#6b7280",
  },
]

const initialState: CategoryState = {
  categories: initialCategories,
}

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload)
    },
  },
})

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions
export default categorySlice.reducer
