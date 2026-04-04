/**
 * Algerian dinar: whole amount, no decimals.
 * English: "1,200 DA"; Arabic (ar): "1٬200 د.ج" with ar-DZ grouping.
 */
export function formatDA(
  value: number | string | null | undefined,
  locale: string = "en",
): string {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) {
    return locale === "ar" ? "0 د.ج" : "0 DA";
  }

  const n = Math.round(numeric);
  if (locale === "ar") {
    return `${n.toLocaleString("ar-DZ")} د.ج`;
  }
  return `${n.toLocaleString("en-DZ")} DA`;
}
