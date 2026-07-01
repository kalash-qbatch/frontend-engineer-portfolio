export type ImageTreatment = "cover" | "contain" | "editorial";
export type ImageTone = "warm" | "cool" | "neutral" | "mono";

export const PORTFOLIO_IMAGES = {
  heroCutout: "/photos/hero-cutout.png",
  professional: "/photos/portrait-professional.png",
  office: "/photos/portrait-office.png",
  executive: "/photos/portrait-executive.png",
  outdoor: "/photos/portrait-outdoor.png",
  contact: "/photos/portrait-contact.png",
} as const;

export type PortfolioImageKey = keyof typeof PORTFOLIO_IMAGES;

/** Which portrait file each UI surface should use */
export const IMAGE_SLOTS = {
  nav: "professional",
  identity: "executive",
  hero: "heroCutout",
  boot: "outdoor",
  ending: "outdoor",
  contactCard: "contact",
  contactAvatar: "office",
} as const satisfies Record<string, PortfolioImageKey>;

export const IMAGE_FRAMING = {
  avatar: "object-[center_18%]",
  heroCutout: "object-contain object-bottom",
  professional: "object-cover object-[center_20%]",
  office: "object-cover object-[center_24%]",
  executive: "object-cover object-[center_20%]",
  outdoor: "object-cover object-[center_30%]",
  contact: "object-cover object-[center_22%]",
} as const;

export const EARTH_MAP =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
