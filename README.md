# Portfolio Frontend

Award-worthy portfolio website built with Next.js 15, React 19, Three.js, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, TypeScript, TailwindCSS, Shadcn UI
- **3D:** Three.js, React Three Fiber, Drei
- **Animation:** Framer Motion, GSAP, Lenis Smooth Scroll
- **Forms:** React Hook Form + Zod

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

Edit `constants/site.ts` to update your name, links, and contact info.
Edit `constants/projects.ts`, `skills.ts`, `experience.ts`, etc. for your content.

## Contact Form

The contact form is set up with validation. To enable email sending:

1. **Resend:** Create an API route at `app/api/contact/route.ts`
2. **EmailJS:** Add your service ID and integrate in `ContactSection.tsx`

## Deploy

Optimized for Vercel:

```bash
npm run build
```

## Features

- Boot sequence loading screen
- 3D hero scene with mouse parallax
- Interactive skill galaxy
- Project cards with tilt effects
- Animated timeline
- Infinite testimonial marquee
- Command palette (⌘K)
- Custom cursor
- Smooth scroll with Lenis
- Reduced motion support
- Full SEO (metadata, sitemap, robots, JSON-LD)
# frontend-engineer-portfolio
