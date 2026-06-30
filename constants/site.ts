import { IMAGE_SLOTS, PORTFOLIO_IMAGES } from "@/constants/images";

export const SITE = {
  name: "Palus Allah Rakha",
  firstName: "Palus",
  initials: "PAR",
  title: "Frontend Engineer",
  tagline: "Crafting immersive digital experiences.",
  email: "hello@palusallahrakha.dev",
  location: "Lahore, Pakistan",
  resumeUrl: "/resume.pdf",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  description:
    "Elite Frontend Engineer specializing in modern web experiences — React, Next.js, Three.js, and motion design.",
  seoTitle: "Palus Allah Rakha — Frontend Engineer | React, Next.js & WebGL",
  seoDescription:
    "Palus Allah Rakha is a Frontend Engineer from Lahore, Pakistan, building fast, accessible, and immersive web experiences with React, Next.js, Three.js, WebGL, and motion design.",
  seoImage: PORTFOLIO_IMAGES.professional,
  locale: "en_US",
  twitterHandle: "@palusallahrakha",
  url: "https://palusallahrakha.dev",
  profileImage: PORTFOLIO_IMAGES[IMAGE_SLOTS.nav],
  identityImage: PORTFOLIO_IMAGES[IMAGE_SLOTS.identity],
  heroPortraitImage: PORTFOLIO_IMAGES[IMAGE_SLOTS.hero],
  endingPortraitImage: PORTFOLIO_IMAGES[IMAGE_SLOTS.ending],
  contactPortraitImage: PORTFOLIO_IMAGES[IMAGE_SLOTS.contactCard],
  contactAvatarImage: PORTFOLIO_IMAGES[IMAGE_SLOTS.contactAvatar],
} as const;

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;
