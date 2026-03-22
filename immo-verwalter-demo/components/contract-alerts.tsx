"use client"

import React from "react"

import { useState } from "react"
import {
  AlertTriangle,
  Clock,
  Plus,
  CalendarClock,
  CheckCircle2,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { AddContractDialog } from "@/components/add-contract-dialog"
import { ContractPdfControls } from "@/components/contract-pdf-controls"
import { mergeCategoryDefinitions, getCategoryLabel, getCategoryUnit } from "@/lib/categories"
import {
  daysUntilCancellationDeadline,
  formatCurrency,
  formatConsumptionAmount,
} from "@/lib/helpers"
import { toast } from "sonner"

interface ContractAlertsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContractAlerts({ open, onOpenChange }: ContractAlertsProps) {
  const { properties, updateContract, categoryDefinitions } = useAppStore()
  const catDefs = mergeCategoryDefinitions(categoryDefinitions)
  const [showAddContract, setShowAddContract] = useState(false)

  const allContracts = properties.flatMap((p) =>
    p.contracts.map((c) => ({
      ...c,
      propertyName: p.name,
      propertyId: p.id,
      daysLeft: daysUntilCancellationDeadline(c),
    }))
  )

  const sorted = [...allContracts].sort((a, b) => a.daysLeft - b.daysLeft)

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

  const handleMarkNotified = (propertyId: string, contractId: string) => {
    updateContract(propertyId, contractId, { notified: true })
    toast.success("Als benachrichtigt markiert")
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Vertragsfristen</SheetTitle>
            <SheetDescription>
              Uebersicht aller Vertraege und Kuendigungsfristen.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 bg-transparent"
              onClick={() => setShowAddContract(true)}
            >
              <Plus className="h-4 w-4" />
              Vertrag hinzufuegen
            </Button>

            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarClock className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Keine Vertraege vorhanden
                </p>
              </div>
            )}

            {sorted.map((contract) => {
              const style = getUrgencyStyle(contract.daysLeft)
              const consUnit = getCategoryUnit(contract.category, catDefs)
              return (
                <Card
                  key={contract.id}
                  className={`border ${style.border} transition-colors`}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {contract.daysLeft <= 30 && contract.daysLeft > 0 ? (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        ) : contract.daysLeft <= 90 && contract.daysLeft > 0 ? (
                          <Clock className="h-4 w-4 text-warning" />
                        ) : contract.daysLeft <= 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <CalendarClock className="h-4 w-4 text-success" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {contract.provider}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryLabel(contract.category, catDefs)} - {contract.propertyName}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${style.badge} border-0 text-xs`}>
                        {style.label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>
                          {contract.billingCycle === "monthly" ? "Monatlich" : "Jaehrlich (Budget)"}
                        </span>
                        <span className="font-medium text-foreground">
                          {contract.billingCycle === "monthly"
                            ? formatCurrency(contract.monthlyCost)
                            : formatCurrency(
                                contract.annualAmount ?? contract.monthlyCost * 12
                              )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Laufzeit</span>
                        <span>
                          {new Date(contract.startDate).toLocaleDateString("de-DE")}
                          {" - "}
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
                          onClick={() =>
                            handleMarkNotified(
                              contract.propertyId,
                              contract.id
                            )
                          }
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
                      propertyId={contract.propertyId}
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
        </SheetContent>
      </Sheet>

      <AddContractDialog open={showAddContract} onOpenChange={setShowAddContract} />
    </>
  )
}
