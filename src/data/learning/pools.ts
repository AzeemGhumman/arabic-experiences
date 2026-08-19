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
  { id: "colors.basic", title: "Basic colors", description: "Red, blue, green, white, black.", capabilityId: "navigation", depth: 1 },
  { id: "colors.extended", title: "Color shades", description: "Light, dark, and mixed shades.", capabilityId: "navigation", depth: 2 },
  { id: "money.deep", title: "Paying & haggling", description: "Cash, card, change, too expensive.", capabilityId: "money", depth: 2 },
  { id: "hotel.deep", title: "Hotel requests", description: "Towels, clean, broken AC.", capabilityId: "hotel", depth: 2 },
  { id: "haram.deep", title: "Haram facilities", description: "Courtyard, wudu, drinking area.", capabilityId: "haram", depth: 2 },
  { id: "nabawi.basic", title: "Masjid an-Nabawi", description: "Green Dome, Rawdah, courtyards.", capabilityId: "haram", depth: 1 },
  { id: "polite.basic", title: "Greetings & courtesy", description: "Hello, thanks, please, sorry.", capabilityId: "family", depth: 1 },
  { id: "packing.basic", title: "Umrah packing", description: "Documents, ihram, comfort items.", capabilityId: "transportation", depth: 1 },
  { id: "clothes.basic", title: "Ihram & clothing", description: "Garments, size, laundry.", capabilityId: "haram", depth: 1 },
  { id: "shopping.basic", title: "Market shopping", description: "Dates, perfume, souvenirs.", capabilityId: "money", depth: 1 },
  { id: "shopping.deep", title: "Sizes & try-on", description: "Fit and market phrases.", capabilityId: "money", depth: 2 },
  { id: "health.deep", title: "Common ailments", description: "Fever, tired, allergy, medicine.", capabilityId: "health", depth: 2 },
  { id: "body.basic", title: "Body parts", description: "Head, hand, foot, stomach.", capabilityId: "health", depth: 1 },
  { id: "time.basic", title: "Time & schedule", description: "Now, today, tomorrow, minutes.", capabilityId: "time", depth: 1 },
  { id: "time.deep", title: "Prayer-time language", description: "Half hour, before, after.", capabilityId: "time", depth: 2 },
  { id: "actions.movement", title: "Movement verbs", description: "Walk, come, enter, go back.", capabilityId: "navigation", depth: 1 },
  { id: "actions.ritual", title: "Ritual movement", description: "Start, finished, circuit.", capabilityId: "haram", depth: 1 },
  { id: "adjectives.basic", title: "Size & quality", description: "Big, small, clean, broken.", capabilityId: "navigation", depth: 1 },
  { id: "geography.basic", title: "Holy cities", description: "Makkah, Madinah, Jeddah.", capabilityId: "transportation", depth: 1 },
  { id: "nature.basic", title: "Heat & comfort", description: "Sun, shade, thirsty, tired.", capabilityId: "health", depth: 1 },
  { id: "family.deep", title: "Extended family", description: "Father, mother, brother, sister.", capabilityId: "family", depth: 2 },
  { id: "room-service.basic", title: "In-room requests", description: "Towel, clean, broken AC.", capabilityId: "hotel", depth: 1 },
  { id: "airport.deep", title: "Immigration phrases", description: "Visa, passport, counter.", capabilityId: "transportation", depth: 2 },
  { id: "ritual.deep", title: "Umrah stage words", description: "Ihram, talbiyah, Sa'i.", capabilityId: "haram", depth: 2 },
  { id: "numbers.ordinals", title: "Ordinals", description: "First, second, third.", capabilityId: "numbers", depth: 2 },
]

export const vocabularyPools: VocabularyPool[] = defs.map((def) => ({
  ...def,
  vocabularyIds: wordsInPool(def.id).map((item) => item.id),
}))

export function getPool(id: string) {
  return vocabularyPools.find((pool) => pool.id === id)
}
