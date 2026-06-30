import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/constants/projects";
import { SITE } from "@/constants/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { absoluteUrl, buildPageMetadata, buildProjectJsonLd, jsonLdScript } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) return {};

  return buildPageMetadata({
    title: `${project.title} — Case Study`,
    description: project.longDescription,
    path: `/projects/${project.id}`,
    image: project.image,
    imageAlt: `${project.title} by ${SITE.name}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) notFound();

  const projectUrl = absoluteUrl(`/projects/${project.id}`);

  return (
    <main className="min-h-screen bg-background px-5 py-28 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(buildProjectJsonLd(project)) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb">
          <ol className="mb-10 flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#projects" className="transition-colors hover:text-foreground">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{project.title}</li>
          </ol>
        </nav>

        <Link
          href="/#projects"
          className="mb-10 inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Back to work
        </Link>

        <article itemScope itemType="https://schema.org/CreativeWork">
          <meta itemProp="url" content={projectUrl} />
          <p className="font-mono text-[11px] tracking-widest text-accent uppercase">{project.year}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl" itemProp="name">
            {project.title}
          </h1>
          <p className="mt-2 text-muted" itemProp="author">
            {project.role} · {SITE.name}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted" itemProp="description">
            {project.longDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {project.live && (
              <Button asChild>
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  Live demo
                  <ArrowUpRight size={16} />
                </a>
              </Button>
            )}
            {project.github && (
              <Button variant="outline" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  Source code
                </a>
              </Button>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
