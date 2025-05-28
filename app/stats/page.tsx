"use client"

import { useMemo } from "react"
import { useHabits } from "@/contexts/habit-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, Target, Calendar, Award, BarChart3, PieChartIcon } from "lucide-react"
import { useState } from "react"

export default function StatsPage() {
  const { habits, habitLogs, getHabitProgress, getStreakForHabit } = useHabits()
  const [selectedPeriod, setSelectedPeriod] = useState("30")

  const activeHabits = habits.filter((h) => h.isActive)

  // Calcular estadísticas generales
  const stats = useMemo(() => {
    const totalHabits = activeHabits.length
    const totalLogs = habitLogs.filter((log) => log.completed).length
    const bestStreak = Math.max(...activeHabits.map((h) => getStreakForHabit(h.id)), 0)

    // Progreso promedio en el período seleccionado
    const avgProgress =
      totalHabits > 0
        ? Math.round(
            activeHabits.reduce((sum, habit) => sum + getHabitProgress(habit.id, Number.parseInt(selectedPeriod)), 0) /
              totalHabits,
          )
        : 0

    return { totalHabits, totalLogs, bestStreak, avgProgress }
  }, [activeHabits, habitLogs, selectedPeriod, getHabitProgress, getStreakForHabit])

  // Datos para gráfico de progreso por hábito
  const habitProgressData = useMemo(() => {
    return activeHabits.map((habit) => ({
      name: habit.name.length > 15 ? habit.name.substring(0, 15) + "..." : habit.name,
      fullName: habit.name,
      progress: getHabitProgress(habit.id, Number.parseInt(selectedPeriod)),
      streak: getStreakForHabit(habit.id),
      color: habit.color,
      category: habit.category,
    }))
  }, [activeHabits, selectedPeriod, getHabitProgress, getStreakForHabit])

  // Datos para gráfico de progreso diario (últimos 14 días)
  const dailyProgressData = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const completedCount = habitLogs.filter((log) => log.date === dateStr && log.completed).length

      const completionRate = activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0

      days.push({
        date: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
        fullDate: dateStr,
        completed: completedCount,
        total: activeHabits.length,
        rate: completionRate,
      })
    }
    return days
  }, [habitLogs, activeHabits])

  // Datos para gráfico de categorías
  const categoryData = useMemo(() => {
    const categoryCount = activeHabits.reduce(
      (acc, habit) => {
        acc[habit.category] = (acc[habit.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count,
      percentage: Math.round((count / activeHabits.length) * 100),
    }))
  }, [activeHabits])

  const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#8b5cf6", "#06b6d4", "#eab308", "#ec4899"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estadísticas</h1>
          <p className="text-muted-foreground">Analiza tu progreso y rendimiento</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="14">Últimos 14 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="90">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hábitos Activos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHabits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Racha</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestStreak}</div>
            <p className="text-xs text-muted-foreground">días consecutivos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <Progress value={stats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {activeHabits.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No hay datos para mostrar</p>
              <p className="text-muted-foreground mt-2">
                Agrega algunos hábitos y comienza a registrar tu progreso para ver estadísticas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progreso por Hábito */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso por Hábito ({selectedPeriod} días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  progress: {
                    label: "Progreso",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-80"
              >
                <BarChart data={habitProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.fullName}</p>
                            <p className="text-sm text-muted-foreground">Progreso: {data.progress}%</p>
                            <p className="text-sm text-muted-foreground">Racha: {data.streak} días</p>
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: data.color + "20",
                                color: data.color,
                              }}
                            >
                              {data.category}
                            </Badge>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="progress" fill={(entry) => entry.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Progreso Diario */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso Diario (Últimos 14 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  rate: {
                    label: "Tasa de Completado",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-80"
              >
                <LineChart data={dailyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              Completados: {data.completed}/{data.total}
                            </p>
                            <p className="text-sm text-muted-foreground">Tasa: {data.rate}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-rate)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-rate)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Distribución por Categorías */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Distribución por Categorías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-80">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value} hábito{data.value !== 1 ? "s" : ""} ({data.percentage}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Ranking de Hábitos */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Hábitos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habitProgressData
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 5)
                  .map((habit, index) => (
                    <div key={habit.fullName} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{habit.fullName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={habit.progress} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12">{habit.progress}%</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        🔥 {habit.streak}
                      </Badge>
                    </div>
                  ))}
                {habitProgressData.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No hay hábitos para mostrar</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
