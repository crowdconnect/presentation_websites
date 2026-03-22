import type { CategoryDefinition, CostCategory } from "./types"
import { BUILT_IN_CATEGORY_DEFINITIONS } from "./types"

export function mergeCategoryDefinitions(
  custom: CategoryDefinition[] | undefined
): CategoryDefinition[] {
  const byId = new Map<string, CategoryDefinition>()
  for (const c of BUILT_IN_CATEGORY_DEFINITIONS) {
    byId.set(c.id, c)
  }
  for (const c of custom ?? []) {
    byId.set(c.id, c)
  }
  return Array.from(byId.values())
}

export function getCategoryLabel(
  id: CostCategory,
  definitions: CategoryDefinition[]
): string {
  return definitions.find((d) => d.id === id)?.label ?? id
}

export function getCategoryUnit(
  id: CostCategory,
  definitions: CategoryDefinition[]
): string | undefined {
  return definitions.find((d) => d.id === id)?.defaultUnit
}

export function categorySupportsMeter(
  id: CostCategory,
  definitions: CategoryDefinition[]
): boolean {
  return definitions.find((d) => d.id === id)?.supportsMeter === true
}

/** Kategorien für Verträge (keine Einnahmen) */
export function categoriesForContracts(definitions: CategoryDefinition[]): CategoryDefinition[] {
  return definitions.filter((d) => d.behavior !== "income")
}

/** Alle Kategorie-IDs in sinnvoller Reihenfolge (Built-in zuerst, dann Custom) */
export function orderedCategoryIds(definitions: CategoryDefinition[]): string[] {
  const builtIds = new Set(BUILT_IN_CATEGORY_DEFINITIONS.map((c) => c.id))
  const built = BUILT_IN_CATEGORY_DEFINITIONS.map((c) => c.id)
  const extra = definitions.filter((d) => !builtIds.has(d.id)).map((d) => d.id)
  return [...built, ...extra]
}
