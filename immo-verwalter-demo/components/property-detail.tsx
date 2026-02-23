"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  Plus,
  Zap,
  Flame,
  Droplets,
  Wifi,
  Shield,
  Landmark,
  Home,
  Wrench,
  Banknote,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Camera,
  Paperclip,
  FileText,
  ChevronRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Property, CostCategory, ScannedDocument } from "@/lib/types"
import { CATEGORY_LABELS, CATEGORIES_WITH_METER, CATEGORY_UNITS } from "@/lib/types"
import {
  getMonthlyTotalCost,
  getMonthlyTotalIncome,
  getAnnualCostTotal,
  getAnnualIncomeTotal,
  getMonthlyAverage,
  getProjectedAnnualCost,
  getAnnualConsumption,
  getConsumptionStatus,
  formatCurrency,
  getCostsByMonth,
} from "@/lib/helpers"
import { useAppStore } from "@/lib/store"
import { CostCharts } from "@/components/cost-charts"
import { AddCostDialog } from "@/components/add-cost-dialog"
import { ThresholdSettings } from "@/components/threshold-settings"
import { CategoryDetailView } from "@/components/category-detail-view"
import { toast } from "sonner"

const categoryIcons: Record<CostCategory, LucideIcon> = {
  strom: Zap,
  gas: Flame,
  wasser: Droplets,
  internet: Wifi,
  versicherung: Shield,
  grundsteuer: Landmark,
  hausgeld: Home,
  reparatur: Wrench,
  miete_einnahme: Banknote,
  sonstige: MoreHorizontal,
}

const statusBg = {
  normal: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
}

interface PropertyDetailProps {
  property: Property
  onBack: () => void
}

export function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [showAddCost, setShowAddCost] = useState(false)
  const [showThresholds, setShowThresholds] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CostCategory | null>(null)
  const { addDocument, documents } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [uploadTargetEntryId, setUploadTargetEntryId] = useState<string | null>(null)

  const monthlyCost = getMonthlyTotalCost(property)
  const monthlyIncome = getMonthlyTotalIncome(property)
  const annualCost = getAnnualCostTotal(property)
  const annualIncome = getAnnualIncomeTotal(property)
  const monthlyAvg = getMonthlyAverage(property)
  const projectedAnnual = getProjectedAnnualCost(property)

  const categories = Object.keys(CATEGORY_LABELS) as CostCategory[]

  const categorySummary = categories.map((cat) => {
    const catCosts = property.costs.filter((c) => c.category === cat)
    const monthlyData = getCostsByMonth(catCosts)
    const totalCost = catCosts.filter((c) => !c.isIncome).reduce((s, c) => s + c.amount, 0)
    const totalIncome = catCosts.filter((c) => c.isIncome).reduce((s, c) => s + c.amount, 0)
    const avgMonthly = monthlyData.length > 0 ? Math.round(totalCost / monthlyData.length) : 0
    const hasMeter = CATEGORIES_WITH_METER.includes(cat)
    const consumption = hasMeter ? getAnnualConsumption(property, cat) : 0
    const status = hasMeter ? getConsumptionStatus(property, cat) : "normal"
    const unit = CATEGORY_UNITS[cat]
    const Icon = categoryIcons[cat]
    return { category: cat, label: CATEGORY_LABELS[cat], Icon, totalCost, totalIncome, avgMonthly, hasMeter, consumption, status, unit, entryCount: catCosts.length }
  }).filter((s) => s.entryCount > 0)

  function getDocForEntry(entryId: string): ScannedDocument | undefined {
    return documents.find((d) => d.assignedCostEntryId === entryId)
  }

  function handleQuickUpload(entryId: string, useCamera: boolean) {
    setUploadTargetEntryId(entryId)
    if (useCamera) {
      cameraInputRef.current?.click()
    } else {
      fileInputRef.current?.click()
    }
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const entry = property.costs.find((c) => c.id === uploadTargetEntryId)
    const reader = new FileReader()
    reader.onload = () => {
      const doc: ScannedDocument = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        dataUrl: reader.result as string,
        suggestedCategory: entry?.category || null,
        suggestedAmount: entry?.amount || null,
        suggestedPropertyId: property.id,
        assignedPropertyId: property.id,
        assignedCategory: entry?.category,
        assignedCostEntryId: uploadTargetEntryId || undefined,
        status: "assigned",
      }
      addDocument(doc)
      toast.success("Dokument hochgeladen und zugeordnet")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
    setUploadTargetEntryId(null)
  }

  // All entries sorted by date desc for the "Alle Eintraege" tab
  const sortedCosts = [...property.costs].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={onFileSelected} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileSelected} />

      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:px-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Zurueck</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-foreground sm:text-lg">{property.name}</h1>
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">{property.address}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowThresholds(true)} className="hidden bg-transparent sm:flex">
            Grenzwerte
          </Button>
          <Button size="sm" onClick={() => setShowAddCost(true)} className="gap-1 text-xs sm:text-sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Eintrag</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        {selectedCategory ? (
          <CategoryDetailView
            property={property}
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        ) : (
        <>
        {/* Summary Cards - 2 col on mobile */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:grid-cols-4 sm:gap-4">
          <SummaryCard
            title="Monatskosten"
            value={formatCurrency(monthlyCost)}
            subtitle={`Einn.: ${formatCurrency(monthlyIncome)}`}
            icon={Calendar}
            trend={monthlyIncome - monthlyCost >= 0 ? "up" : "down"}
          />
          <SummaryCard
            title="Jahreskosten"
            value={formatCurrency(annualCost)}
            subtitle={`Einn.: ${formatCurrency(annualIncome)}`}
            icon={BarChart3}
            trend={annualIncome - annualCost >= 0 ? "up" : "down"}
          />
          <SummaryCard
            title="\u00D8 / Monat"
            value={formatCurrency(monthlyAvg)}
            subtitle="alle Monate"
            icon={TrendingUp}
          />
          <SummaryCard
            title="Prognose/J"
            value={formatCurrency(projectedAnnual)}
            subtitle="auf Basis \u00D8"
            icon={TrendingDown}
          />
        </div>

        <Tabs defaultValue="overview" className="flex flex-col gap-3">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1 text-xs sm:text-sm">Kategorien</TabsTrigger>
            <TabsTrigger value="charts" className="flex-1 text-xs sm:text-sm">Diagramme</TabsTrigger>
            <TabsTrigger value="entries" className="flex-1 text-xs sm:text-sm">Eintraege</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {categorySummary.map((s) => {
                const Icon = s.Icon
                return (
                  <Card
                    key={s.category}
                    className="cursor-pointer transition-shadow hover:shadow-md active:scale-[0.99]"
                    onClick={() => setSelectedCategory(s.category)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-foreground">{s.label}</span>
                            {s.hasMeter && (
                              <Badge variant="outline" className={`shrink-0 text-[10px] ${statusBg[s.status]}`}>
                                {Math.round(s.consumption).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {s.unit}/J
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatCurrency(s.category === "miete_einnahme" ? s.totalIncome : s.totalCost)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {"\u00D8"} {formatCurrency(s.avgMonthly)}/M
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <CostCharts property={property} />
          </TabsContent>

          <TabsContent value="entries">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">{sortedCosts.length} Eintraege</p>
              {sortedCosts.map((entry) => {
                const doc = getDocForEntry(entry.id)
                return (
                  <Card key={entry.id}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 p-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground sm:text-xs">
                              {formatDateDeterministic(entry.date)}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {CATEGORY_LABELS[entry.category]}
                            </Badge>
                            {doc && <FileText className="h-3 w-3 shrink-0 text-primary" />}
                          </div>
                          <p className="truncate text-sm font-medium text-foreground">{entry.label}</p>
                          {entry.meterReading && (
                            <p className="text-[10px] text-muted-foreground">
                              {Math.round(entry.meterReading.value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {entry.meterReading.unit}
                            </p>
                          )}
                        </div>
                        <p className={`shrink-0 text-sm font-semibold ${entry.isIncome ? "text-success" : "text-foreground"}`}>
                          {entry.isIncome ? "+" : "-"}{formatCurrency(entry.amount)}
                        </p>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleQuickUpload(entry.id, true)}
                            title="Foto aufnehmen"
                          >
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Foto aufnehmen</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleQuickUpload(entry.id, false)}
                            title="Dokument hochladen"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="sr-only">Dokument hochladen</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {sortedCosts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    Keine Eintraege vorhanden
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </>
        )}
      </main>

      <AddCostDialog propertyId={property.id} open={showAddCost} onOpenChange={setShowAddCost} />
      <ThresholdSettings property={property} open={showThresholds} onOpenChange={setShowThresholds} />
    </div>
  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  trend?: "up" | "down"
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-muted-foreground sm:text-xs">{title}</p>
          <p className="truncate text-sm font-bold text-foreground sm:text-xl">{value}</p>
          <p className="truncate text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        {trend && (
          <div className="mt-0.5 shrink-0">
            {trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-success sm:h-4 sm:w-4" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive sm:h-4 sm:w-4" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDateDeterministic(dateStr: string): string {
  const [year, month, day] = dateStr.split("-")
  return `${day || "01"}.${month}.${year}`
}
