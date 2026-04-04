import { useCallback } from "react";
import { usePage } from "@inertiajs/react";
import { formatDA } from "@/lib/currency";
import { messagesForLocale, type MessagesMap } from "@/lib/lang-catalog";

/** Localize Laravel pagination link HTML for Arabic (Previous / Next). */
export function localizePaginationLabelHtml(html: string, locale: string): string {
  if (locale !== "ar") return html;
  return html
    .replace(/&laquo;\s*Previous\s*/gi, "السابق ")
    .replace(/Next\s*&raquo;/gi, "التالي ")
    .replace(/\bPrevious\b/gi, "السابق")
    .replace(/\bNext\b/gi, "التالي");
}

export function useI18n() {
  const props = usePage().props as {
    locale?: string;
    direction?: "rtl" | "ltr";
  };

  const locale = props.locale ?? "en";
  const messages: MessagesMap = messagesForLocale(locale);

  const t = (key: string): string => messages[key] ?? key;

  const formatPrice = useCallback(
    (value: number | string | null | undefined) => formatDA(value, locale),
    [locale],
  );

  return {
    t,
    locale,
    direction: props.direction ?? "ltr",
    formatPrice,
  };
}
