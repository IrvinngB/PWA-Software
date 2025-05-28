"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      // Mostrar el estado por unos segundos cuando cambia
      if (!online) {
        setShowStatus(true)
      } else {
        setShowStatus(true)
        setTimeout(() => setShowStatus(false), 3000)
      }
    }

    // Verificar estado inicial
    setIsOnline(navigator.onLine)

    // Escuchar cambios de conexión
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (!showStatus) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2 px-3 py-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            Conectado
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Sin conexión - Modo offline
          </>
        )}
      </Badge>
    </div>
  )
}
