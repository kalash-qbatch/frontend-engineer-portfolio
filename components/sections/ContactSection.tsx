"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Download, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { memo } from "react";
import { SITE } from "@/constants/site";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { defaultTransition } from "@/utils/animations";

const ContactForm = dynamic(
  () => import("@/components/sections/ContactForm").then((m) => ({ default: m.ContactForm })),
  {
    ssr: false,
    loading: () => (
      <div
        className="card-glow relative flex h-full min-h-[420px] animate-pulse flex-col overflow-hidden rounded-2xl bg-surface/20"
        aria-hidden
      />
    ),
  }
);

const SOCIAL_LINKS = [
  { icon: FaGithub, href: SITE.github, label: "GitHub" },
  { icon: FaLinkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: FaXTwitter, href: SITE.twitter, label: "X" },
  { icon: Mail, href: `mailto:${SITE.email}`, label: "Email" },
];

const PHONE_HREF = `tel:${SITE.phone.replace(/\s/g, "")}`;

export const ContactSection = memo(function ContactSection() {
  return (
    <section className="relative py-6 md:py-14" aria-label="Contact">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          id="contact"
          index="06"
          label="Contact"
          title="Let's build together"
          description="Tell me about your project — I typically respond within 24 hours."
        />

        <div className="grid gap-4 lg:grid-cols-5 lg:items-stretch">
          <BentoCard className="flex h-full flex-col lg:col-span-2" delay={0} noPadding>
            <div className="border-b border-border px-6 py-6 md:px-8 md:py-7">
              <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
                Contact
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                Let&apos;s Connect
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Reach out for collaborations, freelance work, or just to say hello.
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <ProfileAvatar size="md" shape="rounded" imageKey="office" />
                <div className="min-w-0 flex-1 border-l-2 border-accent pl-4">
                  <p className="font-display text-lg font-bold tracking-tight">{SITE.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{SITE.title}</p>
                  <p className="mt-2 font-mono text-[10px] tracking-wide text-accent uppercase">
                    Open to collaborations
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/40">
                    <MapPin size={15} className="text-foreground" />
                  </span>
                  {SITE.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/40">
                    <Mail size={15} className="text-foreground" />
                  </span>
                  <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-foreground">
                    {SITE.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface/40">
                    <Phone size={15} className="text-foreground" />
                  </span>
                  <a href={PHONE_HREF} className="transition-colors hover:text-foreground">
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="mt-auto space-y-5 border-t border-border pt-5">
                <div className="flex gap-2">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-border-hover hover:text-foreground"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <a href={SITE.resumeUrl}>
                    <Download size={16} />
                    Download resume
                  </a>
                </Button>
              </div>
            </div>
          </BentoCard>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={defaultTransition}
            className="lg:col-span-3"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
});
