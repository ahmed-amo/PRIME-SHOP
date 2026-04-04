import { router } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FLAG_GB = "https://flagcdn.com/w40/gb.png";
const FLAG_DZ = "https://flagcdn.com/w40/dz.png";

const locales = [
  { code: "en" as const, label: "EN", name: "English", flagUrl: FLAG_GB },
  { code: "ar" as const, label: "AR", name: "العربية", flagUrl: FLAG_DZ },
];

function FlagImg({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex h-[18px] w-7 shrink-0 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/10">
      <img
        src={src}
        alt={alt}
        width={28}
        height={18}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

/** Always black labels — overrides ghost/dark/popover inheritance */
const ink = "!text-black hover:!text-black focus-visible:!text-black data-[state=open]:!text-black";

export default function LanguageSwitcher() {
  const { locale, t, direction } = useI18n();
  const active = locales.find((item) => item.code === locale) ?? locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={`${t("Language")}: ${active.name}`}
          className={cn(
            ink,
            "h-9 gap-1.5 rounded-full border border-transparent bg-transparent px-2 shadow-none sm:h-10 sm:gap-2 sm:px-3",
            "hover:bg-black/[0.06] dark:hover:bg-white/[0.08]",
            "focus-visible:ring-1 focus-visible:ring-border focus-visible:ring-offset-0",
            "min-w-0 justify-between font-semibold sm:min-w-[4.25rem]",
            "[&>span:first-child]:text-start",
            "touch-manipulation",
            "data-[state=open]:bg-black/[0.06] dark:data-[state=open]:bg-white/[0.08]",
            "[&_svg]:!text-black",
          )}
        >
          <span className={cn("flex items-center gap-1.5 sm:gap-2", ink)}>
            <FlagImg src={active.flagUrl} alt="" />
            <span className={cn("hidden tabular-nums tracking-tight sm:inline", ink)}>
              {active.label}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 !text-black opacity-100 sm:h-4 sm:w-4",
              direction === "rtl" && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[12rem] rounded-2xl border border-neutral-200 bg-white p-1.5 !text-black shadow-lg dark:border-neutral-200 dark:bg-white dark:!text-black"
      >
        <p className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider !text-black">
          {t("Language")}
        </p>
        {locales.map((item) => (
          <DropdownMenuItem
            key={item.code}
            aria-current={item.code === locale ? "true" : undefined}
            onClick={() => {
              if (item.code === locale) {
                return;
              }
              router.post(route("locale.switch", { locale: item.code }));
            }}
            className={cn(
              "gap-3 rounded-xl px-2 py-2.5 text-start !text-black opacity-100",
              "focus:bg-neutral-100 focus:!text-black data-[highlighted]:bg-neutral-100 data-[highlighted]:!text-black",
              item.code === locale ? "cursor-default bg-neutral-100" : "cursor-pointer",
            )}
          >
            <FlagImg src={item.flagUrl} alt="" />
            <span className="flex min-w-0 flex-1 flex-col items-stretch gap-0 text-start">
              <span className="text-sm font-semibold leading-none !text-black">{item.label}</span>
              <span className="text-xs !text-black">{item.name}</span>
            </span>
            {item.code === locale && (
              <span className="text-xs font-semibold !text-black">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
