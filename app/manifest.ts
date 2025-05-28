import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Planificador de Hábitos Personal",
    short_name: "Hábitos",
    description: "Organiza y rastrea tus hábitos diarios de forma simple y efectiva",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    scope: "/",
    lang: "es",
    categories: ["productivity", "lifestyle", "health"],
    icons: [
      {
        src: "/placeholder.svg?height=72&width=72",
        sizes: "72x72",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=96&width=96",
        sizes: "96x96",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=128&width=128",
        sizes: "128x128",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=144&width=144",
        sizes: "144x144",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=152&width=152",
        sizes: "152x152",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=192&width=192",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=384&width=384",
        sizes: "384x384",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
      {
        src: "/placeholder.svg?height=512&width=512",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable any",
      },
    ],
    shortcuts: [
      {
        name: "Agregar Hábito",
        short_name: "Agregar",
        description: "Crear un nuevo hábito",
        url: "/add-habit",
        icons: [{ src: "/placeholder.svg?height=192&width=192", sizes: "192x192" }],
      },
      {
        name: "Mis Hábitos",
        short_name: "Hábitos",
        description: "Ver todos mis hábitos",
        url: "/habits",
        icons: [{ src: "/placeholder.svg?height=192&width=192", sizes: "192x192" }],
      },
      {
        name: "Estadísticas",
        short_name: "Stats",
        description: "Ver mi progreso",
        url: "/stats",
        icons: [{ src: "/placeholder.svg?height=192&width=192", sizes: "192x192" }],
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Dashboard del Planificador de Hábitos",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Vista móvil del Planificador de Hábitos",
      },
    ],
  }
}
