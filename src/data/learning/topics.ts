import type { Topic } from "@/lib/learning-types"

export const studyTopics: Topic[] = [
  { id: "numbers", title: "Numbers", description: "Count, order, and recognize numbers in real situations.", order: 1 },
  { id: "polite", title: "Polite essentials", description: "Greetings, thanks, and phrases that open every conversation.", order: 2 },
  { id: "packing", title: "Umrah packing", description: "Documents, ihram, and what goes in your bag.", order: 3 },
  { id: "navigation", title: "Navigation", description: "Taxi words, directions, and finding your way.", order: 4 },
  { id: "transport", title: "Transportation", description: "Taxi, bus, car, and station vocabulary.", order: 5 },
  { id: "airport", title: "Airport & arrival", description: "Passport, bags, exit, and the taxi stand.", order: 6 },
  { id: "geography", title: "Holy cities", description: "Makkah, Madinah, Jeddah, and the route between them.", order: 7 },
  { id: "hotel", title: "Hotel", description: "Room, floor, elevator, and reception.", order: 8 },
  { id: "room-service", title: "Room service", description: "Towels, clean room, and reporting problems.", order: 9 },
  { id: "money", title: "Money & prices", description: "How much, riyals, cash, card, and the bill.", order: 10 },
  { id: "food", title: "Food", description: "Ordering, customizing, and closing a meal.", order: 11 },
  { id: "shopping", title: "Shopping", description: "Market stalls, souvenirs, and asking the price.", order: 12 },
  { id: "colors", title: "Colors", description: "Name and recognize colors — from basics to richer shades.", order: 13 },
  { id: "clothes", title: "Clothes & ihram", description: "Garments, sandals, and asking for a size.", order: 14 },
  { id: "time", title: "Time", description: "Now, today, tomorrow, and wait times.", order: 15 },
  { id: "family", title: "Family", description: "Your group and who you are looking for.", order: 16 },
  { id: "haram", title: "Masjid al-Haram", description: "Places, gates, and finding your way inside.", order: 17 },
  { id: "ritual", title: "Umrah actions", description: "Stage words and movement language — not rulings.", order: 18 },
  { id: "nabawi", title: "Masjid an-Nabawi", description: "Place names and directions in Madinah.", order: 19 },
  { id: "barber", title: "Barber", description: "Shave, trim, and paying after Umrah.", order: 20 },
  { id: "health", title: "Medicine & health", description: "Sick, pharmacy, and common ailments.", order: 21 },
  { id: "body", title: "Body parts", description: "Point to where it hurts.", order: 22 },
  { id: "actions", title: "Actions", description: "Walk, wait, stop, enter — by situation.", order: 23 },
  { id: "adjectives", title: "Adjectives", description: "Big, small, clean, hot, and cold.", order: 24 },
  { id: "nature", title: "Heat & comfort", description: "Sun, shade, water, and tired outdoors.", order: 25 },
  { id: "hajj", title: "Hajj places", description: "Mina, Arafat, buses, and camps.", order: 26 },
]

export function getTopic(id: Topic["id"]) {
  return studyTopics.find((topic) => topic.id === id)
}
