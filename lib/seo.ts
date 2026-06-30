import type { Metadata } from "next";
import { PROJECTS, type Project } from "@/constants/projects";
import { SITE } from "@/constants/site";

export const SEO_KEYWORDS = [
  "Palus Allah Rakha",
  "Frontend Engineer",
  "Frontend Developer",
  "React Developer",
  "Next.js Developer",
  "WebGL Developer",
  "Three.js Developer",
  "UI Engineer",
  "Motion Design",
  "Portfolio",
  "Lahore Pakistan",
  "JavaScript",
  "TypeScript",
  "Web Performance",
  "Accessibility",
] as const;

const ROBOTS_INDEX = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE.url).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image = SITE.seoImage,
  imageAlt = SITE.name,
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS],
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "technology",
    applicationName: SITE.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: SITE.locale,
      url,
      title,
      description,
      siteName: SITE.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: SITE.twitterHandle,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : ROBOTS_INDEX,
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.seoTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.seoDescription,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  applicationName: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE.url,
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    siteName: SITE.name,
    images: [
      {
        url: absoluteUrl(SITE.seoImage),
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    creator: SITE.twitterHandle,
    images: [absoluteUrl(SITE.seoImage)],
  },
  robots: ROBOTS_INDEX,
};

export function buildRootJsonLd() {
  const personId = `${SITE.url}#person`;
  const websiteId = `${SITE.url}#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE.name,
        givenName: SITE.firstName,
        familyName: "Allah Rakha",
        jobTitle: SITE.title,
        description: SITE.seoDescription,
        url: SITE.url,
        image: absoluteUrl(SITE.profileImage),
        email: `mailto:${SITE.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Three.js",
          "WebGL",
          "Framer Motion",
          "Web Performance",
          "Accessibility",
          "UI Engineering",
        ],
        sameAs: [SITE.github, SITE.linkedin, SITE.twitter],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE.name,
        url: SITE.url,
        description: SITE.seoDescription,
        inLanguage: "en-US",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.url}#services`,
        name: `${SITE.name} — Frontend Engineering`,
        url: `${SITE.url}/#services`,
        description: SITE.seoDescription,
        areaServed: "Worldwide",
        provider: { "@id": personId },
        serviceType: [
          "Frontend Development",
          "React Development",
          "Next.js Development",
          "Motion Design",
          "Web Performance Optimization",
        ],
      },
    ],
  };
}

export function buildHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE.url}#profile`,
        url: SITE.url,
        name: SITE.seoTitle,
        description: SITE.seoDescription,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE.url}#website` },
        mainEntity: { "@id": `${SITE.url}#person` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE.url}#projects`,
        name: "Selected Projects",
        itemListElement: PROJECTS.filter((p) => p.featured).map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/projects/${project.id}`),
          name: project.title,
        })),
      },
    ],
  };
}

export function buildProjectJsonLd(project: Project) {
  const url = absoluteUrl(`/projects/${project.id}`);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    headline: project.title,
    description: project.longDescription,
    url,
    datePublished: `${project.year}-01-01`,
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    creator: {
      "@type": "Person",
      name: SITE.name,
      jobTitle: project.role,
    },
    keywords: project.tags.join(", "),
    genre: "Web Development",
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE.url}#website` },
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
