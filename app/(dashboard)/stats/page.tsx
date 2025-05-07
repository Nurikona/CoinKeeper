"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays, format, isWithinInterval, parseISO } from "date-fns"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { Transaction } from "@/types"
import { formatCurrency } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

// Define colors for categories
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFF",
  "#FF6B6B",
  "#4ECDC4",
  "#FF9F1C",
  "#F2CC8F",
  "#845EC2",
]

export default function StatsPage() {
  const { transactions } = useSelector((state: RootState) => state.transactions)
  const { categories } = useSelector((state: RootState) => state.categories)

  // Date range state
  const [date, setDate] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Filtered transactions based on date range
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (date?.from && date?.to) {
      const filtered = transactions.filter((transaction) => {
        const transactionDate = parseISO(transaction.date)
        return isWithinInterval(transactionDate, {
          start: date.from!,
          end: date.to!,
        })
      })
      setFilteredTransactions(filtered)
    }
  }, [date, transactions])

  // Prepare data for pie charts
  const prepareChartData = (type: "income" | "expense") => {
    const typeTransactions = filteredTransactions.filter((t) => t.type === type)

    // Group by category
    const categoryMap = new Map<string, number>()

    typeTransactions.forEach((transaction) => {
      const categoryId = transaction.categoryId
      const currentAmount = categoryMap.get(categoryId) || 0
      categoryMap.set(categoryId, currentAmount + transaction.amount)
    })

    // Convert to array for chart
    return Array.from(categoryMap.entries()).map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        name: category?.name || "Uncategorized",
        value: amount,
      }
    })
  }

  const incomeData = prepareChartData("income")
  const expenseData = prepareChartData("expense")

  // Prepare data for bar chart (monthly comparison)
  const prepareMonthlyData = () => {
    const monthlyData: Record<string, { income: number; expense: number }> = {}

    filteredTransactions.forEach((transaction) => {
      const month = format(parseISO(transaction.date), "MMM")

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount
      } else {
        monthlyData[month].expense += transaction.amount
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
  }

  const monthlyData = prepareMonthlyData()

  return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
              <CardDescription>Distribution of income for the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {incomeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                          data={incomeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                      >
                        {incomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No income data for the selected period
                  </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Distribution of expenses for the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {expenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No expense data for the selected period
                  </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardDescription>Income vs Expenses by month</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#4ade80" />
                      <Bar dataKey="expense" name="Expense" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data for the selected period
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
