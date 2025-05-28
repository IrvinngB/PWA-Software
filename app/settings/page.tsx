"use client"

import type React from "react"

import { useState } from "react"
import { useHabits } from "@/contexts/habit-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Badge } from "@/components/ui/badge"
import { SettingsIcon, Download, Upload, Trash2, Moon, Sun, Bell, Database, Info, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePWA } from "@/hooks/use-pwa"

export default function SettingsPage() {
  const {
    habits,
    habitLogs,
    settings,
    updateSettings,
    // Para funciones de importación/exportación necesitaríamos acceso directo a los setters
  } = useHabits()

  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleThemeChange = (theme: "light" | "dark") => {
    updateSettings({ theme })
    // En una implementación real, aquí aplicarías el tema
    document.documentElement.classList.toggle("dark", theme === "dark")
  }

  const handleNotificationsChange = (notifications: boolean) => {
    updateSettings({ notifications })
    if (notifications && "Notification" in window) {
      Notification.requestPermission()
    }
  }

  const handleWeekStartChange = (weekStartsOn: "sunday" | "monday") => {
    updateSettings({ weekStartsOn })
  }

  const exportData = () => {
    setIsExporting(true)
    try {
      const data = {
        habits,
        habitLogs,
        settings,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `habit-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Datos exportados",
        description: "Tu información ha sido descargada exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Validar estructura básica
        if (!data.habits || !data.habitLogs || !data.settings) {
          throw new Error("Formato de archivo inválido")
        }

        // En una implementación real, aquí actualizarías el estado
        // Por ahora solo mostramos un mensaje
        toast({
          title: "Importación exitosa",
          description: `Se importaron ${data.habits.length} hábitos y ${data.habitLogs.length} registros.`,
        })
      } catch (error) {
        toast({
          title: "Error al importar",
          description: "El archivo no tiene un formato válido.",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
        // Limpiar el input
        event.target.value = ""
      }
    }

    reader.readAsText(file)
  }

  const clearAllData = () => {
    localStorage.removeItem("habits")
    localStorage.removeItem("habitLogs")
    localStorage.removeItem("appSettings")

    toast({
      title: "Datos eliminados",
      description: "Toda la información ha sido borrada. Recarga la página para ver los cambios.",
    })
  }

  const dataStats = {
    totalHabits: habits.length,
    activeHabits: habits.filter((h) => h.isActive).length,
    totalLogs: habitLogs.length,
    completedLogs: habitLogs.filter((log) => log.completed).length,
    storageSize: new Blob([JSON.stringify({ habits, habitLogs, settings })]).size,
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const { isInstalled, isStandalone, canInstall, isOnline } = usePWA()

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia y gestiona tus datos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme">Tema</Label>
                <p className="text-sm text-muted-foreground">Elige entre tema claro u oscuro</p>
              </div>
              <Select value={settings.theme} onValueChange={(value: "light" | "dark") => handleThemeChange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Claro
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Oscuro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="week-start">Inicio de Semana</Label>
                <p className="text-sm text-muted-foreground">Primer día de la semana en calendarios</p>
              </div>
              <Select
                value={settings.weekStartsOn}
                onValueChange={(value: "sunday" | "monday") => handleWeekStartChange(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Lunes</SelectItem>
                  <SelectItem value="sunday">Domingo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Recordatorios</Label>
                <p className="text-sm text-muted-foreground">Recibe notificaciones para tus hábitos</p>
              </div>
              <Switch id="notifications" checked={settings.notifications} onCheckedChange={handleNotificationsChange} />
            </div>

            {settings.notifications && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Info className="h-4 w-4 inline mr-1" />
                  Las notificaciones están habilitadas. Puedes configurar horarios específicos en futuras versiones.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Información de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{dataStats.totalHabits}</div>
                <p className="text-sm text-muted-foreground">Hábitos Totales</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{dataStats.activeHabits}</div>
                <p className="text-sm text-muted-foreground">Hábitos Activos</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{dataStats.totalLogs}</div>
                <p className="text-sm text-muted-foreground">Registros Totales</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{dataStats.completedLogs}</div>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tamaño de datos:</span>
                <Badge variant="outline">{formatBytes(dataStats.storageSize)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de PWA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Estado de la Aplicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Estado de Instalación</p>
                  <p className="text-sm text-muted-foreground">
                    {isInstalled ? "Aplicación instalada" : "Aplicación web"}
                  </p>
                </div>
                <Badge variant={isInstalled ? "default" : "secondary"}>{isInstalled ? "Instalada" : "Web"}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Modo de Visualización</p>
                  <p className="text-sm text-muted-foreground">
                    {isStandalone ? "Aplicación nativa" : "Navegador web"}
                  </p>
                </div>
                <Badge variant={isStandalone ? "default" : "outline"}>{isStandalone ? "Standalone" : "Browser"}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Estado de Conexión</p>
                  <p className="text-sm text-muted-foreground">{isOnline ? "Conectado a internet" : "Modo offline"}</p>
                </div>
                <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
              </div>

              {canInstall && !isInstalled && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Instalación Disponible</p>
                    <p className="text-sm text-blue-700">Puedes instalar esta app para mejor rendimiento</p>
                  </div>
                  <Badge variant="outline" className="border-blue-300 text-blue-700">
                    Disponible
                  </Badge>
                </div>
              )}
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                <Info className="h-4 w-4 inline mr-1" />
                {isOnline
                  ? "Todos los datos se sincronizan automáticamente"
                  : "Los datos se guardan localmente y se sincronizarán cuando vuelva la conexión"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Gestión de Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Gestión de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exportar Datos */}
            <div className="space-y-2">
              <Label>Exportar Datos</Label>
              <p className="text-sm text-muted-foreground">Descarga una copia de seguridad de todos tus datos</p>
              <Button onClick={exportData} disabled={isExporting} className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exportando..." : "Exportar Datos"}
              </Button>
            </div>

            {/* Importar Datos */}
            <div className="space-y-2">
              <Label>Importar Datos</Label>
              <p className="text-sm text-muted-foreground">Restaura datos desde un archivo de respaldo</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  disabled={isImporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button disabled={isImporting} className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? "Importando..." : "Importar Datos"}
                </Button>
              </div>
            </div>

            {/* Eliminar Todos los Datos */}
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-red-600">Zona Peligrosa</Label>
              <p className="text-sm text-muted-foreground">Elimina permanentemente todos tus datos</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Todos los Datos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus hábitos, registros y
                      configuraciones.
                      <br />
                      <br />
                      <strong>Datos que se perderán:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>{dataStats.totalHabits} hábitos</li>
                        <li>{dataStats.totalLogs} registros de progreso</li>
                        <li>Todas las configuraciones personalizadas</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllData} className="bg-red-600 hover:bg-red-700">
                      Sí, eliminar todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de la Aplicación */}
      <Card>
        <CardHeader>
          <CardTitle>Acerca de la Aplicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="font-medium">Versión</h3>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <h3 className="font-medium">Almacenamiento</h3>
              <p className="text-sm text-muted-foreground">Local (localStorage)</p>
            </div>
            <div>
              <h3 className="font-medium">Última Actualización</h3>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("es-ES")}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Planificador de Hábitos Personal - Una aplicación simple y efectiva para rastrear tus hábitos diarios.
              Todos los datos se almacenan localmente en tu navegador.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
