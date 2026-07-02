"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { sendContactEmail } from "@/lib/emailjs";
import { getContactSubmitErrorMessage } from "@/lib/contact-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
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

  const onInvalid = (fieldErrors: FieldErrors<ContactFormValues>) => {
    const firstError = Object.values(fieldErrors).find((field) => field?.message)?.message;
    toast.error("Please fix the form errors", {
      description: firstError ?? "Check the highlighted fields and try again.",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="card-glow relative flex h-full flex-col overflow-hidden rounded-2xl"
      noValidate
      autoComplete="off"
      data-lpignore="true"
      data-1p-ignore
      data-bwignore
    >
      <div className="border-b border-border px-6 py-6 md:px-8 md:py-7">
        <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">Message</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
          Send a message
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Share your project details and I&apos;ll reply within 24 hours.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input
              id="contact-name"
              placeholder="Jane Doe"
              autoComplete="name"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="jane@company.com"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input
            id="contact-subject"
            placeholder="Project inquiry"
            autoComplete="off"
            {...register("subject")}
            aria-invalid={!!errors.subject}
          />
          {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
        </div>
        <div className="flex flex-1 flex-col space-y-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            placeholder="What are you building?"
            className="min-h-[140px] flex-1 resize-none"
            autoComplete="off"
            {...register("message")}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-auto w-full" variant="default">
          {isSubmitting ? (
            "Sending…"
          ) : (
            <>
              <Send size={16} />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
