"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Monitor, Info } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Detectar si ya está instalado (modo standalone)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")
    setIsStandalone(standalone)

    // Verificar si ya fue instalado previamente
    const wasInstalled = localStorage.getItem("pwa-installed") === "true"
    setIsInstalled(wasInstalled)

    // Verificar si el prompt fue rechazado recientemente
    const promptDismissed = localStorage.getItem("pwa-prompt-dismissed")
    const dismissedTime = promptDismissed ? Number.parseInt(promptDismissed) : 0
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)

    // Listener para el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)

      // Mostrar prompt solo si no está instalado, no es standalone, y no fue rechazado recientemente
      if (!wasInstalled && !standalone && daysSinceDismissed > 1) {
        setTimeout(() => setShowInstallPrompt(true), 5000) // Mostrar después de 5 segundos
      }
    }

    // Listener para cuando la app es instalada
    const handleAppInstalled = () => {
      console.log("PWA was installed")
      setIsInstalled(true)
      setShowInstallPrompt(false)
      localStorage.setItem("pwa-installed", "true")
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Mostrar información sobre PWA después de un tiempo si no hay prompt nativo
    setTimeout(() => {
      if (!deferredPrompt && !isInstalled && !standalone && daysSinceDismissed > 1) {
        setShowInfo(true)
      }
    }, 10000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("User accepted the install prompt")
        setIsInstalled(true)
        localStorage.setItem("pwa-installed", "true")
      } else {
        console.log("User dismissed the install prompt")
        localStorage.setItem("pwa-prompt-dismissed", Date.now().toString())
      }

      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Error during installation:", error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setShowInfo(false)
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString())
  }

  const handleInfoDismiss = () => {
    setShowInfo(false)
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString())
  }

  // Mostrar prompt de instalación nativo
  if (showInstallPrompt && deferredPrompt && !isInstalled && !isStandalone) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                <CardTitle className="text-lg">Instalar App</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Instala la app para una mejor experiencia y acceso offline</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Instalar
              </Button>
              <Button variant="outline" onClick={handleDismiss}>
                Ahora no
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar información sobre PWA para iOS o cuando no hay prompt nativo
  if (showInfo && !isInstalled && !isStandalone) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-lg border-2 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {isIOS ? <Smartphone className="h-5 w-5 text-blue-600" /> : <Info className="h-5 w-5 text-blue-600" />}
                <CardTitle className="text-lg text-blue-900">
                  {isIOS ? "Agregar a Inicio" : "App Web Progresiva"}
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={handleInfoDismiss} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-blue-700">
              {isIOS
                ? "Agrega esta app a tu pantalla de inicio para un acceso rápido"
                : "Esta aplicación funciona offline y se puede usar como una app nativa"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm text-blue-800">Para agregar a tu pantalla de inicio:</p>
                <ol className="text-sm space-y-1 text-blue-700 list-decimal list-inside">
                  <li>Toca el botón de compartir en Safari</li>
                  <li>Selecciona "Agregar a pantalla de inicio"</li>
                  <li>Toca "Agregar" para confirmar</li>
                </ol>
                <Button variant="outline" onClick={handleInfoDismiss} className="w-full border-blue-300 text-blue-700">
                  Entendido
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✓ Funciona sin conexión a internet</p>
                  <p>✓ Se actualiza automáticamente</p>
                  <p>✓ Datos guardados localmente</p>
                </div>
                <Button variant="outline" onClick={handleInfoDismiss} className="w-full border-blue-300 text-blue-700">
                  Entendido
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
