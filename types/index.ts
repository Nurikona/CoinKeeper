export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  categoryId: string
  date: string
  description?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}
