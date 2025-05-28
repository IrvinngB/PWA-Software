"use client"

import { useHabits } from "@/contexts/habit-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Target, TrendingUp, Calendar, Flame } from "lucide-react"

export default function Dashboard() {
  const { habits, habitLogs, toggleHabitCompletion, getTodayCompletedHabits, getStreakForHabit, getHabitProgress } =
    useHabits()

  const today = new Date().toISOString().split("T")[0]
  const activeHabits = habits.filter((habit) => habit.isActive)
  const todayCompletedCount = getTodayCompletedHabits()
  const completionRate = activeHabits.length > 0 ? Math.round((todayCompletedCount / activeHabits.length) * 100) : 0

  const isHabitCompletedToday = (habitId: string) => {
    return habitLogs.some((log) => log.habitId === habitId && log.date === today && log.completed)
  }

  const getMotivationalMessage = () => {
    if (completionRate === 100) return "¡Excelente! Has completado todos tus hábitos hoy 🎉"
    if (completionRate >= 75) return "¡Muy bien! Estás cerca de completar todos tus hábitos 💪"
    if (completionRate >= 50) return "Buen progreso, ¡sigue así! 👍"
    if (completionRate >= 25) return "Has comenzado bien, ¡continúa! 🌱"
    return "¡Es un buen momento para comenzar con tus hábitos! ✨"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hábitos Activos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHabits.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCompletedCount}</div>
            <p className="text-xs text-muted-foreground">de {activeHabits.length} hábitos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Racha</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...activeHabits.map((h) => getStreakForHabit(h.id)), 0)}</div>
            <p className="text-xs text-muted-foreground">días consecutivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-lg font-medium">{getMotivationalMessage()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Hábitos de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeHabits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tienes hábitos activos.</p>
              <p className="text-sm text-muted-foreground mt-2">¡Agrega tu primer hábito para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeHabits.map((habit) => {
                const isCompleted = isHabitCompletedToday(habit.id)
                const streak = getStreakForHabit(habit.id)
                const progress7Days = getHabitProgress(habit.id, 7)

                return (
                  <div key={habit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHabitCompletion(habit.id, today)}
                        className="p-0 h-auto"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </Button>
                      <div>
                        <h3 className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                          {habit.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{habit.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" style={{ backgroundColor: habit.color + "20", color: habit.color }}>
                        {habit.category}
                      </Badge>
                      {streak > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {streak}
                        </Badge>
                      )}
                      <Badge variant="outline">{progress7Days}% (7d)</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
