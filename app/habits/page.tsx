"use client"

import { useState } from "react"
import { useHabits } from "@/contexts/habit-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Edit, Trash2, Target, Flame, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HabitsPage() {
  const { habits, deleteHabit, updateHabit, getStreakForHabit, getHabitProgress } = useHabits()

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const categories = [...new Set(habits.map((h) => h.category))]

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || habit.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && habit.isActive) ||
      (statusFilter === "inactive" && !habit.isActive)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleHabitStatus = (habitId: string, isActive: boolean) => {
    updateHabit(habitId, { isActive })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Hábitos</h1>
          <p className="text-muted-foreground">Gestiona todos tus hábitos</p>
        </div>
        <Link href="/add-habit">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Hábito
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar hábitos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No se encontraron hábitos</p>
                  <p className="text-muted-foreground mt-2">
                    {habits.length === 0
                      ? "¡Agrega tu primer hábito para comenzar!"
                      : "Intenta ajustar los filtros de búsqueda"}
                  </p>
                  {habits.length === 0 && (
                    <Link href="/add-habit">
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primer Hábito
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const streak = getStreakForHabit(habit.id)
            const progress7Days = getHabitProgress(habit.id, 7)
            const progress30Days = getHabitProgress(habit.id, 30)

            return (
              <Card key={habit.id} className={`${!habit.isActive ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={habit.isActive}
                        onCheckedChange={(checked) => toggleHabitStatus(habit.id, checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: habit.color + "20",
                        color: habit.color,
                      }}
                    >
                      {habit.category}
                    </Badge>
                    <Badge variant="outline">
                      {habit.frequency === "daily" ? "Diario" : habit.frequency === "weekly" ? "Semanal" : "Mensual"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span className="text-sm font-medium">{streak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Racha</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        <span className="text-sm font-medium">{progress7Days}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">7 días</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium">{progress30Days}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">30 días</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/add-habit?edit=${habit.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar hábito?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el hábito "{habit.name}" y
                            todos sus registros.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteHabit(habit.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
