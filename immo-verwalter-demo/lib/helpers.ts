import type { Property, CostCategory, CostEntry, ConsumptionThreshold } from "./types"

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

export function getProjectedAnnualCost(property: Property): number {
  return getMonthlyAverage(property) * 12
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
