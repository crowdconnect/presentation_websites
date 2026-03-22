/** Stable string id; built-ins use legacy keys e.g. "strom", "miete_einnahme" */
export type CostCategory = string

export type CategoryBehavior = "consumption" | "fixed" | "income"

export interface CategoryDefinition {
  id: string
  label: string
  behavior: CategoryBehavior
  /** Zählerstand-Erfassung (Strom/Gas/Wasser und ggf. Custom) */
  supportsMeter?: boolean
  defaultUnit?: string
}

export type ReferenceDocumentType =
  | "statik"
  | "grundriss"
  | "grundbuch"
  | "energieausweis"
  | "sonstige"

export type PropertyDocumentKind = "reference" | "invoice"

export interface PropertyDocument {
  id: string
  propertyId: string
  kind: PropertyDocumentKind
  referenceType?: ReferenceDocumentType
  fileName: string
  dataUrl: string
  uploadedAt: string
  costEntryId?: string
  categoryId?: string
}

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

export type BillingCycle = "monthly" | "annual"

export interface Contract {
  id: string
  propertyId: string
  category: CostCategory
  provider: string
  monthlyCost: number
  /** Bei Jahresabrechnung: Jahresbetrag (EUR); falls leer: monthlyCost × 12 */
  annualAmount?: number
  billingCycle: BillingCycle
  startDate: string
  endDate: string
  cancellationPeriodMonths: number
  notified: boolean
  /**
   * Erwarteter Jahresverbrauch laut Vertrag (Strom kWh, Gas/Wasser m³).
   * Optional; Grundlage für Verbrauchs-Hochrechnung vs. Zähler im Jahr.
   */
  annualConsumptionBasis?: number
  /** Optional: hinterlegtes Vertragsdokument (Demo: Data-URL) */
  contractPdfFileName?: string
  contractPdfDataUrl?: string
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
  /** Unterlagen (Statik, Grundriss, Grundbuch, …) und optionale Beleg-Kopien */
  propertyDocuments: PropertyDocument[]
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

/** Vorgegebene Kategorien (IDs bleiben für Demo-Daten stabil) */
export const BUILT_IN_CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { id: "strom", label: "Strom", behavior: "consumption", supportsMeter: true, defaultUnit: "kWh" },
  { id: "gas", label: "Gas", behavior: "consumption", supportsMeter: true, defaultUnit: "m\u00B3" },
  { id: "wasser", label: "Wasser", behavior: "consumption", supportsMeter: true, defaultUnit: "m\u00B3" },
  { id: "internet", label: "Internet", behavior: "fixed" },
  { id: "versicherung", label: "Versicherung", behavior: "fixed" },
  { id: "grundsteuer", label: "Grundsteuer", behavior: "fixed" },
  { id: "hausgeld", label: "Hausgeld", behavior: "fixed" },
  { id: "reparatur", label: "Reparatur", behavior: "fixed" },
  { id: "miete_einnahme", label: "Mieteinnahme", behavior: "income" },
  { id: "sonstige", label: "Sonstige", behavior: "fixed" },
]

/** @deprecated Nutze mergeCategoryDefinitions + getCategoryLabel */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  BUILT_IN_CATEGORY_DEFINITIONS.map((c) => [c.id, c.label])
)

/** @deprecated Nutze getCategoryUnit aus categories.ts */
export const CATEGORY_UNITS: Partial<Record<string, string>> = Object.fromEntries(
  BUILT_IN_CATEGORY_DEFINITIONS.filter((c) => c.defaultUnit).map((c) => [c.id, c.defaultUnit!])
)

export const CATEGORIES_WITH_METER: CostCategory[] = BUILT_IN_CATEGORY_DEFINITIONS.filter(
  (c) => c.supportsMeter
).map((c) => c.id)

export const CATEGORIES_WITH_CONTRACT: CostCategory[] = BUILT_IN_CATEGORY_DEFINITIONS.filter(
  (c) => c.behavior !== "income"
).map((c) => c.id)

export const REFERENCE_DOCUMENT_LABELS: Record<ReferenceDocumentType, string> = {
  statik: "Statik / Tragwerk",
  grundriss: "Grundriss",
  grundbuch: "Grundbuch / Auszug",
  energieausweis: "Energieausweis",
  sonstige: "Sonstige Unterlagen",
}
