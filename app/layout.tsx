import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { HabitProvider } from "@/contexts/habit-context"
import { Navigation } from "@/components/navigation"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Planificador de Hábitos Personal",
  description: "Organiza y rastrea tus hábitos diarios de forma simple y efectiva",
  keywords: ["hábitos", "productividad", "seguimiento", "metas", "rutinas"],
  authors: [{ name: "Planificador de Hábitos" }],
  creator: "Planificador de Hábitos",
  publisher: "Planificador de Hábitos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://habit-tracker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Planificador de Hábitos Personal",
    description: "Organiza y rastrea tus hábitos diarios de forma simple y efectiva",
    url: "https://habit-tracker.vercel.app",
    siteName: "Planificador de Hábitos",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Planificador de Hábitos Personal",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planificador de Hábitos Personal",
    description: "Organiza y rastrea tus hábitos diarios de forma simple y efectiva",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hábitos",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="application-name" content="Hábitos" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hábitos" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://habit-tracker.vercel.app" />
        <meta name="twitter:title" content="Planificador de Hábitos Personal" />
        <meta name="twitter:description" content="Organiza y rastrea tus hábitos diarios de forma simple y efectiva" />
        <meta name="twitter:image" content="https://habit-tracker.vercel.app/android-chrome-192x192.png" />
        <meta name="twitter:creator" content="@habittracker" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Planificador de Hábitos Personal" />
        <meta property="og:description" content="Organiza y rastrea tus hábitos diarios de forma simple y efectiva" />
        <meta property="og:site_name" content="Planificador de Hábitos Personal" />
        <meta property="og:url" content="https://habit-tracker.vercel.app" />
        <meta property="og:image" content="https://habit-tracker.vercel.app/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <HabitProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="md:pl-64">
              <div className="pt-16 md:pt-0">{children}</div>
            </main>
            <PWAInstallPrompt />
            <ServiceWorkerRegistration />
            <Toaster />
          </div>
        </HabitProvider>
      </body>
    </html>
  )
}
