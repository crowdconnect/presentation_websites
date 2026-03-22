"use client"

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
import { useAppStore } from "@/lib/store"
import type { CategoryBehavior, CategoryDefinition } from "@/lib/types"
import { BUILT_IN_CATEGORY_DEFINITIONS } from "@/lib/types"
import { toast } from "sonner"

function slugId(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_äöüß]/g, "")
    .slice(0, 40)
  return base || `kat_${Date.now()}`
}

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const { addCategoryDefinition, categoryDefinitions } = useAppStore()
  const [label, setLabel] = useState("")
  const [behavior, setBehavior] = useState<CategoryBehavior>("fixed")
  const [supportsMeter, setSupportsMeter] = useState(false)
  const [unit, setUnit] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return
    let id = slugId(label)
    const built = new Set(BUILT_IN_CATEGORY_DEFINITIONS.map((c) => c.id))
    const custom = new Set(categoryDefinitions.map((c) => c.id))
    if (built.has(id) || custom.has(id)) {
      id = `${id}_${Date.now()}`
    }
    const def: CategoryDefinition = {
      id,
      label: label.trim(),
      behavior,
      supportsMeter: behavior === "consumption" ? supportsMeter : false,
      defaultUnit: unit.trim() || undefined,
    }
    addCategoryDefinition(def)
    toast.success("Kategorie hinzugefuegt")
    setLabel("")
    setBehavior("fixed")
    setSupportsMeter(false)
    setUnit("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Kategorie</DialogTitle>
          <DialogDescription>
            Z. B. Regenwasserkosten oder separate Versicherungslinie. Erscheint in Kosten,
            Verträgen und Plan/Ist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-label">Bezeichnung</Label>
            <Input
              id="cat-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="z.B. Regenwasserkosten"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Art</Label>
            <Select
              value={behavior}
              onValueChange={(v) => setBehavior(v as CategoryBehavior)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Festbetrag / pauschal</SelectItem>
                <SelectItem value="consumption">Verbrauch (Zähler möglich)</SelectItem>
                <SelectItem value="income">Einnahme</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {behavior === "consumption" && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="meter"
                  checked={supportsMeter}
                  onChange={(e) => setSupportsMeter(e.target.checked)}
                  className="rounded border"
                />
                <Label htmlFor="meter">Zählerstand erfassen</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="unit">Einheit (optional)</Label>
                <Input
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kWh, m³, …"
                />
              </div>
            </>
          )}
          <Button type="submit" className="w-full">
            Kategorie speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
