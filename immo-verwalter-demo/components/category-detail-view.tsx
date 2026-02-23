"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  FileText,
  ImageIcon,
  Download,
  Link2,
  Unlink,
  Trash2,
  Upload,
  Camera,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Property, CostCategory, ScannedDocument } from "@/lib/types"
import {
  CATEGORY_LABELS,
  CATEGORIES_WITH_METER,
  CATEGORY_UNITS,
} from "@/lib/types"
import {
  getCostsByMonth,
  getConsumptionOverTime,
  getMeterReadingsOverTime,
  getAnnualConsumption,
  getConsumptionStatus,
  formatCurrency,
  formatMonth,
} from "@/lib/helpers"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

interface CategoryDetailViewProps {
  property: Property
  category: CostCategory
  onBack: () => void
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-foreground">{formatMonth(label)}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {entry.name === "Verbrauch" || entry.name === "Zaehlerstand"
            ? `${Math.round(entry.value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
            : formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function CategoryDetailView({ property, category, onBack }: CategoryDetailViewProps) {
  const { documents, updateDocument, deleteDocument, deleteCostEntry, addDocument } = useAppStore()
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkTargetDocId, setLinkTargetDocId] = useState<string | null>(null)
  const [linkTargetEntryId, setLinkTargetEntryId] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [quickUploadEntryId, setQuickUploadEntryId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const hasMeter = CATEGORIES_WITH_METER.includes(category)
  const unit = CATEGORY_UNITS[category] || ""
  const catLabel = CATEGORY_LABELS[category]

  const catCosts = property.costs
    .filter((c) => c.category === category)
    .sort((a, b) => b.date.localeCompare(a.date))

  const catDocuments = documents.filter(
    (d) =>
      (d.assignedPropertyId === property.id && d.assignedCategory === category) ||
      (d.suggestedCategory === category && d.suggestedPropertyId === property.id && d.status === "pending")
  )

  const monthlyData = getCostsByMonth(property.costs, category)
  const consumptionData = hasMeter ? getConsumptionOverTime(property.costs, category) : []
  const meterData = hasMeter ? getMeterReadingsOverTime(property.costs, category) : []
  const annualConsumption = hasMeter ? getAnnualConsumption(property, category) : 0
  const consumptionStatus = hasMeter ? getConsumptionStatus(property, category) : "normal"
  const threshold = property.thresholds.find((t) => t.category === category)

  const totalExpense = catCosts.filter((c) => !c.isIncome).reduce((s, c) => s + c.amount, 0)
  const totalIncome = catCosts.filter((c) => c.isIncome).reduce((s, c) => s + c.amount, 0)
  const avgMonthly = monthlyData.length > 0 ? Math.round(totalExpense / monthlyData.length) : 0
  const projectedAnnual = avgMonthly * 12

  const statusColors = {
    normal: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    critical: "bg-destructive/10 text-destructive",
  }

  function getDocForEntry(entryId: string): ScannedDocument | undefined {
    return documents.find((d) => d.assignedCostEntryId === entryId)
  }

  function handleUnlinkDoc(docId: string) {
    updateDocument(docId, { assignedCostEntryId: undefined, status: "pending" })
    toast.success("Dokument wurde vom Eintrag geloest")
  }

  function handleLinkDoc(docId: string) {
    setLinkTargetDocId(docId)
    setLinkTargetEntryId("")
    setLinkDialogOpen(true)
  }

  function confirmLink() {
    if (!linkTargetDocId || !linkTargetEntryId) return
    updateDocument(linkTargetDocId, {
      assignedCostEntryId: linkTargetEntryId,
      assignedPropertyId: property.id,
      assignedCategory: category,
      status: "assigned",
    })
    setLinkDialogOpen(false)
    toast.success("Dokument wurde dem Eintrag zugeordnet")
  }

  function handleDeleteDoc(docId: string) {
    deleteDocument(docId)
    toast.success("Dokument wurde geloescht")
  }

  function handleFileUpload(file: File, entryId?: string) {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const doc: ScannedDocument = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        dataUrl,
        suggestedCategory: category,
        suggestedAmount: null,
        suggestedPropertyId: property.id,
        assignedPropertyId: property.id,
        assignedCategory: category,
        assignedCostEntryId: entryId,
        status: entryId ? "assigned" : "pending",
      }
      addDocument(doc)
      toast.success(entryId ? "Dokument hochgeladen und zugeordnet" : "Dokument hochgeladen")
    }
    reader.readAsDataURL(file)
    setUploadDialogOpen(false)
    setQuickUploadEntryId(null)
  }

  function triggerQuickUpload(entryId: string, useCamera: boolean) {
    setQuickUploadEntryId(entryId)
    if (useCamera) {
      cameraInputRef.current?.click()
    } else {
      fileInputRef.current?.click()
    }
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, quickUploadEntryId || undefined)
    }
    e.target.value = ""
  }

  // Compute consumption for an entry
  function getEntryConsumption(entryId: string): number | null {
    const sortedAsc = [...catCosts].sort((a, b) => a.date.localeCompare(b.date))
    const idx = sortedAsc.findIndex((e) => e.id === entryId)
    const entry = sortedAsc[idx]
    if (!hasMeter || !entry?.meterReading || idx <= 0 || !sortedAsc[idx - 1]?.meterReading) return null
    return entry.meterReading.value - sortedAsc[idx - 1].meterReading!.value
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file inputs for quick upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={onFileSelected}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileSelected}
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 shrink-0">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Zurueck</span>
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-foreground sm:text-lg">{catLabel}</h2>
          <p className="truncate text-xs text-muted-foreground">{property.name}</p>
        </div>
        {hasMeter && (
          <Badge variant="outline" className={`shrink-0 text-xs ${statusColors[consumptionStatus]}`}>
            {Math.round(annualConsumption).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}/J
          </Badge>
        )}
      </div>

      {/* Summary cards - 2 col grid on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground sm:text-xs">Gesamt</p>
            <p className="text-sm font-bold text-foreground sm:text-xl">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
        {category === "miete_einnahme" && (
          <Card>
            <CardContent className="p-3">
              <p className="text-[10px] text-muted-foreground sm:text-xs">Einnahmen</p>
              <p className="text-sm font-bold text-success sm:text-xl">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground sm:text-xs">{"\\u00D8"} / Monat</p>
            <p className="text-sm font-bold text-foreground sm:text-xl">{formatCurrency(avgMonthly)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground sm:text-xs">Prognose/J</p>
            <p className="text-sm font-bold text-foreground sm:text-xl">{formatCurrency(projectedAnnual)}</p>
          </CardContent>
        </Card>
        {hasMeter && (
          <Card>
            <CardContent className="p-3">
              <p className="text-[10px] text-muted-foreground sm:text-xs">Verbrauch/J</p>
              <p className="text-sm font-bold text-foreground sm:text-xl">
                {Math.round(annualConsumption).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="data" className="flex flex-col gap-3">
        <TabsList className="w-full">
          <TabsTrigger value="data" className="flex-1 text-xs sm:text-sm">
            Eintraege ({catCosts.length})
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex-1 text-xs sm:text-sm">
            Diagramme
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 text-xs sm:text-sm">
            Dokumente ({catDocuments.length})
          </TabsTrigger>
        </TabsList>

        {/* Mobile-first entry list */}
        <TabsContent value="data">
          <div className="flex flex-col gap-2">
            {catCosts.map((entry) => {
              const doc = getDocForEntry(entry.id)
              const consumption = getEntryConsumption(entry.id)
              const isExpanded = expandedEntry === entry.id

              return (
                <Card key={entry.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Main row - always visible */}
                    <div className="flex items-center gap-2 p-3">
                      {/* Date + label */}
                      <div
                        className="min-w-0 flex-1 cursor-pointer"
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setExpandedEntry(isExpanded ? null : entry.id)
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{formatDateDeterministic(entry.date)}</span>
                          {doc && <FileText className="h-3 w-3 shrink-0 text-primary" />}
                        </div>
                        <p className="truncate text-sm font-medium text-foreground">{entry.label}</p>
                        {hasMeter && entry.meterReading && (
                          <p className="text-xs text-muted-foreground">
                            {Math.round(entry.meterReading.value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}
                            {consumption !== null && (
                              <span className="ml-1 text-foreground">
                                (+{consumption.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")})
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="shrink-0 text-right">
                        <p className={`text-sm font-semibold ${entry.isIncome ? "text-success" : "text-foreground"}`}>
                          {entry.isIncome ? "+" : "-"}{formatCurrency(entry.amount)}
                        </p>
                      </div>

                      {/* Quick upload buttons */}
                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => triggerQuickUpload(entry.id, true)}
                          title="Foto aufnehmen"
                        >
                          <Camera className="h-4 w-4" />
                          <span className="sr-only">Foto aufnehmen</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => triggerQuickUpload(entry.id, false)}
                          title="Dokument hochladen"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="sr-only">Dokument hochladen</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <span className="sr-only">Details</span>
                        </Button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-border bg-muted/30 px-3 py-2">
                        <div className="flex flex-col gap-2">
                          {hasMeter && entry.meterReading && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Zaehlerstand</span>
                              <span className="font-medium text-foreground">
                                {Math.round(entry.meterReading.value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}
                              </span>
                            </div>
                          )}
                          {consumption !== null && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Verbrauch</span>
                              <span className="font-medium text-foreground">
                                {consumption.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}
                              </span>
                            </div>
                          )}

                          {/* Linked document */}
                          {doc && (
                            <div className="flex items-center gap-2 rounded-md bg-primary/5 p-2">
                              <FileText className="h-4 w-4 shrink-0 text-primary" />
                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{doc.fileName}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-primary"
                                onClick={() => { if (doc.dataUrl) window.open(doc.dataUrl, "_blank") }}
                              >
                                <Eye className="h-3 w-3" />
                                <span className="sr-only">Ansehen</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleUnlinkDoc(doc.id)}
                              >
                                <Unlink className="h-3 w-3" />
                                <span className="sr-only">Loesen</span>
                              </Button>
                            </div>
                          )}

                          {/* Actions row */}
                          <div className="flex items-center gap-1 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 flex-1 gap-1 bg-transparent text-xs"
                              onClick={() => triggerQuickUpload(entry.id, true)}
                            >
                              <Camera className="h-3.5 w-3.5" />
                              Foto
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 flex-1 gap-1 bg-transparent text-xs"
                              onClick={() => triggerQuickUpload(entry.id, false)}
                            >
                              <Paperclip className="h-3.5 w-3.5" />
                              Datei
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteCostEntry(property.id, entry.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Loeschen</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            {catCosts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-8">
                  <p className="text-sm text-muted-foreground">Keine Eintraege vorhanden</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Charts */}
        <TabsContent value="charts">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
                <CardTitle className="text-sm sm:text-base">Ausgaben ueber Zeit</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      />
                      <YAxis
                        tickFormatter={(v) => `${v}\u20AC`}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        width={45}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="cost" name="Ausgaben" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      {category === "miete_einnahme" && (
                        <Bar dataKey="income" name="Einnahmen" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} maxBarSize={28} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {hasMeter && (
              <>
                <Card>
                  <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
                    <CardTitle className="text-sm sm:text-base">Zaehlerstand ({unit})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <div className="h-44 sm:h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={meterData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                          <defs>
                            <linearGradient id={`cat-grad-${category}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis
                            dataKey="month"
                            tickFormatter={formatMonth}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={50} />
                          <Tooltip content={<ChartTooltip />} />
                          <Area type="monotone" dataKey="value" name="Zaehlerstand" stroke="hsl(var(--primary))" fill={`url(#cat-grad-${category})`} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
                    <CardTitle className="text-sm sm:text-base">Verbrauch ({unit}/Monat)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <div className="h-44 sm:h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={consumptionData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis
                            dataKey="month"
                            tickFormatter={formatMonth}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          />
                          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={40} />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="consumption" name="Verbrauch" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} maxBarSize={24} />
                          {threshold && (
                            <ReferenceLine
                              y={Math.round(threshold.warningValue / 12)}
                              stroke="hsl(var(--warning))"
                              strokeDasharray="4 4"
                              label={{ value: "Warn.", fill: "hsl(var(--warning))", fontSize: 9, position: "insideTopRight" }}
                            />
                          )}
                          {threshold && (
                            <ReferenceLine
                              y={Math.round(threshold.criticalValue / 12)}
                              stroke="hsl(var(--destructive))"
                              strokeDasharray="4 4"
                              label={{ value: "Krit.", fill: "hsl(var(--destructive))", fontSize: 9, position: "insideTopRight" }}
                            />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    {threshold && (
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground sm:text-xs">
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-warning" />
                          Warn: {threshold.warningValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}/J
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
                          Krit: {threshold.criticalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}/J
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Dokumente fuer {catLabel}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 bg-transparent text-xs"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-3.5 w-3.5" />
                Hochladen
              </Button>
            </div>

            {catDocuments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-2 p-8">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Keine Dokumente</p>
                  <p className="text-center text-xs text-muted-foreground">
                    Laden Sie Rechnungen oder Zaehlerstandfotos hoch
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-2">
                {catDocuments.map((doc) => {
                  const linkedEntry = doc.assignedCostEntryId
                    ? catCosts.find((c) => c.id === doc.assignedCostEntryId)
                    : null
                  const isImage = doc.dataUrl.startsWith("data:image") || doc.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)

                  return (
                    <Card key={doc.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 p-3">
                          {/* Thumbnail */}
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                            {isImage ? (
                              <img src={doc.dataUrl || "/placeholder.svg"} alt={doc.fileName} className="h-full w-full object-cover" />
                            ) : (
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{doc.fileName}</p>
                            {linkedEntry ? (
                              <p className="text-xs text-muted-foreground">
                                {formatDateDeterministic(linkedEntry.date)} - {formatCurrency(linkedEntry.amount)}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">Nicht zugeordnet</p>
                            )}
                          </div>

                          {/* Status */}
                          <Badge
                            variant="outline"
                            className={`shrink-0 text-[10px] ${
                              doc.status === "assigned" ? "bg-success/10 text-success" :
                              doc.status === "pending" ? "bg-warning/10 text-warning" :
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {doc.status === "assigned" ? "Zugeordnet" : doc.status === "pending" ? "Offen" : "Verworfen"}
                          </Badge>

                          {/* Actions */}
                          <div className="flex shrink-0 items-center gap-0.5">
                            {doc.dataUrl && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(doc.dataUrl, "_blank")}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ansehen</span>
                              </Button>
                            )}
                            {linkedEntry ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleUnlinkDoc(doc.id)}>
                                <Unlink className="h-4 w-4" />
                                <span className="sr-only">Loesen</span>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleLinkDoc(doc.id)}>
                                <Link2 className="h-4 w-4" />
                                <span className="sr-only">Zuordnen</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteDoc(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Loeschen</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Link dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokument zuordnen</DialogTitle>
            <DialogDescription>Waehlen Sie einen Eintrag fuer dieses Dokument.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Eintrag</Label>
              <Select value={linkTargetEntryId} onValueChange={setLinkTargetEntryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Eintrag waehlen..." />
                </SelectTrigger>
                <SelectContent>
                  {catCosts.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {formatDateDeterministic(e.date)} - {formatCurrency(e.amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setLinkDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button className="flex-1" onClick={confirmLink} disabled={!linkTargetEntryId}>
                Zuordnen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-lg sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
            <DialogDescription>Laden Sie ein Dokument fuer {catLabel} hoch.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/50 p-6"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files?.[0]
                if (file) handleFileUpload(file)
              }}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-center text-xs text-muted-foreground">Datei hierher ziehen oder auswaehlen</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-1 bg-transparent text-xs"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*"
                  input.capture = "environment"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                <Camera className="h-3.5 w-3.5" />
                Kamera
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-1 bg-transparent text-xs"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*,.pdf"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                <Paperclip className="h-3.5 w-3.5" />
                Datei
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatDateDeterministic(dateStr: string): string {
  const [year, month, day] = dateStr.split("-")
  return `${day || "01"}.${month}.${year}`
}
