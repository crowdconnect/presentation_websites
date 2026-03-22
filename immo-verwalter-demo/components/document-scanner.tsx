"use client"

import React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Check, X, Camera } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { useAppStore } from "@/lib/store"
import type { CostCategory, CostEntry, ScannedDocument } from "@/lib/types"
import {
  mergeCategoryDefinitions,
  getCategoryLabel,
  categorySupportsMeter,
  getCategoryUnit,
  orderedCategoryIds,
} from "@/lib/categories"
import { suggestCategory } from "@/lib/helpers"
import { toast } from "sonner"

interface DocumentScannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = "upload" | "review" | "assign"

export function DocumentScanner({ open, onOpenChange }: DocumentScannerProps) {
  const { properties, addCostEntry, addDocument, updateDocument, categoryDefinitions } =
    useAppStore()
  const catDefs = mergeCategoryDefinitions(categoryDefinitions)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<Step>("upload")
  const [scannedDoc, setScannedDoc] = useState<ScannedDocument | null>(null)
  const [preview, setPreview] = useState("")

  // Assignment form state
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties[0]?.id || ""
  )
  const [category, setCategory] = useState<CostCategory>("strom")
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [isIncome, setIsIncome] = useState(false)
  const [meterValue, setMeterValue] = useState("")

  const hasMeter = categorySupportsMeter(category, catDefs)
  const unit = getCategoryUnit(category, catDefs)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)

      const suggested = suggestCategory(file.name)
      const doc: ScannedDocument = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        dataUrl,
        suggestedCategory: suggested,
        suggestedAmount: null,
        suggestedPropertyId: properties[0]?.id || null,
        status: "pending",
      }

      setScannedDoc(doc)
      if (suggested) {
        setCategory(suggested)
        setLabel(getCategoryLabel(suggested, catDefs))
      }
      if (doc.suggestedPropertyId) {
        setSelectedPropertyId(doc.suggestedPropertyId)
      }
      addDocument(doc)
      setStep("review")
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleAssign = () => {
    if (!selectedPropertyId || !amount) return

    const entry: CostEntry = {
      id: `cost-${Date.now()}`,
      propertyId: selectedPropertyId,
      category,
      label: label || getCategoryLabel(category, catDefs),
      amount: Number.parseFloat(amount),
      date,
      isIncome,
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

    if (scannedDoc) {
      updateDocument(scannedDoc.id, {
        status: "assigned",
        assignedPropertyId: selectedPropertyId,
        assignedCategory: category,
        assignedCostEntryId: entry.id,
      })
    }

    toast.success("Dokument zugeordnet und Eintrag erstellt")

    // Reset
    setStep("upload")
    setScannedDoc(null)
    setPreview("")
    setLabel("")
    setAmount("")
    setMeterValue("")
    onOpenChange(false)
  }

  const handleReset = () => {
    setStep("upload")
    setScannedDoc(null)
    setPreview("")
    setLabel("")
    setAmount("")
    setMeterValue("")
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleReset(); onOpenChange(o) }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" && "Dokument scannen"}
            {step === "review" && "Vorschlag pruefen"}
            {step === "assign" && "Zuordnung festlegen"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" &&
              "Laden Sie ein Dokument hoch oder nutzen Sie die Kamera."}
            {step === "review" &&
              "Pruefen Sie den Vorschlag und passen Sie ihn an."}
            {step === "assign" &&
              "Ordnen Sie das Dokument einer Immobilie und Kategorie zu."}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="flex flex-col gap-4">
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-primary/50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Datei hierher ziehen oder klicken
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Datei waehlen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cameraInputRef.current?.click()}
                  className="gap-1"
                >
                  <Camera className="h-4 w-4" />
                  Kamera
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileInput}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>
        )}

        {step === "review" && scannedDoc && (
          <div className="flex flex-col gap-4">
            {preview && (
              <div className="max-h-48 overflow-hidden rounded-lg border border-border">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Gescanntes Dokument"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <Card>
              <CardContent className="p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Automatischer Vorschlag
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dateiname</span>
                    <span className="text-sm text-foreground">
                      {scannedDoc.fileName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kategorie</span>
                    {scannedDoc.suggestedCategory ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {getCategoryLabel(scannedDoc.suggestedCategory, catDefs)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Nicht erkannt
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Immobilie</span>
                    <span className="text-sm text-foreground">
                      {properties.find((p) => p.id === scannedDoc.suggestedPropertyId)
                        ?.name || "Nicht erkannt"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-1 bg-transparent"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
                Verwerfen
              </Button>
              <Button
                className="flex-1 gap-1"
                onClick={() => setStep("assign")}
              >
                <Check className="h-4 w-4" />
                Zuordnen
              </Button>
            </div>
          </div>
        )}

        {step === "assign" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Immobilie</Label>
              <Select
                value={selectedPropertyId}
                onValueChange={setSelectedPropertyId}
              >
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
                onValueChange={(v) => {
                  setCategory(v as CostCategory)
                  setLabel(getCategoryLabel(v as CostCategory, catDefs))
                }}
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
              <Label htmlFor="scan-label">Bezeichnung</Label>
              <Input
                id="scan-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={getCategoryLabel(category, catDefs)}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="scan-amount">Betrag (EUR)</Label>
                <Input
                  id="scan-amount"
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
                <Label htmlFor="scan-date">Datum</Label>
                <Input
                  id="scan-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="scan-income"
                checked={isIncome}
                onCheckedChange={setIsIncome}
              />
              <Label htmlFor="scan-income">
                {isIncome ? "Einnahme" : "Ausgabe"}
              </Label>
            </div>

            {hasMeter && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="scan-meter">
                  Zaehlerstand ({unit})
                </Label>
                <Input
                  id="scan-meter"
                  type="number"
                  step="0.01"
                  placeholder={`Aktueller Zaehlerstand in ${unit}`}
                  value={meterValue}
                  onChange={(e) => setMeterValue(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setStep("review")}
              >
                Zurueck
              </Button>
              <Button className="flex-1" onClick={handleAssign}>
                Speichern
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
