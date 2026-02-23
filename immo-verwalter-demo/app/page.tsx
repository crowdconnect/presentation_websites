"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { AppHeader } from "@/components/app-header"
import { PropertyCard } from "@/components/property-card"
import { AddPropertyDialog } from "@/components/add-property-dialog"
import { PropertyDetail } from "@/components/property-detail"
import { DocumentScanner } from "@/components/document-scanner"
import { ContractAlerts } from "@/components/contract-alerts"

export default function HomePage() {
  const { properties } = useAppStore()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId)

  if (selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        onBack={() => setSelectedPropertyId(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onScanClick={() => setShowScanner(true)}
        onAlertsClick={() => setShowAlerts(true)}
      />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground text-balance sm:text-2xl">
              Meine Immobilien
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {properties.length} {properties.length === 1 ? "Objekt" : "Objekte"} verwaltet
            </p>
          </div>
          <Button onClick={() => setShowAddProperty(true)} size="sm" className="gap-1.5 text-xs sm:text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Immobilie</span>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => setSelectedPropertyId(property.id)}
            />
          ))}
        </div>
        {properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="mb-2 text-lg font-medium text-muted-foreground">
              Noch keine Immobilien vorhanden
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Fuegen Sie Ihre erste Immobilie hinzu, um loszulegen.
            </p>
            <Button onClick={() => setShowAddProperty(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Erste Immobilie hinzufuegen
            </Button>
          </div>
        )}
      </main>
      <AddPropertyDialog open={showAddProperty} onOpenChange={setShowAddProperty} />
      <DocumentScanner open={showScanner} onOpenChange={setShowScanner} />
      <ContractAlerts open={showAlerts} onOpenChange={setShowAlerts} />
    </div>
  )
}
