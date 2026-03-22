import type { Property, CostCategory, CostEntry, ConsumptionThreshold, Contract } from "./types"

function getLatestMonth(property: Property): string {
  if (property.costs.length === 0) return "2026-02"
  const sorted = [...property.costs].sort((a, b) => b.date.localeCompare(a.date))
  return sorted[0].date.slice(0, 7)
}

export function getMonthlyTotalCost(property: Property): number {
  const currentMonth = getLatestMonth(property)
  return property.costs
    .filter((c) => c.date.startsWith(currentMonth) && !c.isIncome)
    .reduce((sum, c) => sum + c.amount, 0)
}

export function getMonthlyTotalIncome(property: Property): number {
  const currentMonth = getLatestMonth(property)
  return property.costs
    .filter((c) => c.date.startsWith(currentMonth) && c.isIncome)
    .reduce((sum, c) => sum + c.amount, 0)
}

export function getLatestMeterReading(
  property: Property,
  category: CostCategory
): number | null {
  const readings = property.costs
    .filter((c) => c.category === category && c.meterReading)
    .sort((a, b) => b.date.localeCompare(a.date))
  return readings[0]?.meterReading?.value ?? null
}

export function getAnnualConsumption(
  property: Property,
  category: CostCategory
): number {
  const entries = property.costs
    .filter((c) => c.category === category && c.meterReading)
    .sort((a, b) => a.date.localeCompare(b.date))
  if (entries.length < 2) return 0
  const first = entries[0].meterReading!.value
  const last = entries[entries.length - 1].meterReading!.value
  return last - first
}

export function getConsumptionStatus(
  property: Property,
  category: CostCategory
): "normal" | "warning" | "critical" {
  const threshold = property.thresholds.find((t) => t.category === category)
  if (!threshold) return "normal"
  const annual = getAnnualConsumption(property, category)
  if (annual >= threshold.criticalValue) return "critical"
  if (annual >= threshold.warningValue) return "warning"
  return "normal"
}

export function getOverallStatus(property: Property): "normal" | "warning" | "critical" {
  const statuses = property.thresholds.map((t) =>
    getConsumptionStatus(property, t.category)
  )
  if (statuses.includes("critical")) return "critical"
  if (statuses.includes("warning")) return "warning"
  return "normal"
}

export function getCostsByMonth(
  costs: CostEntry[],
  category?: CostCategory
): { month: string; cost: number; income: number }[] {
  const filtered = category ? costs.filter((c) => c.category === category) : costs
  const map = new Map<string, { cost: number; income: number }>()

  for (const entry of filtered) {
    const month = entry.date.slice(0, 7)
    const existing = map.get(month) || { cost: 0, income: 0 }
    if (entry.isIncome) {
      existing.income += entry.amount
    } else {
      existing.cost += entry.amount
    }
    map.set(month, existing)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }))
}

export function getMeterReadingsOverTime(
  costs: CostEntry[],
  category: CostCategory
): { month: string; value: number }[] {
  return costs
    .filter((c) => c.category === category && c.meterReading)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => ({
      month: c.date.slice(0, 7),
      value: c.meterReading!.value,
    }))
}

export function getConsumptionOverTime(
  costs: CostEntry[],
  category: CostCategory
): { month: string; consumption: number }[] {
  const readings = getMeterReadingsOverTime(costs, category)
  const result: { month: string; consumption: number }[] = []
  for (let i = 1; i < readings.length; i++) {
    result.push({
      month: readings[i].month,
      consumption: readings[i].value - readings[i - 1].value,
    })
  }
  return result
}

export function getAnnualCostTotal(property: Property): number {
  return property.costs.filter((c) => !c.isIncome).reduce((s, c) => s + c.amount, 0)
}

export function getAnnualIncomeTotal(property: Property): number {
  return property.costs.filter((c) => c.isIncome).reduce((s, c) => s + c.amount, 0)
}

export function getMonthlyAverage(property: Property): number {
  const byMonth = getCostsByMonth(property.costs)
  if (byMonth.length === 0) return 0
  const totalCost = byMonth.reduce((s, m) => s + m.cost, 0)
  return Math.round(totalCost / byMonth.length)
}

/**
 * Trend-Prognose aus historischen Monatsdurchschnitten (nicht Vertragsbudget).
 */
export function getTrendBasedAnnualProjection(property: Property): number {
  return getMonthlyAverage(property) * 12
}

/** @deprecated Verwende getTrendBasedAnnualProjection – gleiche Logik, klarer Name */
export function getProjectedAnnualCost(property: Property): number {
  return getTrendBasedAnnualProjection(property)
}

function parseDay(iso: string): Date {
  return new Date(iso.slice(0, 10) + "T12:00:00")
}

/** Volle Kalendermonate, in denen Vertrag und [from,to] sich überschneiden */
export function countOverlappingMonths(
  contract: Pick<Contract, "startDate" | "endDate">,
  from: string,
  to: string
): number {
  const c0 = parseDay(contract.startDate)
  const c1 = parseDay(contract.endDate)
  const r0 = parseDay(from)
  const r1 = parseDay(to)
  const lo = c0 > r0 ? c0 : r0
  const hi = c1 < r1 ? c1 : r1
  if (lo > hi) return 0
  let count = 0
  const cur = new Date(lo.getFullYear(), lo.getMonth(), 1)
  const endM = new Date(hi.getFullYear(), hi.getMonth(), 1)
  while (cur <= endM) {
    count++
    cur.setMonth(cur.getMonth() + 1)
  }
  return count
}

/** Soll aus Verträgen im Zeitraum [from, to] (EUR), optional nur eine Kategorie */
export function getContractBudgetForPeriod(
  property: Property,
  from: string,
  to: string,
  categoryId?: CostCategory
): number {
  let total = 0
  for (const contract of property.contracts) {
    if (categoryId && contract.category !== categoryId) continue
    const months = countOverlappingMonths(contract, from, to)
    if (months === 0) continue
    if (contract.billingCycle === "monthly") {
      total += contract.monthlyCost * months
    } else {
      const annual = contract.annualAmount ?? contract.monthlyCost * 12
      total += annual * (months / 12)
    }
  }
  return Math.round(total * 100) / 100
}

/** Map: categoryId -> Summe Ausgaben (ohne Einnahmen) im Zeitraum */
export function getActualCostByCategoryForPeriod(
  property: Property,
  from: string,
  to: string
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const c of property.costs) {
    if (c.isIncome) continue
    const d = c.date.slice(0, 10)
    if (d < from || d > to) continue
    out[c.category] = (out[c.category] ?? 0) + c.amount
  }
  return out
}

/** Summe Ausgaben (ohne Einnahmen) einer Kategorie im Zeitraum [from, to] */
export function getActualExpenseForCategoryForPeriod(
  property: Property,
  from: string,
  to: string,
  categoryId: CostCategory
): number {
  let total = 0
  for (const c of property.costs) {
    if (c.category !== categoryId || c.isIncome) continue
    const d = c.date.slice(0, 10)
    if (d < from || d > to) continue
    total += c.amount
  }
  return Math.round(total * 100) / 100
}

/** Summe Einnahmen einer Kategorie im Zeitraum [from, to] */
export function getActualIncomeForCategoryForPeriod(
  property: Property,
  from: string,
  to: string,
  categoryId: CostCategory
): number {
  let total = 0
  for (const c of property.costs) {
    if (c.category !== categoryId || !c.isIncome) continue
    const d = c.date.slice(0, 10)
    if (d < from || d > to) continue
    total += c.amount
  }
  return Math.round(total * 100) / 100
}

/**
 * Vertrags-Soll-Verbrauch im Zeitraum: Summe (annualConsumptionBasis × überlappende Monate / 12)
 * über alle Verträge der Kategorie mit gesetztem Jahreswert.
 */
export function getContractConsumptionBasisForPeriod(
  property: Property,
  from: string,
  to: string,
  categoryId: CostCategory
): number | null {
  let total = 0
  let hasAny = false
  for (const contract of property.contracts) {
    if (contract.category !== categoryId) continue
    const basis = contract.annualConsumptionBasis
    if (basis == null || basis <= 0) continue
    const months = countOverlappingMonths(contract, from, to)
    if (months === 0) continue
    hasAny = true
    total += basis * (months / 12)
  }
  return hasAny ? Math.round(total * 100) / 100 : null
}

/**
 * Ist-Verbrauch im Kalenderjahr: Differenz erster zu letztem Zählerstand
 * innerhalb [year-01-01, year-12-31] (vereinfachte Näherung).
 */
export function getMeterConsumptionForCalendarYear(
  property: Property,
  category: CostCategory,
  year: number
): number {
  const from = `${year}-01-01`
  const to = `${year}-12-31`
  const entries = property.costs
    .filter((c) => c.category === category && c.meterReading)
    .filter((c) => {
      const d = c.date.slice(0, 10)
      return d >= from && d <= to
    })
    .sort((a, b) => a.date.localeCompare(b.date))
  if (entries.length < 2) return 0
  const first = entries[0].meterReading!.value
  const last = entries[entries.length - 1].meterReading!.value
  return Math.round((last - first) * 100) / 100
}

/** Formatiert Verbrauchszahl mit deutschem Tausenderpunkt (ohne Währung) */
export function formatConsumptionAmount(value: number): string {
  const rounded = Math.round(value)
  return rounded.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/** Soll pro Kategorie aus Verträgen (gleiche Logik wie getContractBudgetForPeriod, aufgeteilt) */
export function getContractBudgetByCategoryForPeriod(
  property: Property,
  from: string,
  to: string
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const contract of property.contracts) {
    const months = countOverlappingMonths(contract, from, to)
    if (months === 0) continue
    let part: number
    if (contract.billingCycle === "monthly") {
      part = contract.monthlyCost * months
    } else {
      const annual = contract.annualAmount ?? contract.monthlyCost * 12
      part = annual * (months / 12)
    }
    out[contract.category] = Math.round(((out[contract.category] ?? 0) + part) * 100) / 100
  }
  return out
}

export function formatCurrency(value: number): string {
  const abs = Math.abs(value)
  const parts = abs.toFixed(2).split(".")
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const formatted = `${intPart},${parts[1]}`
  return `${value < 0 ? "-" : ""}${formatted}\u00A0\u20AC`
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-")
  const months = [
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
  ]
  return `${months[Number.parseInt(month) - 1]} ${year.slice(2)}`
}

export function daysUntilCancellationDeadline(contract: {
  endDate: string
  cancellationPeriodMonths: number
}): number {
  const end = new Date(contract.endDate)
  const deadline = new Date(end)
  deadline.setMonth(deadline.getMonth() - contract.cancellationPeriodMonths)
  const now = new Date()
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function suggestCategory(fileName: string): CostCategory | null {
  const lower = fileName.toLowerCase()
  if (lower.includes("strom") || lower.includes("elektr") || lower.includes("vattenfall") || lower.includes("eon")) return "strom"
  if (lower.includes("gas") || lower.includes("gasag")) return "gas"
  if (lower.includes("wasser") || lower.includes("bwb")) return "wasser"
  if (lower.includes("internet") || lower.includes("telekom") || lower.includes("vodafone")) return "internet"
  if (lower.includes("versicherung")) return "versicherung"
  if (lower.includes("grundsteuer") || lower.includes("finanzamt")) return "grundsteuer"
  if (lower.includes("hausgeld") || lower.includes("wohngeld")) return "hausgeld"
  if (lower.includes("miete")) return "miete_einnahme"
  if (lower.includes("reparatur") || lower.includes("handwerk")) return "reparatur"
  return null
}

export function suggestAmount(text: string): number | null {
  const match = text.match(/(\d{1,6}[.,]\d{2})\s*(?:EUR|€)/i)
  if (match) return Number.parseFloat(match[1].replace(",", "."))
  return null
}
