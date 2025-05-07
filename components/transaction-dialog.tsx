"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addTransaction, updateTransaction } from "@/lib/redux/features/transaction-slice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CategoryIcon } from "@/components/category-icon"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import type { Transaction } from "@/types"

interface TransactionDialogProps {
  children: React.ReactNode
  transaction?: Transaction
  onComplete?: () => void
}

export function TransactionDialog({ children, transaction, onComplete }: TransactionDialogProps) {
  const dispatch = useDispatch()
  const { categories } = useSelector((state: RootState) => state.categories)
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState<Partial<Transaction>>(
    transaction || {
      type: "expense",
      amount: 0,
      categoryId: categories[0]?.id || "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (transaction?.id) {
      // Update existing transaction
      dispatch(
        updateTransaction({
          ...transaction,
          ...formData,
        }),
      )
    } else {
      // Add new transaction
      dispatch(
        addTransaction({
          id: uuidv4(),
          type: formData.type!,
          amount: Number(formData.amount),
          categoryId: formData.categoryId!,
          date: formData.date!,
          description: formData.description || "",
        }),
      )
    }

    setOpen(false)
    if (onComplete) onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
            <DialogDescription>
              {transaction ? "Update the details of your transaction." : "Enter the details of your new transaction."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={formData.type === "income" ? "default" : "outline"}
                className="w-full"
                onClick={() => setFormData({ ...formData, type: "income" })}
              >
                Income
              </Button>
              <Button
                type="button"
                variant={formData.type === "expense" ? "default" : "outline"}
                className="w-full"
                onClick={() => setFormData({ ...formData, type: "expense" })}
              >
                Expense
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <CategoryIcon name={category.icon} color={category.color} className="mr-2 h-4 w-4" />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add notes about this transaction"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{transaction ? "Save Changes" : "Add Transaction"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
