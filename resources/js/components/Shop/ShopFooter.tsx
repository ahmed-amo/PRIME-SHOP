import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function FooterV2() {
  const { t, direction } = useI18n();
  const isRtl = direction === "rtl";

  return (
    <footer dir={direction} className="w-full text-black">
      <div className="container px-4 py-16 md:px-6 mx-auto border-orange">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">PRIME SH</span>
            </div>
            <p className="text-sm text-black/90">
              {t("Trusted in more than 100 countries & 5 million customers. Have any query? contact us we are here for you.")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#"
                className="rounded-full bg-black p-2 hover:bg-white/90"
              >
                <Twitter className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Instagram className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Linkedin className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-white p-2 hover:bg-white/90"
              >
                <Youtube className="h-4 w-4 text-[#f97316]" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("Get In Touch")}</h3>
            <div className="space-y-2 text-sm">
              <p>support@primeshop.dz</p>
              <p>+213 542710628</p>
              <p>Constantine, Algeria</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">{t("Quick Links")}</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link className="hover:underline" href="#">
                  {t("Home")}
                </Link>
                <Link className="hover:underline" href="#">
                  {t("FAQs")}
                </Link>
                <Link className="hover:underline" href="#">
                  {t("Price Plan")}
                </Link>
                <Link className="hover:underline" href="#">
                  {t("Features")}
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold invisible">Links</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link className="hover:underline" href="#">
                  {t("Careers")}
                </Link>
                <Link className="hover:underline" href="#">
                  {t("About")}
                </Link>
                <Link className="hover:underline" href="#">
                  {t("Contact")}
                </Link>
                <Link className="hover:underline" href="#">
                  {t("Products")}
                </Link>
              </nav>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t("Newsletter")}</h3>
            <form className="space-y-2">
              <Input
                dir="auto"
                className="bg-white/10 border-white/20 placeholder:text-white/50"
                placeholder={t("Enter email..")}
                type="email"
              />
              <Button
                type="submit"
                className={`inline-flex w-full items-center justify-center gap-2 bg-white text-[#f97316] hover:bg-white/90 ${isRtl ? "flex-row-reverse" : ""}`}
              >
                {t("Subscribe")}
                <svg
                  className="size-4 shrink-0 rtl:-scale-x-100"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="  mx-auto container flex flex-col items-center justify-center gap-4 py-6 text-center text-sm md:h-16 md:flex-row md:py-0">
          <div className="text-black/60 mx-auto">
            {t("Copyright@2023 All Right Reserved Pagedone.")}
          </div>
        </div>
      </div>
    </footer>
  );
}
