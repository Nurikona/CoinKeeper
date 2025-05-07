"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { deleteTransaction } from "@/lib/redux/features/transaction-slice"
import { Button } from "@/components/ui/button"
import { TransactionDialog } from "@/components/transaction-dialog"
import { CategoryIcon } from "@/components/category-icon"
import { format, parseISO } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import type { Transaction } from "@/types"
import { formatCurrency } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const dispatch = useDispatch()
  const { categories } = useSelector((state: RootState) => state.categories)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteTransaction(deleteId))
      setDeleteId(null)
    }
  }

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id)
  }

  if (transactions.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No transactions found.</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
          <div className="col-span-2">Description</div>
          <div>Category</div>
          <div>Date</div>
          <div>Amount</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y">
          {transactions.map((transaction) => {
            const category = getCategoryById(transaction.categoryId)

            return (
              <div key={transaction.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                <div className="col-span-2 truncate">{transaction.description || "No description"}</div>
                <div>
                  {category && (
                    <div className="flex items-center">
                      <CategoryIcon name={category.icon} color={category.color} className="mr-2 h-4 w-4" />
                      <span className="truncate">{category.name}</span>
                    </div>
                  )}
                </div>
                <div>{format(parseISO(transaction.date), "MMM d, yyyy")}</div>
                <div className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
                <div className="flex justify-end space-x-2">
                  <TransactionDialog transaction={transaction}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TransactionDialog>

                  <AlertDialog open={deleteId === transaction.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(transaction.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this transaction? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
