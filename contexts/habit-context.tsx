"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface Habit {
  id: string
  name: string
  description: string
  category: string
  frequency: "daily" | "weekly" | "monthly"
  targetDays: number[]
  color: string
  createdAt: string
  isActive: boolean
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
  notes?: string
}

export interface AppSettings {
  theme: "light" | "dark"
  notifications: boolean
  weekStartsOn: "sunday" | "monday"
}

interface HabitContextType {
  habits: Habit[]
  habitLogs: HabitLog[]
  settings: AppSettings
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void
  updateHabit: (id: string, habit: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (habitId: string, date: string, notes?: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  getHabitProgress: (habitId: string, days: number) => number
  getTodayCompletedHabits: () => number
  getStreakForHabit: (habitId: string) => number
  syncOfflineData: () => void
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [settings, setSettings] = useState<AppSettings>({
    theme: "light",
    notifications: true,
    weekStartsOn: "monday",
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    const savedLogs = localStorage.getItem("habitLogs")
    const savedSettings = localStorage.getItem("appSettings")

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
    if (savedLogs) {
      setHabitLogs(JSON.parse(savedLogs))
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem("habitLogs", JSON.stringify(habitLogs))
  }, [habitLogs])

  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
  }, [settings])

  const addHabit = (habitData: Omit<Habit, "id" | "createdAt">) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setHabits((prev) => [...prev, newHabit])
  }

  const updateHabit = (id: string, habitData: Partial<Habit>) => {
    setHabits((prev) => prev.map((habit) => (habit.id === id ? { ...habit, ...habitData } : habit)))
  }

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
    setHabitLogs((prev) => prev.filter((log) => log.habitId !== id))
  }

  const toggleHabitCompletion = (habitId: string, date: string, notes?: string) => {
    const existingLog = habitLogs.find((log) => log.habitId === habitId && log.date === date)

    if (existingLog) {
      setHabitLogs((prev) =>
        prev.map((log) => (log.id === existingLog.id ? { ...log, completed: !log.completed, notes } : log)),
      )
    } else {
      const newLog: HabitLog = {
        id: Date.now().toString(),
        habitId,
        date,
        completed: true,
        notes,
      }
      setHabitLogs((prev) => [...prev, newLog])
    }
  }

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const getHabitProgress = (habitId: string, days: number): number => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const logsInPeriod = habitLogs.filter((log) => {
      const logDate = new Date(log.date)
      return log.habitId === habitId && log.completed && logDate >= startDate && logDate <= endDate
    })

    return Math.round((logsInPeriod.length / days) * 100)
  }

  const getTodayCompletedHabits = (): number => {
    const today = new Date().toISOString().split("T")[0]
    return habitLogs.filter((log) => log.date === today && log.completed).length
  }

  const getStreakForHabit = (habitId: string): number => {
    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const log = habitLogs.find((log) => log.habitId === habitId && log.date === dateStr && log.completed)

      if (log) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  // Función para sincronizar datos cuando vuelve la conexión
  const syncOfflineData = () => {
    // Verificar integridad de datos locales
    console.log("Syncing offline data...")

    try {
      const savedHabits = localStorage.getItem("habits")
      const savedLogs = localStorage.getItem("habitLogs")
      const savedSettings = localStorage.getItem("appSettings")

      if (savedHabits) JSON.parse(savedHabits)
      if (savedLogs) JSON.parse(savedLogs)
      if (savedSettings) JSON.parse(savedSettings)

      console.log("Local data integrity check passed")

      // Crear backup automático cuando hay conexión
      if (navigator.onLine) {
        const backupData = {
          habits: JSON.parse(savedHabits || "[]"),
          habitLogs: JSON.parse(savedLogs || "[]"),
          settings: JSON.parse(savedSettings || "{}"),
          lastSync: new Date().toISOString(),
        }

        localStorage.setItem("habit-tracker-backup", JSON.stringify(backupData))
        console.log("Automatic backup created")
      }
    } catch (error) {
      console.error("Data corruption detected, attempting recovery...", error)

      // Intentar recuperar desde backup
      try {
        const backup = localStorage.getItem("habit-tracker-backup")
        if (backup) {
          const backupData = JSON.parse(backup)
          setHabits(backupData.habits || [])
          setHabitLogs(backupData.habitLogs || [])
          setSettings(
            backupData.settings || {
              theme: "light",
              notifications: true,
              weekStartsOn: "monday",
            },
          )
          console.log("Data recovered from backup")
        } else {
          throw new Error("No backup available")
        }
      } catch (backupError) {
        console.error("Backup recovery failed, resetting to defaults", backupError)
        // En caso de corrupción total, resetear a valores por defecto
        setHabits([])
        setHabitLogs([])
        setSettings({
          theme: "light",
          notifications: true,
          weekStartsOn: "monday",
        })
      }
    }
  }

  // Escuchar cuando vuelve la conexión para sincronizar
  useEffect(() => {
    const handleOnline = () => {
      syncOfflineData()
    }

    window.addEventListener("online", handleOnline)
    return () => window.removeEventListener("online", handleOnline)
  }, [])

  return (
    <HabitContext.Provider
      value={{
        habits,
        habitLogs,
        settings,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        updateSettings,
        getHabitProgress,
        getTodayCompletedHabits,
        getStreakForHabit,
        syncOfflineData,
      }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider")
  }
  return context
}
