"use client"

import { useEffect, useState } from "react"
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
import type { CostCategory, Contract, BillingCycle } from "@/lib/types"
import {
  mergeCategoryDefinitions,
  categoriesForContracts,
  categorySupportsMeter,
  getCategoryUnit,
} from "@/lib/categories"
import { toast } from "sonner"

export interface AddContractDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Wenn gesetzt: keine Immobilien-Auswahl, Vertrag wird diesem Objekt zugeordnet */
  fixedPropertyId?: string
}

export function AddContractDialog({
  open,
  onOpenChange,
  fixedPropertyId,
}: AddContractDialogProps) {
  const { properties, addContract, categoryDefinitions } = useAppStore()
  const catDefs = mergeCategoryDefinitions(categoryDefinitions)
  const contractCats = categoriesForContracts(catDefs)
  const [propertyId, setPropertyId] = useState(
    fixedPropertyId ?? properties[0]?.id ?? ""
  )
  const [category, setCategory] = useState<CostCategory>("strom")
  const [provider, setProvider] = useState("")
  const [monthlyCost, setMonthlyCost] = useState("")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [annualAmount, setAnnualAmount] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [cancelMonths, setCancelMonths] = useState("3")
  const [annualConsumptionBasis, setAnnualConsumptionBasis] = useState("")
  const [pdfAttachment, setPdfAttachment] = useState<{
    fileName: string
    dataUrl: string
  } | null>(null)

  const consumptionUnit = getCategoryUnit(category, catDefs) || ""
  const showConsumptionField = categorySupportsMeter(category, catDefs)

  useEffect(() => {
    if (!open) return
    if (fixedPropertyId) {
      setPropertyId(fixedPropertyId)
    } else {
      setPropertyId((prev) => prev || properties[0]?.id || "")
    }
  }, [open, fixedPropertyId, properties])

  useEffect(() => {
    if (!open) setPdfAttachment(null)
  }, [open])

  function onContractPdfSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast.error("Bitte eine PDF-Datei waehlen")
      e.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () =>
      setPdfAttachment({ fileName: file.name, dataUrl: reader.result as string })
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pid = fixedPropertyId ?? propertyId
    if (!pid || !provider || !startDate || !endDate) return
    if (billingCycle === "monthly" && !monthlyCost) return
    if (billingCycle === "annual" && !annualAmount) return

    const m = Number.parseFloat(monthlyCost || "0")
    const ann = Number.parseFloat(annualAmount || "0")
    const basisRaw = annualConsumptionBasis.trim()
    const basisParsed =
      showConsumptionField && basisRaw !== ""
        ? Number.parseFloat(basisRaw.replace(",", "."))
        : Number.NaN
    const annualConsumptionBasisNum =
      showConsumptionField && Number.isFinite(basisParsed) && basisParsed > 0
        ? basisParsed
        : undefined

    const contract: Contract = {
      id: `contract-${Date.now()}`,
      propertyId: pid,
      category,
      provider,
      monthlyCost: billingCycle === "monthly" ? m : ann / 12,
      annualAmount: billingCycle === "annual" ? ann : undefined,
      billingCycle,
      startDate,
      endDate,
      cancellationPeriodMonths: Number.parseInt(cancelMonths, 10),
      notified: false,
      annualConsumptionBasis: annualConsumptionBasisNum,
      contractPdfFileName: pdfAttachment?.fileName,
      contractPdfDataUrl: pdfAttachment?.dataUrl,
    }

    addContract(contract)
    toast.success("Vertrag hinzugefuegt")
    setProvider("")
    setMonthlyCost("")
    setAnnualAmount("")
    setBillingCycle("monthly")
    setStartDate("")
    setEndDate("")
    setAnnualConsumptionBasis("")
    setPdfAttachment(null)
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
          {!fixedPropertyId && (
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
          )}

          <div className="flex flex-col gap-2">
            <Label>Kategorie</Label>
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v as CostCategory)
                setAnnualConsumptionBasis("")
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contractCats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Abrechnung</Label>
            <Select
              value={billingCycle}
              onValueChange={(v) => setBillingCycle(v as BillingCycle)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monatlich</SelectItem>
                <SelectItem value="annual">Jaehrlich</SelectItem>
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

          {billingCycle === "monthly" ? (
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
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="contract-annual">Jahresbetrag (EUR)</Label>
              <Input
                id="contract-annual"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={annualAmount}
                onChange={(e) => setAnnualAmount(e.target.value)}
                required
              />
            </div>
          )}

          {showConsumptionField && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="contract-consumption-basis">
                Jahresverbrauch laut Vertrag ({consumptionUnit}/Jahr, optional)
              </Label>
              <Input
                id="contract-consumption-basis"
                type="number"
                step="0.01"
                min="0"
                placeholder="z.B. 3200"
                value={annualConsumptionBasis}
                onChange={(e) => setAnnualConsumptionBasis(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Grundlage fuer Verbrauchs-Hochrechnung und Vergleich mit dem Zaehler im Kalenderjahr.
              </p>
            </div>
          )}

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

          <div className="flex flex-col gap-2">
            <Label htmlFor="contract-pdf">Vertrags-PDF (optional)</Label>
            <Input
              id="contract-pdf"
              type="file"
              accept="application/pdf"
              onChange={onContractPdfSelected}
              className="cursor-pointer text-sm file:mr-2 file:text-xs"
            />
            {pdfAttachment && (
              <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5 text-xs">
                <span className="min-w-0 truncate text-foreground">{pdfAttachment.fileName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 px-2 text-xs"
                  onClick={() => setPdfAttachment(null)}
                >
                  Entfernen
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Vertrag speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
