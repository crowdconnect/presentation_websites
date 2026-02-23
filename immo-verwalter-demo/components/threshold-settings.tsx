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
import { useAppStore } from "@/lib/store"
import type { Property, CostCategory } from "@/lib/types"
import { CATEGORIES_WITH_METER, CATEGORY_LABELS, CATEGORY_UNITS } from "@/lib/types"
import { toast } from "sonner"

interface ThresholdSettingsProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThresholdSettings({
  property,
  open,
  onOpenChange,
}: ThresholdSettingsProps) {
  const { updateThreshold } = useAppStore()

  const [values, setValues] = useState(() => {
    const map: Record<string, { warning: string; critical: string }> = {}
    for (const cat of CATEGORIES_WITH_METER) {
      const t = property.thresholds.find((th) => th.category === cat)
      map[cat] = {
        warning: t ? String(t.warningValue) : "",
        critical: t ? String(t.criticalValue) : "",
      }
    }
    return map
  })

  const handleSave = () => {
    for (const cat of CATEGORIES_WITH_METER) {
      const v = values[cat]
      if (v.warning && v.critical) {
        updateThreshold(property.id, {
          category: cat as CostCategory,
          warningValue: Number.parseFloat(v.warning),
          criticalValue: Number.parseFloat(v.critical),
          unit: CATEGORY_UNITS[cat as CostCategory] || "",
        })
      }
    }
    toast.success("Grenzwerte aktualisiert")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Verbrauch-Grenzwerte</DialogTitle>
          <DialogDescription>
            Definieren Sie Warn- und Kritisch-Schwellen fuer den Jahresverbrauch.
            Ueberschreitungen werden farblich auf der Uebersicht markiert.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {CATEGORIES_WITH_METER.map((cat) => {
            const unit = CATEGORY_UNITS[cat as CostCategory]
            return (
              <div key={cat} className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {CATEGORY_LABELS[cat as CostCategory]} ({unit}/Jahr)
                </p>
                <div className="flex gap-3">
                  <div className="flex flex-1 flex-col gap-1">
                    <Label className="text-xs text-warning">Warnung</Label>
                    <Input
                      type="number"
                      value={values[cat]?.warning ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [cat]: { ...prev[cat], warning: e.target.value },
                        }))
                      }
                      placeholder="z.B. 3500"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Label className="text-xs text-destructive">Kritisch</Label>
                    <Input
                      type="number"
                      value={values[cat]?.critical ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [cat]: { ...prev[cat], critical: e.target.value },
                        }))
                      }
                      placeholder="z.B. 4500"
                    />
                  </div>
                </div>
              </div>
            )
          })}
          <Button onClick={handleSave} className="w-full">
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
