export function getContactSubmitErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "text" in error) {
    const text = (error as { text?: unknown }).text;
    if (typeof text === "string" && text.trim()) return text;
  }

  return "Could not send your message. Please try again or email me directly.";
}
