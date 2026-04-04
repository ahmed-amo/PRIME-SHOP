import ar from "../../../lang/ar.json";
import en from "../../../lang/en.json";

export type MessagesMap = Record<string, string>;

const catalogs: Record<string, MessagesMap> = {
    en: en as MessagesMap,
    ar: ar as MessagesMap,
};

/** Bundled locale strings — avoids sending full JSON on every Inertia request. */
export function messagesForLocale(locale: string | undefined): MessagesMap {
    const key = locale === "ar" ? "ar" : "en";

    return catalogs[key] ?? catalogs.en;
}
