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
import { CATEGORY_LABELS, CATEGORY_UNITS, CATEGORIES_WITH_METER } from "@/lib/types"
import {
  getCostsByMonth,
  getConsumptionOverTime,
  getMeterReadingsOverTime,
  formatMonth,
  formatCurrency,
} from "@/lib/helpers"

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

      <Tabs defaultValue="strom">
        <TabsList className="mb-4">
          {CATEGORIES_WITH_METER.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES_WITH_METER.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid gap-6 lg:grid-cols-2">
              <MeterChart property={property} category={cat} />
              <ConsumptionChart property={property} category={cat} />
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
}: {
  property: Property
  category: CostCategory
}) {
  const data = getMeterReadingsOverTime(property.costs, category)
  const unit = CATEGORY_UNITS[category] || ""

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Zaehlerstand {CATEGORY_LABELS[category]} ({unit})
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
}: {
  property: Property
  category: CostCategory
}) {
  const data = getConsumptionOverTime(property.costs, category)
  const unit = CATEGORY_UNITS[category] || ""
  const threshold = property.thresholds.find((t) => t.category === category)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Verbrauch {CATEGORY_LABELS[category]} ({unit}/Monat)
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
