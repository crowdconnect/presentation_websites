export type CostCategory =
  | "strom"
  | "gas"
  | "wasser"
  | "internet"
  | "versicherung"
  | "grundsteuer"
  | "hausgeld"
  | "reparatur"
  | "miete_einnahme"
  | "sonstige"

export interface MeterReading {
  id: string
  date: string
  value: number
  unit: string
}

export interface CostEntry {
  id: string
  propertyId: string
  category: CostCategory
  label: string
  amount: number
  date: string
  isIncome: boolean
  meterReading?: MeterReading
  note?: string
  documentId?: string
}

export interface Contract {
  id: string
  propertyId: string
  category: CostCategory
  provider: string
  monthlyCost: number
  startDate: string
  endDate: string
  cancellationPeriodMonths: number
  notified: boolean
}

export interface ConsumptionThreshold {
  category: CostCategory
  warningValue: number
  criticalValue: number
  unit: string
}

export interface Property {
  id: string
  name: string
  address: string
  imageUrl: string
  costs: CostEntry[]
  contracts: Contract[]
  thresholds: ConsumptionThreshold[]
}

export interface ScannedDocument {
  id: string
  fileName: string
  dataUrl: string
  suggestedCategory: CostCategory | null
  suggestedAmount: number | null
  suggestedPropertyId: string | null
  assignedPropertyId?: string
  assignedCategory?: CostCategory
  assignedCostEntryId?: string
  status: "pending" | "assigned" | "dismissed"
}

export const CATEGORY_LABELS: Record<CostCategory, string> = {
  strom: "Strom",
  gas: "Gas",
  wasser: "Wasser",
  internet: "Internet",
  versicherung: "Versicherung",
  grundsteuer: "Grundsteuer",
  hausgeld: "Hausgeld",
  reparatur: "Reparatur",
  miete_einnahme: "Mieteinnahme",
  sonstige: "Sonstige",
}

export const CATEGORY_UNITS: Partial<Record<CostCategory, string>> = {
  strom: "kWh",
  gas: "m\u00B3",
  wasser: "m\u00B3",
}

export const CATEGORIES_WITH_METER: CostCategory[] = ["strom", "gas", "wasser"]
export const CATEGORIES_WITH_CONTRACT: CostCategory[] = [
  "strom",
  "gas",
  "wasser",
  "internet",
  "versicherung",
]
