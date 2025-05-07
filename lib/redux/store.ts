import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth-slice"
import transactionReducer from "./features/transaction-slice"
import categoryReducer from "./features/category-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
  },
  // Add middleware for localStorage persistence in a real app
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
