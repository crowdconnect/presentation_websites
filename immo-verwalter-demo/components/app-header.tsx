"use client"

import Image from "next/image"
import { ScanLine, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { daysUntilCancellationDeadline } from "@/lib/helpers"
import { Badge } from "@/components/ui/badge"

interface AppHeaderProps {
  onScanClick: () => void
  onAlertsClick: () => void
}

export function AppHeader({ onScanClick, onAlertsClick }: AppHeaderProps) {
  const { properties } = useAppStore()

  const urgentContracts = properties.flatMap((p) =>
    p.contracts.filter((c) => {
      const days = daysUntilCancellationDeadline(c)
      return days <= 90 && days > 0
    })
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-0.5">
            <Image
              src="/mawa.png"
              alt="mawa"
              width={120}
              height={40}
              className="h-8 w-auto object-contain sm:h-9"
              priority
            />
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground sm:text-xs">
              Immobilien
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="outline" size="icon" onClick={onScanClick} className="h-9 w-9 bg-transparent sm:hidden">
            <ScanLine className="h-4 w-4" />
            <span className="sr-only">Dokument scannen</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onScanClick} className="hidden gap-2 bg-transparent sm:flex">
            <ScanLine className="h-4 w-4" />
            Dokument scannen
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onAlertsClick}
            className="relative h-9 w-9 bg-transparent sm:hidden"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Fristen</span>
            {urgentContracts.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              >
                {urgentContracts.length}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onAlertsClick}
            className="relative hidden gap-2 bg-transparent sm:flex"
          >
            <Bell className="h-4 w-4" />
            Fristen
            {urgentContracts.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {urgentContracts.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
