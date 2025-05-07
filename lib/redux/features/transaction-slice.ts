import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Transaction } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

// Sample data for demo purposes
const sampleTransactions: Transaction[] = [
  {
    id: uuidv4(),
    type: "income",
    amount: 2500,
    categoryId: "salary",
    date: format(new Date(2023, 4, 15), "yyyy-MM-dd"),
    description: "Monthly salary",
  },
  {
    id: uuidv4(),
    type: "expense",
    amount: 800,
    categoryId: "housing",
    date: format(new Date(2023, 4, 1), "yyyy-MM-dd"),
    description: "Rent payment",
  },
  {
    id: uuidv4(),
    type: "expense",
    amount: 120,
    categoryId: "groceries",
    date: format(new Date(2023, 4, 5), "yyyy-MM-dd"),
    description: "Weekly groceries",
  },
  {
    id: uuidv4(),
    type: "expense",
    amount: 45,
    categoryId: "entertainment",
    date: format(new Date(2023, 4, 10), "yyyy-MM-dd"),
    description: "Movie tickets",
  },
  {
    id: uuidv4(),
    type: "income",
    amount: 300,
    categoryId: "other",
    date: format(new Date(2023, 4, 20), "yyyy-MM-dd"),
    description: "Freelance work",
  },
]

// Async thunk for fetching transactions
export const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async () => {
  // In a real app, this would be an API call
  // For demo purposes, we'll just return the sample data
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return sampleTransactions
})

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
}

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.transactions[index] = action.payload
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch transactions"
      })
  },
})

export const { addTransaction, updateTransaction, deleteTransaction } = transactionSlice.actions
export default transactionSlice.reducer
