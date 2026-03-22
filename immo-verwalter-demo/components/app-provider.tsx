"use client"

import { useState, useCallback, type ReactNode } from "react"
import { AppContext, type AppState, createDemoData } from "@/lib/store"
import type {
  Property,
  CostEntry,
  Contract,
  ScannedDocument,
  ConsumptionThreshold,
  CategoryDefinition,
  PropertyDocument,
} from "@/lib/types"

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDemoData())

  const addProperty = useCallback((property: Property) => {
    setState((s) => ({ ...s, properties: [...s.properties, property] }))
  }, [])

  const updateProperty = useCallback((id: string, updates: Partial<Property>) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }, [])

  const deleteProperty = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      properties: s.properties.filter((p) => p.id !== id),
    }))
  }, [])

  const addCostEntry = useCallback((entry: CostEntry) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) =>
        p.id === entry.propertyId ? { ...p, costs: [...p.costs, entry] } : p
      ),
    }))
  }, [])

  const deleteCostEntry = useCallback((propertyId: string, entryId: string) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) =>
        p.id === propertyId ? { ...p, costs: p.costs.filter((c) => c.id !== entryId) } : p
      ),
    }))
  }, [])

  const addContract = useCallback((contract: Contract) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) =>
        p.id === contract.propertyId
          ? { ...p, contracts: [...p.contracts, contract] }
          : p
      ),
    }))
  }, [])

  const updateContract = useCallback(
    (propertyId: string, contractId: string, updates: Partial<Contract>) => {
      setState((s) => ({
        ...s,
        properties: s.properties.map((p) =>
          p.id === propertyId
            ? {
                ...p,
                contracts: p.contracts.map((c) =>
                  c.id === contractId ? { ...c, ...updates } : c
                ),
              }
            : p
        ),
      }))
    },
    []
  )

  const deleteContract = useCallback((propertyId: string, contractId: string) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) =>
        p.id === propertyId
          ? { ...p, contracts: p.contracts.filter((c) => c.id !== contractId) }
          : p
      ),
    }))
  }, [])

  const addDocument = useCallback((doc: ScannedDocument) => {
    setState((s) => ({ ...s, documents: [...s.documents, doc] }))
  }, [])

  const updateDocument = useCallback(
    (id: string, updates: Partial<ScannedDocument>) => {
      setState((s) => ({
        ...s,
        documents: s.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      }))
    },
    []
  )

  const deleteDocument = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      documents: s.documents.filter((d) => d.id !== id),
    }))
  }, [])

  const updateThreshold = useCallback(
    (propertyId: string, threshold: ConsumptionThreshold) => {
      setState((s) => ({
        ...s,
        properties: s.properties.map((p) => {
          if (p.id !== propertyId) return p
          const existing = p.thresholds.findIndex(
            (t) => t.category === threshold.category
          )
          const newThresholds = [...p.thresholds]
          if (existing >= 0) {
            newThresholds[existing] = threshold
          } else {
            newThresholds.push(threshold)
          }
          return { ...p, thresholds: newThresholds }
        }),
      }))
    },
    []
  )

  const addCategoryDefinition = useCallback((def: CategoryDefinition) => {
    setState((s) => {
      if (s.categoryDefinitions.some((c) => c.id === def.id)) return s
      return { ...s, categoryDefinitions: [...s.categoryDefinitions, def] }
    })
  }, [])

  const addPropertyDocument = useCallback((doc: PropertyDocument) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) =>
        p.id === doc.propertyId
          ? { ...p, propertyDocuments: [...p.propertyDocuments, doc] }
          : p
      ),
    }))
  }, [])

  const deletePropertyDocument = useCallback((propertyId: string, documentId: string) => {
    setState((s) => ({
      ...s,
      properties: s.properties.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              propertyDocuments: p.propertyDocuments.filter((d) => d.id !== documentId),
            }
          : p
      ),
    }))
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        addProperty,
        updateProperty,
        deleteProperty,
        addCostEntry,
        deleteCostEntry,
        addContract,
        updateContract,
        deleteContract,
        addDocument,
        updateDocument,
        deleteDocument,
        updateThreshold,
        addCategoryDefinition,
        addPropertyDocument,
        deletePropertyDocument,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
