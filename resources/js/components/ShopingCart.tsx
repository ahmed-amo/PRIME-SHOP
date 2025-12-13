import { ShoppingBag, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Link } from "@inertiajs/react";
import { useCart } from "../contexts/cartContext"; // adjust path if needed

type ShoppingCartSheetProps = {
  triggerClassName?: string;
  side?: "right" | "left" | "top" | "bottom";
};

export default function ShoppingCartSheet({
  triggerClassName = "",
  side = "right",
}: ShoppingCartSheetProps) {
  const { cartItems, updateQuantity, removeItem, getCartTotal, getItemsCount } = useCart();

  const hasItems = cartItems.length > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full hover:bg-orange-200 ${triggerClassName}`}
        >
          <ShoppingBag className="h-5 w-5 text-black" />
          {getItemsCount() > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
              {getItemsCount()}
            </span>
          )}
          <span className="sr-only">Open shopping cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent side={side} className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl">Your Shopping Bag</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-lg font-medium">Your shopping bag is empty</p>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">
                Looks like you haven't added anything to your bag yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[80px_1fr] gap-4">
                  <div className="aspect-square overflow-hidden rounded-md bg-slate-50">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="grid gap-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium leading-tight">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>

                    <p className="text-sm text-slate-500">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-full">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-full"
                          onClick={() => updateQuantity(item.id, false)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-full"
                          onClick={() => updateQuantity(item.id, true)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
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
            <div className="w-full space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>

              <div className="flex justify-between border-t pt-4 text-base font-semibold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="grid gap-3">
                <Link href="/client/checkout">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6 text-lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>

              <p className="text-xs text-center text-slate-500">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </SheetFooter>
        )}

        {!hasItems && (
          <div className="border-t pt-6">
            <SheetClose asChild>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
