import Portfolio from "@/components/Portfolio";
import { SITE } from "@/constants/site";
import { buildHomeJsonLd, buildPageMetadata, jsonLdScript } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: SITE.seoTitle,
  description: SITE.seoDescription,
  path: "/",
  image: SITE.seoImage,
  imageAlt: `${SITE.name} — ${SITE.title}`,
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(buildHomeJsonLd()) }}
      />
      <Portfolio />
    </>
  );
}
