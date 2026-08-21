/** Vocab still-life images for match / picture-choice activities under public/images/items/. */
export const vocabItemImageSrc: Record<string, string> = {
  ihram: "/images/items/ihram.webp",
  sandals: "/images/items/sandals.webp",
  charger: "/images/items/charger.webp",
  medicine: "/images/items/medicine.webp",
  passport: "/images/items/passport.webp",
  bag: "/images/items/bag.webp",
  phone: "/images/items/phone.webp",
}

export function vocabItemImage(id: string) {
  return vocabItemImageSrc[id]
}
