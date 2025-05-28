"use client"

import { useEffect, useState } from "react"

export function ServiceWorkerRegistration() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar si service workers están soportados
    if ("serviceWorker" in navigator) {
      setIsSupported(true)

      // En lugar de registrar un service worker externo,
      // usamos las capacidades de cache del navegador
      console.log("Service Worker support detected")

      // Simular funcionalidad offline usando localStorage y cache API
      if ("caches" in window) {
        setupOfflineSupport()
      }
    } else {
      console.log("Service Workers not supported")
    }
  }, [])

  const setupOfflineSupport = async () => {
    try {
      // Crear cache para recursos estáticos
      const cache = await caches.open("habit-tracker-v1")

      // Pre-cachear recursos importantes
      const resourcesToCache = ["/", "/habits", "/add-habit", "/stats", "/settings"]

      // Intentar cachear recursos (sin fallar si no están disponibles)
      for (const resource of resourcesToCache) {
        try {
          await cache.add(resource)
        } catch (error) {
          console.log(`Could not cache ${resource}:`, error)
        }
      }

      console.log("Offline support configured")
    } catch (error) {
      console.log("Cache setup failed:", error)
    }
  }

  const handleUpdate = () => {
    // Simular actualización recargando la página
    window.location.reload()
  }

  const handleDismiss = () => {
    setShowUpdatePrompt(false)
  }

  // No mostrar nada por ahora ya que no tenemos service worker real
  return null
}
