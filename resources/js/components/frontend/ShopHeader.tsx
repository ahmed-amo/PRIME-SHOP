import { useState, useEffect } from "react";
import {
  Search,
  HelpCircle,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  Heart,
  Package,
  Plus,
  Minus,
  X,
  UserCog
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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

import { Link, router, usePage } from "@inertiajs/react";
import { useCart } from "../../contexts/cartContext";

export default function NavBarOne() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Cart hook
  const { cartItems, updateQuantity, removeItem, getCartTotal, getItemsCount } = useCart();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { auth } = usePage().props as any;
  const user = auth.user;
  const isGuest = !user;
  const isAdmin = user && user.role === "admin";

  const handleLogout = () => {
    router.post(route("logout"));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-gray-50 border-gray-200 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between px-4 md:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold tracking-tight text-black">
              Prime SH
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
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

          {/* Main Navigation (client only) */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center gap-6 mr-8">
              <Link
                href="/collections"
                className="text-black hover:text-orange-500 font-medium"
              >
                Collections
              </Link>

              <Link
                href="/categories"
                className="text-black hover:text-orange-500 font-medium"
              >
                Categories
              </Link>

              <Link
                href="/sales"
                className="relative text-black hover:text-orange-500 font-medium"
              >
                Sales
                <span className="absolute top-6 -right-7 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  NEW
                </span>
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">

            {/* Guest */}
            {isGuest && (
              <>
                <Link href={route("login")}>
                  <Button className="rounded-full text-black hover:bg-orange-300 px-4 py-2">
                    Login
                  </Button>
                </Link>

                <Link href={route("register")}>
                  <Button variant="ghost" className="rounded-full text-black hover:bg-orange-200 px-4 py-2">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Logged In */}
            {!isGuest && (
              <>
                {/* ADMIN VIEW */}
                {isAdmin && (
                  <div className="hidden md:flex items-center gap-3">

                    <Link href={route("admin.dashboard")}>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-5 py-2 rounded-full">
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Button>
                    </Link>

                    <Button
                      onClick={handleLogout}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-5 py-2 rounded-full"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                )}

                {/* CLIENT VIEW */}
                {!isAdmin && (
                  <>
                    {/* Help */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hidden md:flex rounded-full text-black hover:bg-orange-200"
                        >
                          <HelpCircle className="h-5 w-5 text-black" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-5xl w-full p-8">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold">Customer Support</DialogTitle>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    {/* Shopping Cart */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full relative text-black hidden md:flex hover:bg-orange-200"
                        >
                          <ShoppingBag className="h-5 w-5 text-black" />
                          {getItemsCount() > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                              {getItemsCount()}
                            </span>
                          )}
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
                                  ${getCartTotal().toFixed(2)}
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
                                  ${getCartTotal().toFixed(2)}
                                </span>
                              </div>
                              <div className="grid gap-2">
                                <Link href="/checkout">
                                  <Button className="w-full bg-orange-500 hover:bg-orange-600 py-6">
                                    Proceed to Checkout
                                  </Button>
                                </Link>
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

                    {/* CLIENT PROFILE DROPDOWN */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-semibold">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel className="font-bold">{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href="/client/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard size={18} />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href="/client/orders" className="flex items-center gap-2 cursor-pointer">
                            <Package size={18} />
                            My Orders
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href="/client/wishlist" className="flex items-center gap-2 cursor-pointer">
                            <Heart size={18} />
                            Wishlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/client/profile" className="flex items-center gap-2 cursor-pointer">
                            <UserCog size={18} />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                          <LogOut size={18} />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu (client only) */}
            {!isAdmin && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-black">
                    <svg width="20" height="12" viewBox="0 0 18 11">
                      <path d="M0 0.5H18" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M0 5.5H18" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M0 10.5H18" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
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
                      <Link href="/collections" className="py-2 text-base text-black">
                        Collections
                      </Link>
                      <Link href="/categories" className="py-2 text-base text-black">
                        Categories
                      </Link>
                      <Link href="/sales" className="py-2 text-base text-black">
                        Sales
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
