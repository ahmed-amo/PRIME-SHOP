import { useState, type LucideIcon, type ReactNode } from "react";
import { Truck, ShieldCheck, Banknote, Lock, ImageOff } from "lucide-react";

type Accent = "orange" | "blue" | "emerald";

const accentRing: Record<Accent, string> = {
  orange: "ring-orange-200/60 shadow-orange-500/5",
  blue: "ring-blue-200/60 shadow-blue-500/5",
  emerald: "ring-emerald-200/60 shadow-emerald-500/5",
};

const accentBlob: Record<Accent, string> = {
  orange: "from-orange-400/20 to-amber-300/10",
  blue: "from-blue-400/15 to-sky-300/10",
  emerald: "from-emerald-400/15 to-teal-300/10",
};

const accentIconBg: Record<Accent, string> = {
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

const accentFallbackBg: Record<Accent, string> = {
  orange: "from-orange-100 to-amber-50",
  blue: "from-blue-50 to-sky-100",
  emerald: "from-emerald-50 to-teal-50",
};

type Block = {
  title: string;
  body: ReactNode;
  icon: LucideIcon;
  accent: Accent;
  image: string;
};

const blocks: Block[] = [
  {
    title: "24h fast delivery",
    image: "/front/deliveryy.png",
    body: (
      <>
        Orders ship fast — often within about <span className="font-semibold text-zinc-800">24 hours</span> where we
        deliver.
      </>
    ),
    icon: Truck,
    accent: "orange",
  },
  {
    title: "Flexible payment",
    image: "/front/payments.png",
    body: (
      <>
        <span className="font-semibold text-zinc-800">Stripe</span>,{" "}
        <span className="font-semibold text-zinc-800">Dahabia (CIB)</span>,{" "}
        <span className="font-semibold text-zinc-800">PayPal</span>, or{" "}
        <span className="font-semibold text-zinc-800">cash</span> where available.
      </>
    ),
    icon: Banknote,
    accent: "blue",
  },
  {
    title: "Secured & trusted",
    image: "/front/cyber-security.png",
    body: (
      <span className="flex flex-wrap items-center gap-x-1">
        <Lock className="inline h-3 w-3 shrink-0 text-zinc-500" aria-hidden />
        <span>
          Secure checkout. Trusted by <span className="font-semibold text-zinc-800">1000+ sellers</span>.
        </span>
      </span>
    ),
    icon: ShieldCheck,
    accent: "emerald",
  },
];

function FeatureImage({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: Accent;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative w-full max-w-md md:max-w-none">
      <div
        className={`pointer-events-none absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br opacity-70 blur-xl ${accentBlob[accent]}`}
        aria-hidden
      />
      <div
        className={`relative overflow-hidden rounded-xl border border-white bg-zinc-100 shadow-md ring-2 ${accentRing[accent]} md:rounded-2xl`}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            className="h-44 w-full object-cover sm:h-48 md:h-52 md:max-h-[13rem]"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={`flex h-44 flex-col items-center justify-center gap-2 bg-gradient-to-br px-4 text-center sm:h-48 md:h-52 ${accentFallbackBg[accent]}`}
          >
            <ImageOff className="h-8 w-8 text-zinc-400" aria-hidden />
            <p className="text-xs text-zinc-600">Missing: {src}</p>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/[0.05] md:rounded-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/15 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function ShopDeliveryTrust() {
  return (
    <section
      className="border-t border-zinc-200 bg-zinc-50/90 py-6 md:py-8"
      aria-label="Delivery and payment information"
    >
      <div className="mx-auto max-w-4xl px-3 sm:px-5 md:px-6">
        <div className="mb-6 text-center md:mb-7">
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Why shop with us</p>
          <h2 className="mt-1 text-lg font-bold text-zinc-900 md:text-xl">Delivery, payments &amp; trust</h2>
        </div>

        <div className="flex flex-col gap-7 md:gap-8">
          {blocks.map((block, index) => {
            const imageOnLeft = index % 2 === 0;
            const Icon = block.icon;

            return (
              <div
                key={block.title}
                className={`flex flex-col items-stretch gap-4 md:gap-6 ${
                  imageOnLeft ? "md:flex-row" : "md:flex-row-reverse"
                } md:items-center`}
              >
                <div className="w-full shrink-0 md:w-[44%]">
                  <FeatureImage src={block.image} alt={block.title} accent={block.accent} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="rounded-xl border border-zinc-200/90 bg-white p-4 shadow-sm md:rounded-2xl md:p-5">
                    <div
                      className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${accentIconBg[block.accent]}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 md:text-lg">{block.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 md:text-sm">{block.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
