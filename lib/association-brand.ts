export const ASK_PURPLE = "#A32F8E";

export type AssociationBrand = {
  slug: string;
  name: string;
  color: string;
  textColor: "#ffffff" | "#1f1f1f";
  aliases: string[];
};

export const ASSOCIATION_BRANDS: AssociationBrand[] = [
  { slug: "commedia-rf", name: "Commedia rf", color: "#F20D19", textColor: "#ffffff", aliases: ["commedia"] },
  { slug: "hanse-sf", name: "HanSe SF", color: "#F4E900", textColor: "#1f1f1f", aliases: ["hanse", "handel och service"] },
  { slug: "hosk-rf", name: "HoSK r.f.", color: "#006B3C", textColor: "#ffffff", aliases: ["hosk"] },
  { slug: "kult-rf", name: "Kult rf", color: "#60BBB5", textColor: "#1f1f1f", aliases: ["kult"] },
  { slug: "tlk-rf", name: "TLK r.f.", color: "#3555A5", textColor: "#ffffff", aliases: ["tlk", "tekniska läroverkets"] },
];

export function associationBrand(value?: string | null) {
  const normalized = (value || "").trim().toLocaleLowerCase("sv");
  return ASSOCIATION_BRANDS.find((brand) => brand.slug === normalized || brand.aliases.some((alias) => normalized.includes(alias))) || null;
}

export function readableTextColor(background: string) {
  const hex = background.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "#ffffff";
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = (0.299 * channels[0]! + 0.587 * channels[1]! + 0.114 * channels[2]!) / 255;
  return luminance > 0.64 ? "#1f1f1f" : "#ffffff";
}

export function effectiveAssociationColor(slug?: string | null, current?: string | null) {
  const brand = associationBrand(slug);
  return brand && (!current || current.toUpperCase() === ASK_PURPLE.toUpperCase()) ? brand.color : (current || ASK_PURPLE);
}
