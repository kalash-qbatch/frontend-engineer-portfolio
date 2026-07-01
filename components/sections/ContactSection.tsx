"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Download, Mail, MapPin, Send } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { memo } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SITE } from "@/constants/site";
import { IMAGE_FRAMING } from "@/constants/images";
import { sendContactEmail } from "@/lib/emailjs";
import { getContactSubmitErrorMessage } from "@/lib/contact-errors";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { BentoCard } from "@/components/ui/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultTransition } from "@/utils/animations";
import { cn } from "@/lib/utils";
import Image from "next/image";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const SOCIAL_LINKS = [
  { icon: FaGithub, href: SITE.github, label: "GitHub" },
  { icon: FaLinkedin, href: SITE.linkedin, label: "LinkedIn" },
  { icon: FaXTwitter, href: SITE.twitter, label: "X" },
  { icon: Mail, href: `mailto:${SITE.email}`, label: "Email" },
];

export const ContactSection = memo(function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    const toastId = toast.loading("Sending your message…");

    try {
      await sendContactEmail(data);
      reset();
      toast.success("Message sent!", {
        id: toastId,
        description: "Thanks for reaching out — I'll get back to you soon.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Email failed to send", {
        id: toastId,
        description: getContactSubmitErrorMessage(error),
      });
    }
  };

  const onInvalid = (fieldErrors: FieldErrors<ContactForm>) => {
    const firstError = Object.values(fieldErrors).find((field) => field?.message)?.message;
    toast.error("Please fix the form errors", {
      description: firstError ?? "Check the highlighted fields and try again.",
    });
  };

  return (
    <section id="contact" className="relative py-6 md:py-14" aria-label="Contact">
      <div className="section-line mx-auto mb-24 max-w-7xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="06"
          label="Contact"
          title="Let's build together"
          description="Tell me about your project — I typically respond within 24 hours."
        />

        <div className="grid gap-4 lg:grid-cols-5 items-start">
          <BentoCard className="overflow-hidden lg:col-span-2" delay={0} noPadding>
            <div className="border-b border-border p-4 sm:p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#111] ring-1 ring-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <Image
                  src={SITE.contactPortraitImage}
                  alt={`${SITE.name} portrait`}
                  fill
                  className={cn(
                    IMAGE_FRAMING.contact,
                    "brightness-[1.04] contrast-[1.03] transition-transform duration-700 hover:scale-[1.03]"
                  )}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-mono text-[9px] tracking-[0.22em] text-white/85 uppercase">
                    Let&apos;s connect
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <ProfileAvatar size="md" shape="rounded" imageKey="office" priority />
                <div className="min-w-0 flex-1 border-l-2 border-accent pl-4">
                  <p className="font-display text-lg font-bold tracking-tight">{SITE.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{SITE.title}</p>
                  <p className="mt-2 font-mono text-[10px] tracking-wide text-accent uppercase">
                    Open to collaborations
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <MapPin size={16} className="shrink-0 text-foreground" />
                  {SITE.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Mail size={16} className="shrink-0 text-foreground" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-foreground transition-colors">
                    {SITE.email}
                  </a>
                </div>
              </div>

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

              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <a href={SITE.resumeUrl}>
                  <Download size={16} />
                  Download resume
                </a>
              </Button>
            </div>
          </BentoCard>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={defaultTransition}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="card-glow space-y-5 rounded-2xl p-6 md:p-8 lg:col-span-3"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Jane Doe" {...register("name")} aria-invalid={!!errors.name} />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jane@company.com" {...register("email")} aria-invalid={!!errors.email} />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Project inquiry" {...register("subject")} aria-invalid={!!errors.subject} />
              {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="What are you building?" {...register("message")} aria-invalid={!!errors.message} />
              {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full" variant="default">
              {isSubmitting ? (
                "Sending…"
              ) : (
                <>
                  <Send size={16} />
                  Send message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
});
