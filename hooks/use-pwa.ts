"use client"

import { useState, useEffect } from "react"

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Detectar si está en modo standalone (instalado)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")

    setIsStandalone(standalone)
    setIsInstalled(localStorage.getItem("pwa-installed") === "true" || standalone)

    // Detectar estado de conexión
    setIsOnline(navigator.onLine)

    // Listeners para cambios de conexión
    const handleOnline = () => {
      setIsOnline(true)
      console.log("Connection restored")
    }

    const handleOffline = () => {
      setIsOnline(false)
      console.log("Connection lost - app will work offline")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listener para detectar si se puede instalar
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setCanInstall(true)
      console.log("Install prompt available")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Configurar cache básico si está disponible
    if ("caches" in window) {
      setupBasicCache()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const setupBasicCache = async () => {
    try {
      const cache = await caches.open("habit-tracker-basic-v1")
      console.log("Basic cache setup completed")
    } catch (error) {
      console.log("Cache setup failed:", error)
    }
  }

  return {
    isInstalled,
    isStandalone,
    canInstall,
    isOnline,
  }
}
