"use client"

import { createContext, useContext } from "react"
import type {
  Property,
  CostEntry,
  Contract,
  ScannedDocument,
  ConsumptionThreshold,
  CategoryDefinition,
  PropertyDocument,
} from "./types"

export interface AppState {
  properties: Property[]
  documents: ScannedDocument[]
  /** Zusätzliche Kategorien (Built-ins kommen aus types) */
  categoryDefinitions: CategoryDefinition[]
}

export interface AppActions {
  addProperty: (property: Property) => void
  updateProperty: (id: string, updates: Partial<Property>) => void
  deleteProperty: (id: string) => void
  addCostEntry: (entry: CostEntry) => void
  deleteCostEntry: (propertyId: string, entryId: string) => void
  addContract: (contract: Contract) => void
  updateContract: (propertyId: string, contractId: string, updates: Partial<Contract>) => void
  deleteContract: (propertyId: string, contractId: string) => void
  addDocument: (doc: ScannedDocument) => void
  updateDocument: (id: string, updates: Partial<ScannedDocument>) => void
  deleteDocument: (id: string) => void
  updateThreshold: (propertyId: string, threshold: ConsumptionThreshold) => void
  addCategoryDefinition: (def: CategoryDefinition) => void
  addPropertyDocument: (doc: PropertyDocument) => void
  deletePropertyDocument: (propertyId: string, documentId: string) => void
}

export type AppContextType = AppState & AppActions

export const AppContext = createContext<AppContextType | null>(null)

export function useAppStore(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useAppStore must be used within AppProvider")
  return ctx
}

// Simple seeded pseudo-random number generator (mulberry32)
function createSeededRandom(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Demo data
export function createDemoData(): AppState {
  const random = createSeededRandom(42)
  const property1Id = "prop-1"
  const property2Id = "prop-2"

  // Use fixed months to avoid Date-based server/client mismatch
  const months = [
    "2025-03-01",
    "2025-04-01",
    "2025-05-01",
    "2025-06-01",
    "2025-07-01",
    "2025-08-01",
    "2025-09-01",
    "2025-10-01",
    "2025-11-01",
    "2025-12-01",
    "2026-01-01",
    "2026-02-01",
  ]

  function makeCosts(
    propId: string,
    base: { strom: number; gas: number; wasser: number; internet: number; versicherung: number; hausgeld: number }
  ): CostEntry[] {
    const entries: CostEntry[] = []
    let stromReading = 14200
    let gasReading = 3400
    let wasserReading = 120

    months.forEach((month, idx) => {
      const stromUsage = 280 + Math.round(random() * 60)
      stromReading += stromUsage
      entries.push({
        id: `${propId}-strom-${idx}`,
        propertyId: propId,
        category: "strom",
        label: "Stromabschlag",
        amount: base.strom + Math.round(random() * 15),
        date: month,
        isIncome: false,
        meterReading: { id: `mr-strom-${propId}-${idx}`, date: month, value: stromReading, unit: "kWh" },
      })

      const gasUsage = idx >= 4 && idx <= 9 ? 30 + Math.round(random() * 20) : 100 + Math.round(random() * 50)
      gasReading += gasUsage
      entries.push({
        id: `${propId}-gas-${idx}`,
        propertyId: propId,
        category: "gas",
        label: "Gasabschlag",
        amount: base.gas + Math.round(random() * 20 - 10),
        date: month,
        isIncome: false,
        meterReading: { id: `mr-gas-${propId}-${idx}`, date: month, value: gasReading, unit: "m\u00B3" },
      })

      const wasserUsage = 3 + Math.round(random() * 2)
      wasserReading += wasserUsage
      entries.push({
        id: `${propId}-wasser-${idx}`,
        propertyId: propId,
        category: "wasser",
        label: "Wasserabschlag",
        amount: base.wasser + Math.round(random() * 5),
        date: month,
        isIncome: false,
        meterReading: { id: `mr-wasser-${propId}-${idx}`, date: month, value: wasserReading, unit: "m\u00B3" },
      })

      entries.push({
        id: `${propId}-internet-${idx}`,
        propertyId: propId,
        category: "internet",
        label: "Internet",
        amount: base.internet,
        date: month,
        isIncome: false,
      })

      if (idx % 3 === 0) {
        entries.push({
          id: `${propId}-versicherung-${idx}`,
          propertyId: propId,
          category: "versicherung",
          label: "Gebaeudeversicherung",
          amount: base.versicherung,
          date: month,
          isIncome: false,
        })
      }

      entries.push({
        id: `${propId}-hausgeld-${idx}`,
        propertyId: propId,
        category: "hausgeld",
        label: "Hausgeld",
        amount: base.hausgeld,
        date: month,
        isIncome: false,
      })

      entries.push({
        id: `${propId}-miete-${idx}`,
        propertyId: propId,
        category: "miete_einnahme",
        label: "Mieteinnahme",
        amount: 850 + Math.round(random() * 50),
        date: month,
        isIncome: true,
      })
    })

    return entries
  }

  const baseContract = (c: Omit<Contract, "billingCycle" | "annualAmount">): Contract => ({
    ...c,
    billingCycle: "monthly",
  })

  const properties: Property[] = [
    {
      id: property1Id,
      name: "Altbauwohnung Mitte",
      address: "Friedrichstr. 42, 10117 Berlin",
      imageUrl: "/images/property1.jpg",
      costs: makeCosts(property1Id, {
        strom: 85,
        gas: 120,
        wasser: 35,
        internet: 40,
        versicherung: 95,
        hausgeld: 280,
      }),
      contracts: [
        baseContract({
          id: "contract-1-1",
          propertyId: property1Id,
          category: "strom",
          provider: "Vattenfall",
          monthlyCost: 85,
          startDate: "2024-01-01",
          endDate: "2026-12-31",
          cancellationPeriodMonths: 3,
          notified: false,
          annualConsumptionBasis: 3800,
        }),
        baseContract({
          id: "contract-1-2",
          propertyId: property1Id,
          category: "internet",
          provider: "Telekom",
          monthlyCost: 40,
          startDate: "2024-06-01",
          endDate: "2026-05-31",
          cancellationPeriodMonths: 3,
          notified: false,
        }),
        baseContract({
          id: "contract-1-3",
          propertyId: property1Id,
          category: "gas",
          provider: "GASAG",
          monthlyCost: 120,
          startDate: "2024-03-01",
          endDate: "2026-02-28",
          cancellationPeriodMonths: 1,
          notified: false,
          annualConsumptionBasis: 1450,
        }),
        {
          id: "contract-1-4",
          propertyId: property1Id,
          category: "versicherung",
          provider: "Allianz",
          monthlyCost: 95,
          annualAmount: 1140,
          billingCycle: "annual",
          startDate: "2024-01-01",
          endDate: "2026-12-31",
          cancellationPeriodMonths: 3,
          notified: false,
        },
      ],
      thresholds: [
        { category: "strom", warningValue: 3500, criticalValue: 4500, unit: "kWh" },
        { category: "gas", warningValue: 1200, criticalValue: 1600, unit: "m\u00B3" },
        { category: "wasser", warningValue: 55, criticalValue: 70, unit: "m\u00B3" },
      ],
      propertyDocuments: [
        {
          id: "pdoc-1-1",
          propertyId: property1Id,
          kind: "reference",
          referenceType: "grundriss",
          fileName: "Grundriss_EG.pdf",
          dataUrl: "/placeholder.svg",
          uploadedAt: "2025-06-01T10:00:00.000Z",
        },
        {
          id: "pdoc-1-2",
          propertyId: property1Id,
          kind: "reference",
          referenceType: "grundbuch",
          fileName: "Grundbuchauszug.pdf",
          dataUrl: "/placeholder.svg",
          uploadedAt: "2025-06-15T14:30:00.000Z",
        },
      ],
    },
    {
      id: property2Id,
      name: "Reihenhaus Spandau",
      address: "Havelchaussee 15, 13597 Berlin",
      imageUrl: "/images/property2.jpg",
      costs: makeCosts(property2Id, {
        strom: 110,
        gas: 150,
        wasser: 45,
        internet: 45,
        versicherung: 120,
        hausgeld: 350,
      }),
      contracts: [
        baseContract({
          id: "contract-2-1",
          propertyId: property2Id,
          category: "strom",
          provider: "E.ON",
          monthlyCost: 110,
          startDate: "2025-01-01",
          endDate: "2026-06-30",
          cancellationPeriodMonths: 2,
          notified: false,
          annualConsumptionBasis: 4100,
        }),
        baseContract({
          id: "contract-2-2",
          propertyId: property2Id,
          category: "internet",
          provider: "Vodafone",
          monthlyCost: 45,
          startDate: "2024-09-01",
          endDate: "2026-08-31",
          cancellationPeriodMonths: 3,
          notified: false,
        }),
      ],
      thresholds: [
        { category: "strom", warningValue: 4000, criticalValue: 5000, unit: "kWh" },
        { category: "gas", warningValue: 1500, criticalValue: 2000, unit: "m\u00B3" },
        { category: "wasser", warningValue: 65, criticalValue: 85, unit: "m\u00B3" },
      ],
      propertyDocuments: [],
    },
  ]

  return {
    properties,
    documents: [],
    categoryDefinitions: [
      {
        id: "regenwasser",
        label: "Regenwasserkosten",
        behavior: "fixed",
      },
      {
        id: "gebaeudeversicherung",
        label: "Gebäudeversicherung (extra)",
        behavior: "fixed",
      },
    ],
  }
}
