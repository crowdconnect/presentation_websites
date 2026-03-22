"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import type { Property } from "@/lib/types"
import { mergeCategoryDefinitions, getCategoryLabel, getCategoryUnit } from "@/lib/categories"
import {
  daysUntilCancellationDeadline,
  formatCurrency,
  formatConsumptionAmount,
} from "@/lib/helpers"
import { AddContractDialog } from "@/components/add-contract-dialog"
import { ContractPdfControls } from "@/components/contract-pdf-controls"
import { toast } from "sonner"

interface PropertyContractsPanelProps {
  property: Property
}

export function PropertyContractsPanel({ property }: PropertyContractsPanelProps) {
  const { updateContract, categoryDefinitions } = useAppStore()
  const catDefs = mergeCategoryDefinitions(categoryDefinitions)
  const [showAdd, setShowAdd] = useState(false)

  const sorted = useMemo(() => {
    return [...property.contracts]
      .map((c) => ({ ...c, daysLeft: daysUntilCancellationDeadline(c) }))
      .sort((a, b) => a.endDate.localeCompare(b.endDate))
  }, [property.contracts])

  const getUrgencyStyle = (days: number) => {
    if (days <= 0)
      return {
        border: "border-muted-foreground/30",
        badge: "bg-muted text-muted-foreground",
        label: "Abgelaufen",
      }
    if (days <= 30)
      return {
        border: "border-destructive/30",
        badge: "bg-destructive text-destructive-foreground",
        label: `${days} Tage`,
      }
    if (days <= 90)
      return {
        border: "border-warning/30",
        badge: "bg-warning text-warning-foreground",
        label: `${days} Tage`,
      }
    return {
      border: "border-border",
      badge: "bg-success/10 text-success",
      label: `${days} Tage`,
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {sorted.length} {sorted.length === 1 ? "Vertrag" : "Vertraege"} fuer Plan/Ist und Fristen.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="h-4 w-4" />
          Vertrag hinzufuegen
        </Button>
      </div>

      {sorted.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarClock className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Keine Vertraege fuer dieses Objekt</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {sorted.map((contract) => {
          const style = getUrgencyStyle(contract.daysLeft)
          const consUnit = getCategoryUnit(contract.category, catDefs)
          return (
            <Card key={contract.id} className={`border ${style.border} transition-colors`}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {contract.daysLeft <= 30 && contract.daysLeft > 0 ? (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                    ) : contract.daysLeft <= 90 && contract.daysLeft > 0 ? (
                      <Clock className="h-4 w-4 shrink-0 text-warning" />
                    ) : contract.daysLeft <= 0 ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <CalendarClock className="h-4 w-4 shrink-0 text-success" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {contract.provider}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryLabel(contract.category, catDefs)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${style.badge} shrink-0 border-0 text-xs`}>
                    {style.label}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-2">
                    <span>
                      {contract.billingCycle === "monthly" ? "Monatlich" : "Jaehrlich (Budget)"}
                    </span>
                    <span className="shrink-0 font-medium text-foreground">
                      {contract.billingCycle === "monthly"
                        ? formatCurrency(contract.monthlyCost)
                        : formatCurrency(contract.annualAmount ?? contract.monthlyCost * 12)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Laufzeit</span>
                    <span className="text-right">
                      {new Date(contract.startDate).toLocaleDateString("de-DE")}
                      {" – "}
                      {new Date(contract.endDate).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kuendigungsfrist</span>
                    <span>{contract.cancellationPeriodMonths} Monate</span>
                  </div>
                  {contract.annualConsumptionBasis != null && consUnit && (
                    <div className="flex justify-between gap-2">
                      <span>Jahresverbrauch (Vertrag)</span>
                      <span className="shrink-0 font-medium text-foreground">
                        {formatConsumptionAmount(contract.annualConsumptionBasis)} {consUnit}/J
                      </span>
                    </div>
                  )}
                </div>
                {contract.daysLeft > 0 &&
                  contract.daysLeft <= 90 &&
                  !contract.notified && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full text-xs bg-transparent"
                      onClick={() => {
                        updateContract(property.id, contract.id, { notified: true })
                        toast.success("Als benachrichtigt markiert")
                      }}
                    >
                      Als gekuendigt markieren
                    </Button>
                  )}
                {contract.notified && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="h-3 w-3" />
                    Kuendigung vermerkt
                  </div>
                )}
                <ContractPdfControls
                  propertyId={property.id}
                  contractId={contract.id}
                  fileName={contract.contractPdfFileName}
                  dataUrl={contract.contractPdfDataUrl}
                  updateContract={updateContract}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AddContractDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        fixedPropertyId={property.id}
      />
    </div>
  )
}
