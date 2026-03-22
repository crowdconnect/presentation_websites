"use client"

import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Property } from "@/lib/types"
import {
  getContractBudgetByCategoryForPeriod,
  getActualCostByCategoryForPeriod,
  formatCurrency,
} from "@/lib/helpers"
import { mergeCategoryDefinitions, getCategoryLabel } from "@/lib/categories"
import { useAppStore } from "@/lib/store"

interface PlanVsIstPanelProps {
  property: Property
}

export function PlanVsIstPanel({ property }: PlanVsIstPanelProps) {
  const { categoryDefinitions } = useAppStore()
  const defs = mergeCategoryDefinitions(categoryDefinitions)

  const years = useMemo(() => {
    const ys = new Set<number>()
    for (const c of property.costs) {
      ys.add(Number.parseInt(c.date.slice(0, 4), 10))
    }
    for (const c of property.contracts) {
      ys.add(Number.parseInt(c.startDate.slice(0, 4), 10))
      ys.add(Number.parseInt(c.endDate.slice(0, 4), 10))
    }
    const arr = Array.from(ys).sort((a, b) => b - a)
    return arr.length ? arr : [new Date().getFullYear()]
  }, [property.costs, property.contracts])

  const [year, setYear] = useState(() => years[0] ?? new Date().getFullYear())

  const from = `${year}-01-01`
  const to = `${year}-12-31`

  const soll = getContractBudgetByCategoryForPeriod(property, from, to)
  const ist = getActualCostByCategoryForPeriod(property, from, to)

  const categoryIds = useMemo(() => {
    const ids = new Set<string>([...Object.keys(soll), ...Object.keys(ist)])
    return Array.from(ids)
      .filter((id) => id !== "miete_einnahme")
      .sort((a, b) => getCategoryLabel(a, defs).localeCompare(getCategoryLabel(b, defs)))
  }, [soll, ist, defs])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Jahr</span>
        <select
          className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          value={year}
          onChange={(e) => setYear(Number.parseInt(e.target.value, 10))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-muted-foreground">
        <strong>Soll</strong> aus aktiven Verträgen (Zeitraum {year}), <strong>Ist</strong> aus
        gebuchten Ausgaben ohne Einnahmen.
      </p>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Soll (Vertrag)</TableHead>
              <TableHead className="text-right">Ist (Buchungen)</TableHead>
              <TableHead className="text-right">Abweichung</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryIds.map((cat) => {
              const s = soll[cat] ?? 0
              const i = ist[cat] ?? 0
              const diff = i - s
              const pct = s !== 0 ? Math.round((diff / s) * 1000) / 10 : i !== 0 ? 100 : 0
              return (
                <TableRow key={cat}>
                  <TableCell className="font-medium">
                    {getCategoryLabel(cat, defs)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(s)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(i)}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums ${
                      diff > 0 ? "text-destructive" : diff < 0 ? "text-success" : ""
                    }`}
                  >
                    {diff >= 0 ? "+" : ""}
                    {formatCurrency(diff)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {pct}%
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
