import { useState } from "react";
import { ShoppingBag, Plus, Minus, X, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Link } from "@inertiajs/react";
import { useCart } from "../contexts/cartContext";
import { useI18n } from "@/lib/i18n";

type ShoppingCartSheetProps = {
  triggerClassName?: string;
  side?: "right" | "left" | "top" | "bottom";
};

export default function ShoppingCartSheet({
  triggerClassName = "",
  side,
}: ShoppingCartSheetProps) {
  const { t, direction, formatPrice } = useI18n();
  const sheetSide = side ?? (direction === "rtl" ? "left" : "right");
  const {
    cartItems,
    updateQuantity,
    removeItem,
    getCartTotal,
    getItemsCount,
    lastAdded,
    toastVisible,
    setToastVisible,
  } = useCart();

  const [sheetOpen, setSheetOpen] = useState(false);
  const hasItems = cartItems.length > 0;

  return (
    <>
      {/* ── Cart Sheet ─────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative rounded-full hover:bg-orange-200 ${triggerClassName}`}
          >
            <ShoppingBag className="h-5 w-5 text-black" />
            {getItemsCount() > 0 && (
              <span className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white tabular-nums">
                {getItemsCount()}
              </span>
            )}
            <span className="sr-only">{t("Open shopping cart")}</span>
          </Button>
        </SheetTrigger>

        <SheetContent side={sheetSide} className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="border-b pb-4 text-start">
            <SheetTitle className="text-xl">{t("Your Shopping Bag")}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-slate-300" />
                <p className="text-lg font-medium">{t("Your shopping bag is empty")}</p>
                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  {t("Shopping bag empty hint")}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 rtl:flex-row-reverse">
                    <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-slate-50">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 grid gap-1 text-start">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium leading-tight">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-500">{formatPrice(item.price)}</p>
                      <div className="mt-3 flex items-center justify-between gap-2 rtl:flex-row-reverse">
                        <div className="flex items-center rounded-full border" dir="ltr">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-s-full"
                            onClick={() => updateQuantity(item.id, false)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-e-full"
                            onClick={() => updateQuantity(item.id, true)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasItems && (
            <SheetFooter className="border-t pt-6">
              <div className="w-full space-y-4 text-start">
                <div className="flex justify-between gap-2 text-sm rtl:flex-row-reverse">
                  <span className="text-slate-500">{t("Subtotal")}</span>
                  <span className="font-medium tabular-nums">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between gap-2 text-sm rtl:flex-row-reverse">
                  <span className="text-slate-500">{t("Shipping")}</span>
                  <span className="font-medium">{t("Calculated at checkout")}</span>
                </div>
                <div className="flex justify-between gap-2 border-t pt-4 text-base font-semibold rtl:flex-row-reverse">
                  <span>{t("Total")}</span>
                  <span className="tabular-nums">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="grid gap-3">
                  <SheetClose asChild>
                    <Link href={route("checkout.index")}>
                      <Button className="w-full bg-orange-500 py-6 text-lg hover:bg-orange-600">
                        {t("Proceed to Checkout")}
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full">
                      <Link href="/categories">{t("Continue Shopping")}</Link>
                    </Button>
                  </SheetClose>
                </div>
                <p className="text-center text-xs text-slate-500">
                  {t("Shipping taxes checkout note")}
                </p>
              </div>
            </SheetFooter>
          )}

          {!hasItems && (
            <div className="border-t pt-6">
              <SheetClose asChild>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  <Link href="/categories">{t("Continue Shopping")}</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Bottom RIGHT Toast ─────────────────────────────── */}
      {lastAdded && (
        <div
          className={`fixed bottom-6 end-6 z-[999] w-[92vw] max-w-sm transition-all duration-300 ease-out ${
            toastVisible
              ? "opacity-100 translate-y-0"
              : "pointer-events-none translate-y-10 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
            {/* Draining progress bar */}
            <div
              key={toastVisible ? "active" : "inactive"}
              className="h-0.5 bg-orange-500"
              style={{
                animation: toastVisible ? "drain 3.5s linear forwards" : "none",
                transformOrigin: direction === "rtl" ? "right" : "left",
              }}
            />
            <div className="flex items-center gap-3 px-4 py-3.5 rtl:flex-row-reverse">
              {/* Product image */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0">
                {lastAdded.image ? (
                  <img src={lastAdded.image} alt={lastAdded.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1 text-start">
                <div className="mb-0.5 flex items-center gap-1.5 rtl:flex-row-reverse">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-xs font-semibold text-green-400">{t("Added to cart")}</span>
                </div>
                <p className="truncate text-sm font-semibold text-white">{lastAdded.name}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {getItemsCount()} {getItemsCount() === 1 ? t("item") : t("items")} {t("in bag")}
                </p>
              </div>

              {/* View bag — opens sheet */}
              <button
                type="button"
                onClick={() => {
                  setToastVisible(false);
                  setSheetOpen(true);
                }}
                className="flex shrink-0 items-center gap-1 rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-600 rtl:flex-row-reverse"
              >
                {t("View bag")}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </button>

              {/* Dismiss */}
              <button
                onClick={() => setToastVisible(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drain keyframe */}
      <style>{`
        @keyframes drain {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </>
  );
}
