/** Map stamps that have generated files under public/images/missions/. */
export const missionImageSrc: Record<string, string> = {
  "taxi-hotel": "/images/missions/taxi-hotel.webp",
  "airport-arrival": "/images/missions/airport-arrival.webp",
  immigration: "/images/missions/immigration.webp",
  "find-haram": "/images/missions/find-haram.webp",
  "enter-haram": "/images/missions/enter-haram.webp",
  "begin-tawaf": "/images/missions/begin-tawaf.webp",
  "find-zamzam": "/images/missions/find-zamzam.webp",
  "complete-sai": "/images/missions/complete-sai.webp",
  "order-dinner": "/images/missions/order-dinner.webp",
  "lost-group": "/images/missions/lost-group.webp",
  "something-wrong": "/images/missions/something-wrong.webp",
  barber: "/images/missions/barber.webp",
  "day-madinah": "/images/missions/day-madinah.webp",
}

/** Wide banners for mission place / play frames (falls back to square stamp). */
export const missionBannerSrc: Record<string, string> = {
  immigration: "/images/missions/immigration-banner.webp",
}

export function missionSceneImage(missionId: string, wide = false) {
  if (wide && missionBannerSrc[missionId]) return missionBannerSrc[missionId]
  return missionImageSrc[missionId]
}
