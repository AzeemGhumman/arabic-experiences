export type PrepPresentation =
  | "vocab-list"
  | "checklist"
  | "compare-pairs"
  | "market-grid"
  | "timeline"
  | "sort-buckets"
  | "diagram"
  | "number-grid"
  | "price-tags"

export type DiagramVariant = "family-tree" | "body" | "hotel-floor" | "map" | "room" | "mosque" | "haram"

export type PrepPresentationConfig = {
  kind: PrepPresentation
  diagram?: DiagramVariant
}

/** Creative layout per prep session. Default: vocab-list */
export const prepPresentationBySession: Record<string, PrepPresentationConfig> = {
  "numbers-everywhere": { kind: "number-grid" },
  "numbers-to-100": { kind: "number-grid" },
  "polite-basic": { kind: "timeline" },
  "packing-basic": { kind: "checklist" },
  "airport-basic": { kind: "checklist" },
  "geography-basic": { kind: "diagram", diagram: "map" },
  "hotel-basic": { kind: "diagram", diagram: "hotel-floor" },
  "room-service-basic": { kind: "diagram", diagram: "room" },
  "money-basic": { kind: "price-tags" },
  "food-menu": { kind: "market-grid" },
  "shopping-basic": { kind: "market-grid" },
  "colors-basic": { kind: "compare-pairs" },
  "colors-extended": { kind: "compare-pairs" },
  "clothes-basic": { kind: "compare-pairs" },
  "barber-basic": { kind: "compare-pairs" },
  "time-basic": { kind: "timeline" },
  "family-basic": { kind: "diagram", diagram: "family-tree" },
  "family-more": { kind: "diagram", diagram: "family-tree" },
  "haram-basic": { kind: "diagram", diagram: "haram" },
  "haram-more": { kind: "sort-buckets" },
  "ritual-basic": { kind: "timeline" },
  "nabawi-basic": { kind: "diagram", diagram: "mosque" },
  "health-basic": { kind: "checklist" },
  "body-basic": { kind: "diagram", diagram: "body" },
  "actions-basic": { kind: "sort-buckets" },
  "adjectives-basic": { kind: "compare-pairs" },
  "nature-basic": { kind: "compare-pairs" },
  "hajj-places-basic": { kind: "timeline" },
}

export function getPrepPresentation(sessionId: string): PrepPresentationConfig {
  return prepPresentationBySession[sessionId] ?? { kind: "vocab-list" }
}

export const colorSwatches: Record<string, string> = {
  "color-red": "#c45c4a",
  "color-blue": "#4a7a9a",
  "color-green": "#5a8a62",
  "color-white": "#f7f1e8",
  "color-black": "#2b241f",
  "color-yellow": "#d4a832",
  "color-brown": "#8a6848",
  "color-gray": "#9a9590",
  "color-light": "#e8e0d4",
  "color-dark": "#4a4038",
  "color-gold": "#c4a35a",
}

export const bucketAccents = [
  "border-sage bg-sage/10",
  "border-gold bg-gold/10",
  "border-sky-500/40 bg-sky-500/10",
]
