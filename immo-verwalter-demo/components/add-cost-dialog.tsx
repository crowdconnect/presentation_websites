"use client"

import React from "react"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { useAppStore } from "@/lib/store"
import type { CostCategory, CostEntry } from "@/lib/types"
import {
  mergeCategoryDefinitions,
  getCategoryLabel,
  categorySupportsMeter,
  getCategoryUnit,
  orderedCategoryIds,
} from "@/lib/categories"
import { toast } from "sonner"

interface AddCostDialogProps {
  propertyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCostDialog({ propertyId, open, onOpenChange }: AddCostDialogProps) {
  const { addCostEntry, categoryDefinitions } = useAppStore()
  const catDefs = mergeCategoryDefinitions(categoryDefinitions)
  const [category, setCategory] = useState<CostCategory>("strom")
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [isIncome, setIsIncome] = useState(false)
  const [meterValue, setMeterValue] = useState("")
  const [note, setNote] = useState("")

  const hasMeter = categorySupportsMeter(category, catDefs)
  const unit = getCategoryUnit(category, catDefs)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !date) return

    const entry: CostEntry = {
      id: `cost-${Date.now()}`,
      propertyId,
      category,
      label: label || getCategoryLabel(category, catDefs),
      amount: Number.parseFloat(amount),
      date,
      isIncome,
      note: note || undefined,
    }

    if (hasMeter && meterValue) {
      entry.meterReading = {
        id: `mr-${Date.now()}`,
        date,
        value: Number.parseFloat(meterValue),
        unit: unit || "",
      }
    }

    addCostEntry(entry)
    toast.success("Kosteneintrag hinzugefuegt")
    setLabel("")
    setAmount("")
    setMeterValue("")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neuer Kosteneintrag</DialogTitle>
          <DialogDescription>
            Erfassen Sie eine neue Ausgabe oder Einnahme.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                {orderedCategoryIds(catDefs).map((id) => (
                  <SelectItem key={id} value={id}>
                    {getCategoryLabel(id, catDefs)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cost-label">Bezeichnung</Label>
            <Input
              id="cost-label"
              placeholder={getCategoryLabel(category, catDefs)}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="cost-amount">Betrag (EUR)</Label>
              <Input
                id="cost-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="cost-date">Datum</Label>
              <Input
                id="cost-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is-income"
              checked={isIncome}
              onCheckedChange={setIsIncome}
            />
            <Label htmlFor="is-income">
              {isIncome ? "Einnahme" : "Ausgabe"}
            </Label>
          </div>

          {hasMeter && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="meter-value">
                Zaehlerstand ({unit})
              </Label>
              <Input
                id="meter-value"
                type="number"
                step="0.01"
                placeholder={`Aktueller Zaehlerstand in ${unit}`}
                value={meterValue}
                onChange={(e) => setMeterValue(e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="cost-note">Notiz (optional)</Label>
            <Input
              id="cost-note"
              placeholder="Optionale Notiz"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Eintrag speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
