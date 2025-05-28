"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useHabits } from "@/contexts/habit-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Plus } from "lucide-react"
import Link from "next/link"

const PREDEFINED_CATEGORIES = [
  "Salud",
  "Ejercicio",
  "Alimentación",
  "Productividad",
  "Aprendizaje",
  "Mindfulness",
  "Relaciones",
  "Finanzas",
  "Hobbies",
  "Otro",
]

const HABIT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#64748b", // slate
  "#78716c", // stone
]

const DAYS_OF_WEEK = [
  { id: 0, name: "Domingo", short: "Dom" },
  { id: 1, name: "Lunes", short: "Lun" },
  { id: 2, name: "Martes", short: "Mar" },
  { id: 3, name: "Miércoles", short: "Mié" },
  { id: 4, name: "Jueves", short: "Jue" },
  { id: 5, name: "Viernes", short: "Vie" },
  { id: 6, name: "Sábado", short: "Sáb" },
]

export default function AddHabitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const { habits, addHabit, updateHabit } = useHabits()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    customCategory: "",
    frequency: "daily" as "daily" | "weekly" | "monthly",
    targetDays: [] as number[],
    color: HABIT_COLORS[0],
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEditing = !!editId

  useEffect(() => {
    if (isEditing && editId) {
      const habitToEdit = habits.find((h) => h.id === editId)
      if (habitToEdit) {
        setFormData({
          name: habitToEdit.name,
          description: habitToEdit.description,
          category: PREDEFINED_CATEGORIES.includes(habitToEdit.category) ? habitToEdit.category : "Otro",
          customCategory: PREDEFINED_CATEGORIES.includes(habitToEdit.category) ? "" : habitToEdit.category,
          frequency: habitToEdit.frequency,
          targetDays: habitToEdit.targetDays,
          color: habitToEdit.color,
          isActive: habitToEdit.isActive,
        })
      }
    }
  }, [isEditing, editId, habits])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida"
    }

    if (formData.category === "Otro" && !formData.customCategory.trim()) {
      newErrors.customCategory = "Especifica la categoría personalizada"
    }

    if (formData.frequency === "weekly" && formData.targetDays.length === 0) {
      newErrors.targetDays = "Selecciona al menos un día de la semana"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const finalCategory = formData.category === "Otro" ? formData.customCategory.trim() : formData.category

    const habitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: finalCategory,
      frequency: formData.frequency,
      targetDays: formData.frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : formData.targetDays,
      color: formData.color,
      isActive: formData.isActive,
    }

    if (isEditing && editId) {
      updateHabit(editId, habitData)
    } else {
      addHabit(habitData)
    }

    router.push("/habits")
  }

  const handleDayToggle = (dayId: number) => {
    setFormData((prev) => ({
      ...prev,
      targetDays: prev.targetDays.includes(dayId)
        ? prev.targetDays.filter((id) => id !== dayId)
        : [...prev.targetDays, dayId],
    }))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/habits">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? "Editar Hábito" : "Agregar Nuevo Hábito"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Modifica los detalles de tu hábito" : "Crea un nuevo hábito para seguir"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Hábito</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Hábito *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Hacer ejercicio, Leer 30 minutos..."
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe tu hábito y por qué es importante para ti..."
                rows={3}
              />
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>

            {/* Categoría personalizada */}
            {formData.category === "Otro" && (
              <div className="space-y-2">
                <Label htmlFor="customCategory">Categoría Personalizada *</Label>
                <Input
                  id="customCategory"
                  value={formData.customCategory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customCategory: e.target.value }))}
                  placeholder="Escribe tu categoría personalizada"
                  className={errors.customCategory ? "border-red-500" : ""}
                />
                {errors.customCategory && <p className="text-sm text-red-500">{errors.customCategory}</p>}
              </div>
            )}

            {/* Frecuencia */}
            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: "daily" | "weekly" | "monthly") =>
                  setFormData((prev) => ({ ...prev, frequency: value, targetDays: [] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Días específicos para frecuencia semanal */}
            {formData.frequency === "weekly" && (
              <div className="space-y-2">
                <Label>Días de la Semana *</Label>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.id} className="flex flex-col items-center">
                      <Checkbox
                        id={`day-${day.id}`}
                        checked={formData.targetDays.includes(day.id)}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                      <Label htmlFor={`day-${day.id}`} className="text-xs mt-1 cursor-pointer">
                        {day.short}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.targetDays && <p className="text-sm text-red-500">{errors.targetDays}</p>}
              </div>
            )}

            {/* Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {HABIT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? "border-gray-800" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link href="/habits" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1">
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Hábito
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
