import { useState, useEffect } from "react";
import {
  User,
  ChevronDown,
  Search,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { usePage } from '@inertiajs/react';
import { Link, router } from "@inertiajs/react";
export default function NavBarOne() {
  const [isScrolled, setIsScrolled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { auth } = usePage().props as any;
  const user = auth.user;
  const isGuest = !user;
  const handleLogout = () => {
  router.post(route('logout'));
};
  // Track scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

            {/* GUEST VIEW - Login, Signup, Help */}
            {isGuest ? (
              <>
                {/* Login Button */}
                <Link href={route('login')}>
                  <Button

                    className="rounded-full text-black hover:bg-orange-300 hover:text-black transition-colors duration-200 cursor-pointer px-4 py-2"
                  >
                    Login
                  </Button>
                </Link>

                {/* Signup Button */}
                <Link href={route('register')}>
                  <Button
                    variant="ghost"
                    className="rounded-full text-black hover:bg-white-200 hover:text-black transition-colors duration-200 cursor-pointer px-4 py-2"
                  >
                    Sign Up
                  </Button>
                </Link>


              </>
            ) : (
              /* AUTHENTICATED VIEW - Profile, Help */
              <>
                {/* Account Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200 cursor-pointer"
                    >
                      <User className="h-5 w-5 text-black" />
                      <span className="sr-only">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    <Link href={route('client-dashboard')}>
                    <DropdownMenuItem className="cursor-pointer" >
                      Dashboard
                    </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer"
                    onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Help Icon */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200 cursor-pointer"
                    >
                      <HelpCircle className="h-5 w-5 text-black" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl w-full p-8">
                        <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-primary">
                        Customer Support
                        </DialogTitle>
                        </DialogHeader>

                    <div className="flex gap-12 mt-4">
                        <div className="rounded-lg bg-slate-50 p-4">
                        <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                        <p className="text-base text-slate-600 mb-1">
                            Email: support@luxeplus.com
                        </p>
                        <p className="text-base text-slate-600 mb-1">
                            Phone: +1 (800) 123-4567
                        </p>
                        <p className="text-base text-slate-600">
                            Hours: 24/7 Concierge Support
                        </p>
                        </div>

                        <div className="grid gap-4">
                        <h3 className="font-semibold text-lg">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="#" className="text-base text-orange-500 hover:underline">
                            Shipping Information
                            </Link>
                            <Link href="#" className="text-base text-orange-500 hover:underline">
                            Returns & Exchanges
                            </Link>
                            <Link href="#" className="text-base text-orange-500 hover:underline">
                            Order Tracking
                            </Link>
                            <Link href="#" className="text-base text-orange-500 hover:underline">
                            FAQ
                            </Link>
                        </div>
                        </div>
                    </div>
                    </DialogContent>

                </Dialog>
                {/* Shoping bag */}

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative text-black hidden md:flex rounded-full text-black hover:bg-orange-200 hover:text-black transition-colors duration-200  			cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5 text-black" />
                <span className="sr-only">Shopping Cart</span>
              </Button>

              </>
            )}

            {/* Mobile menu button - Always visible */}
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
