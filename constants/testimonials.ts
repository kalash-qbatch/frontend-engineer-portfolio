export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Chen",
    role: "Product Director",
    company: "Vercel",
    content:
      "Palus transformed our developer portal with stunning 3D interactions while keeping Lighthouse scores above 95. Truly exceptional engineering.",
    avatar: "SC",
  },
  {
    id: "t2",
    name: "Marcus Johnson",
    role: "CTO",
    company: "Nexus Labs",
    content:
      "The attention to detail in every animation and interaction is remarkable. Palus doesn't just build websites — he crafts experiences.",
    avatar: "MJ",
  },
  {
    id: "t3",
    name: "Elena Rodriguez",
    role: "Design Lead",
    company: "Aurora Studio",
    content:
      "Working with Palus felt like having a motion designer and senior engineer in one. Our conversion rate increased 34% after the redesign.",
    avatar: "ER",
  },
  {
    id: "t4",
    name: "David Kim",
    role: "Founder",
    company: "Pulse Health",
    content:
      "Accessibility was non-negotiable for us. Palus delivered a beautiful, fully accessible product that our users love.",
    avatar: "DK",
  },
  {
    id: "t5",
    name: "Lisa Park",
    role: "Engineering Manager",
    company: "Stripe",
    content:
      "One of the best frontend engineers I've worked with. Clean code, great communication, and always pushing for excellence.",
    avatar: "LP",
  },
];
