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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import type { CostCategory, Contract } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORIES_WITH_CONTRACT } from "@/lib/types"
import { daysUntilCancellationDeadline, formatCurrency } from "@/lib/helpers"
import { toast } from "sonner"

interface ContractAlertsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContractAlerts({ open, onOpenChange }: ContractAlertsProps) {
  const { properties, addContract, updateContract } = useAppStore()
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
                            {CATEGORY_LABELS[contract.category]} - {contract.propertyName}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${style.badge} border-0 text-xs`}>
                        {style.label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Monatlich</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(contract.monthlyCost)}
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
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>

      <AddContractDialog
        open={showAddContract}
        onOpenChange={setShowAddContract}
      />
    </>
  )
}

function AddContractDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { properties, addContract } = useAppStore()
  const [propertyId, setPropertyId] = useState(properties[0]?.id || "")
  const [category, setCategory] = useState<CostCategory>("strom")
  const [provider, setProvider] = useState("")
  const [monthlyCost, setMonthlyCost] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [cancelMonths, setCancelMonths] = useState("3")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!propertyId || !provider || !monthlyCost || !startDate || !endDate) return

    const contract: Contract = {
      id: `contract-${Date.now()}`,
      propertyId,
      category,
      provider,
      monthlyCost: Number.parseFloat(monthlyCost),
      startDate,
      endDate,
      cancellationPeriodMonths: Number.parseInt(cancelMonths),
      notified: false,
    }

    addContract(contract)
    toast.success("Vertrag hinzugefuegt")
    setProvider("")
    setMonthlyCost("")
    setStartDate("")
    setEndDate("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neuen Vertrag hinzufuegen</DialogTitle>
          <DialogDescription>
            Erfassen Sie die Vertragsdaten inkl. Laufzeit und Kuendigungsfrist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Immobilie</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Immobilie waehlen" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Kategorie</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as CostCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES_WITH_CONTRACT.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contract-provider">Anbieter</Label>
            <Input
              id="contract-provider"
              placeholder="z.B. Vattenfall"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contract-cost">Monatliche Kosten (EUR)</Label>
            <Input
              id="contract-cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={monthlyCost}
              onChange={(e) => setMonthlyCost(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="contract-start">Vertragsbeginn</Label>
              <Input
                id="contract-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="contract-end">Vertragsende</Label>
              <Input
                id="contract-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cancel-months">Kuendigungsfrist (Monate)</Label>
            <Input
              id="cancel-months"
              type="number"
              min="0"
              value={cancelMonths}
              onChange={(e) => setCancelMonths(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Vertrag speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
