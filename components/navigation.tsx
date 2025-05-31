"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Target, Plus, BarChart3, Settings, Menu } from "lucide-react"
import { ConnectionStatus } from "@/components/connection-status"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Mis Hábitos", href: "/habits", icon: Target },
  { name: "Agregar Hábito", href: "/add-habit", icon: Plus },
]

export function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex flex-col gap-2 mt-8">
              <h2 className="text-lg font-semibold mb-4">Planificador de Hábitos</h2>
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
        <ConnectionStatus />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-background border-r overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-lg font-semibold">Planificador de Hábitos</h2>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              <NavItems />
            </nav>
          </div>
        </div>
        <ConnectionStatus />
      </div>
    </>
  )
}
