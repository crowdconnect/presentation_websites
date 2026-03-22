"use client"

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
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Property, CostCategory } from "@/lib/types"
import { CATEGORIES_WITH_METER } from "@/lib/types"
import {
  mergeCategoryDefinitions,
  getCategoryLabel,
  getCategoryUnit,
} from "@/lib/categories"
import {
  getCostsByMonth,
  getConsumptionOverTime,
  getMeterReadingsOverTime,
  formatMonth,
  formatCurrency,
} from "@/lib/helpers"
import { useAppStore } from "@/lib/store"

interface CostChartsProps {
  property: Property
}

function CostTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-sm font-medium text-foreground">{formatMonth(label)}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.name === "Verbrauch" ? `${Math.round(entry.value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function CostCharts({ property }: CostChartsProps) {
  const { categoryDefinitions } = useAppStore()
  const catDefs = mergeCategoryDefinitions(categoryDefinitions)
  const fromDefs = catDefs.filter((c) => c.supportsMeter).map((c) => c.id)
  const meterCategories = fromDefs.length > 0 ? fromDefs : CATEGORIES_WITH_METER
  const defaultTab = meterCategories[0] ?? "strom"

  const overallData = getCostsByMonth(property.costs)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Kosten&Einnahmen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  tickFormatter={(v) => `${v}€`}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  width={55}
                />
                <Tooltip content={<CostTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="cost"
                  name="Ausgaben"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="income"
                  name="Einnahmen"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-4 flex flex-wrap">
          {meterCategories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {getCategoryLabel(cat, catDefs)}
            </TabsTrigger>
          ))}
        </TabsList>
        {meterCategories.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid gap-6 lg:grid-cols-2">
              <MeterChart property={property} category={cat} catDefs={catDefs} />
              <ConsumptionChart property={property} category={cat} catDefs={catDefs} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function MeterChart({
  property,
  category,
  catDefs,
}: {
  property: Property
  category: CostCategory
  catDefs: ReturnType<typeof mergeCategoryDefinitions>
}) {
  const data = getMeterReadingsOverTime(property.costs, category)
  const unit = getCategoryUnit(category, catDefs) || ""

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Zaehlerstand {getCategoryLabel(category, catDefs)} ({unit})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id={`grad-${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CostTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                name="Zaehlerstand"
                stroke="hsl(var(--primary))"
                fill={`url(#grad-${category})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function ConsumptionChart({
  property,
  category,
  catDefs,
}: {
  property: Property
  category: CostCategory
  catDefs: ReturnType<typeof mergeCategoryDefinitions>
}) {
  const data = getConsumptionOverTime(property.costs, category)
  const unit = getCategoryUnit(category, catDefs) || ""
  const threshold = property.thresholds.find((t) => t.category === category)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Verbrauch {getCategoryLabel(category, catDefs)} ({unit}/Monat)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={50}
              />
              <Tooltip content={<CostTooltip />} />
              <Bar
                dataKey="consumption"
                name="Verbrauch"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {threshold && (
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-warning" />
              Warnung: {threshold.warningValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}/Jahr
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
              Kritisch: {threshold.criticalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {unit}/Jahr
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
