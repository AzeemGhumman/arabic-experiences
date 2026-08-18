import type { VocabularyPool } from "@/lib/learning-types"
import { wordsInPool } from "@/data/learning/words"

const defs: Omit<VocabularyPool, "vocabularyIds">[] = [
  { id: "navigation.basic", title: "Basic directions", description: "Right, left, where, gate.", capabilityId: "navigation", depth: 1 },
  { id: "navigation.deep", title: "Richer location language", description: "Opposite, behind, intersection.", capabilityId: "navigation", depth: 2 },
  { id: "navigation.gps", title: "Arabic GPS", description: "Turn, continue, you have arrived.", capabilityId: "navigation", depth: 3 },
  { id: "numbers.1to8", title: "Numbers 1–8", description: "Small counts for gates and orders.", capabilityId: "numbers", depth: 1 },
  { id: "numbers.9to20", title: "Numbers 9–20", description: "Rooms, buses, prices.", capabilityId: "numbers", depth: 2 },
  { id: "haram.places", title: "Haram places", description: "Gates, Zamzam, Safa, Marwah.", capabilityId: "haram", depth: 1 },
  { id: "haram.instructions", title: "Crowd instructions", description: "Walk, wait, men, women, closed.", capabilityId: "haram", depth: 1 },
  { id: "commands.basic", title: "Basic commands", description: "Start, stop, go back.", capabilityId: "navigation", depth: 1 },
  { id: "people.basic", title: "People", description: "Men, women, families, children.", capabilityId: "family", depth: 1 },
  { id: "family.basic", title: "Family", description: "Who you are looking for.", capabilityId: "family", depth: 1 },
  { id: "food.basic", title: "Simple food", description: "Order water, rice, chicken.", capabilityId: "food", depth: 1 },
  { id: "food.deep", title: "Richer food", description: "With, without, spicy, quantities.", capabilityId: "food", depth: 2 },
  { id: "money.basic", title: "Prices", description: "How much, riyals.", capabilityId: "money", depth: 1 },
  { id: "transport.basic", title: "Transport", description: "Taxi, bus, station.", capabilityId: "transportation", depth: 1 },
  { id: "taxi.basic", title: "Taxi talk", description: "Hotel, stop here, how much.", capabilityId: "transportation", depth: 1 },
  { id: "airport.basic", title: "Airport arrival", description: "Passport, bags, exit, taxi stand.", capabilityId: "transportation", depth: 1 },
  { id: "hotel.basic", title: "Hotel", description: "Room, floor, elevator.", capabilityId: "hotel", depth: 1 },
  { id: "barber.basic", title: "Barber", description: "Shave or trim.", capabilityId: "haram", depth: 1 },
  { id: "emergency.basic", title: "Emergency", description: "Help, doctor, lost.", capabilityId: "emergency", depth: 1 },
  { id: "health.basic", title: "Health", description: "Sick, pharmacy, it hurts.", capabilityId: "health", depth: 1 },
  { id: "hajj.places", title: "Hajj places", description: "Mina, Arafat, Muzdalifah.", capabilityId: "hajj-locations", depth: 1 },
  { id: "hajj.transport", title: "Hajj transport", description: "Bus, camp, seat.", capabilityId: "hajj-locations", depth: 1 },
  { id: "ritual.basic", title: "Ritual words", description: "Language around rites, not rulings.", capabilityId: "haram", depth: 1 },
]

export const vocabularyPools: VocabularyPool[] = defs.map((def) => ({
  ...def,
  vocabularyIds: wordsInPool(def.id).map((item) => item.id),
}))

export function getPool(id: string) {
  return vocabularyPools.find((pool) => pool.id === id)
}
