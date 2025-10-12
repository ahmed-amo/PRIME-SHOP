
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  User,
  ChevronDown,
  Plus,
  Minus,
  X,
  Search,
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";

// Sample cart items for demonstration
const initialCartItems = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 299.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Smart Watch Ultra Series",
    price: 429.99,
    quantity: 1,
    image: "/placeholder.svg?height=80&width=80",
  },
];

export default function NavBarOne() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateQuantity = (id: number, increment: boolean) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: increment
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1),
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <header
    className={`sticky top-0 z-50 w-full border-b bg-gray-50 border-b border-gray-200 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md" : "bg-white"
    }`}
  >
    <div className="container mx-auto ">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-40">
              <div className="flex items-center">
                <span className="text-3xl font-bold tracking-tight text-black">
                  Prime SH
                </span>
                <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative flex w-full items-center">
            <Input
              type="search"
              placeholder="Search products, brands and categories"
              className="h-10 w-full rounded-r-none border-r-0 text-black"
            />
            <Button
              type="submit"
              className="h-10 rounded-l-none bg-orange-500 hover:bg-orange-600"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-6">
          <Link href={route('login')}>
            <Button
            variant="ghost" className="rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200 cursor-pointer px-4 py-2 border-black">
            Login
            </Button>
          </Link>

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200  cursor-pointer"
              >
                <User className="h-5 w-5 text-black" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuLabel>Dashboard</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Orders</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Wishlist</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Dialog>
            <DialogTrigger asChild>
            <Button
  variant="ghost"
  size="icon"
  className="hidden md:flex rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200  cursor-pointer"
>
                <HelpCircle className="h-5 w-5 text-black" />
                <span className="sr-only">Help</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Customer Support</DialogTitle>
              </DialogHeader>
              <div className="flex gap-6 py-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="font-medium mb-2">Contact Us</h3>
                  <p className="text-sm text-slate-600 mb-1">
                    Email: support@luxeplus.com
                  </p>
                  <p className="text-sm text-slate-600 mb-1">
                    Phone: +1 (800) 123-4567
                  </p>
                  <p className="text-sm text-slate-600">
                    Hours: 24/7 Concierge Support
                  </p>
                </div>
                <div className="grid gap-3">
                  <h3 className="font-medium">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="#"
                      className="text-sm text-orange-500 hover:underline"
                    >
                      Shipping Information
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-orange-500 hover:underline"
                    >
                      Returns & Exchanges
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-orange-500 hover:underline"
                    >
                      Order Tracking
                    </Link>
                    <Link
                      href="#"
                      className="text-sm text-orange-500 hover:underline"
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Shopping Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative text-black hidden md:flex rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200  cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5 text-black" />
                {cartItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-xl">Your Shopping Bag</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-auto py-6">
                {cartItems.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-slate-300" />
                    <p className="mt-6 text-lg font-medium">
                      Your shopping bag is empty
                    </p>
                    <p className="mt-2 text-sm text-slate-500 text-center max-w-xs">
                      Looks like you haven't added anything to your bag yet.
                    </p>
                    <SheetClose asChild>
                      <Button className="mt-8 bg-orange-500 hover:bg-orange-600">
                        Continue Shopping
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[80px_1fr] gap-4"
                      >
                        <div className="aspect-square overflow-hidden rounded-md bg-slate-50">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="grid gap-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium leading-tight">
                              {item.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => removeItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                          <p className="text-sm text-slate-500">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border rounded-full">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateQuantity(item.id, false)}
                              >
                                <Minus className="h-3 w-3" />
                                <span className="sr-only">
                                  Decrease quantity
                                </span>
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => updateQuantity(item.id, true)}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">
                                  Increase quantity
                                </span>
                              </Button>
                            </div>
                            <div className="ml-auto font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <SheetFooter className="border-t pt-6">
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Subtotal</span>
                      <span className="font-medium">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Shipping</span>
                      <span className="font-medium">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-base font-semibold">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="grid gap-2">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6">
                        Proceed to Checkout
                      </Button>
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </SheetClose>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-4">
                      Shipping & taxes calculated at checkout
                    </p>
                  </div>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-black">
                <svg
                  width="18"
                  height="11"
                  viewBox="0 0 18 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.5H18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 5.5H18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 10.5H18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-black" />
                  <Input placeholder="Search" className="pl-9 text-black" />
                </div>
                <nav className="grid gap-2">
                  <Link
                    href="#"
                    className="flex items-center justify-between py-2 text-base font-medium text-black"
                  >
                    New Arrivals <ChevronDown className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-between py-2 text-base font-medium text-black"
                  >
                    Women <ChevronDown className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-between py-2 text-base font-medium text-black"
                  >
                    Men <ChevronDown className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-between py-2 text-base font-medium text-black"
                  >
                    Accessories <ChevronDown className="h-4 w-4" />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-between py-2 text-base font-medium text-black"
                  >
                    Collections <ChevronDown className="h-4 w-4" />
                  </Link>
                </nav>
                <div className="border-t pt-4 mt-6">
                  <nav className="grid gap-1">
                    <Link href="#" className="text-sm py-2 text-black">
                      Account
                    </Link>
                    <Link href="#" className="text-sm py-2 text-black">
                      Wishlist
                    </Link>
                    <Link href="#" className="text-sm py-2 text-black">
                      Order Tracking
                    </Link>
                    <Link href="#" className="text-sm py-2 text-black">
                      Help & Contact
                    </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </header>
  );
}
