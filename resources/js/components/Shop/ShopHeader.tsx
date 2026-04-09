"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Heart,
  Package,
  UserCog,
  Store,
  Upload,
  Menu,
  LayoutGrid,
  Tag,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/avatar";
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
import { Link, router, usePage } from "@inertiajs/react";
import ShoppingCartSheet from "@/components/ShopingCart";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/language-switcher";
import SearchAutocomplete from "@/components/Shop/SearchAutocomplete";

// ── Main NavBar ──────────────────────────────────────────────
export default function NavBarOne() {
  const { t, direction } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { auth } = usePage().props as any;
  const user = auth.user;
  const isGuest = !user;
  const isAdmin = user?.role === "admin";
  const isVendor = user?.role === "vendor_admin" || user?.role === "vendor_staff";
  const isClient = !isAdmin && !isVendor;
  const avatarUrl = user ? getAvatarUrl(user.picture ?? user.avatar) : null;
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "U";

  const handleLogout = () => {
    router.post(route("logout"));
  };

  /** Instant jump to home sales block; from other routes navigates home first. */
  const goToSalesSection = () => {
    const scroll = () => {
      const el = document.getElementById("sales-section");
      if (!el) return;
      const offset = 96;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    };

    const path = window.location.pathname.replace(/\/$/, "") || "/";
    if (path === "/") {
      scroll();
      return;
    }

    router.get("/", {}, {
      preserveScroll: false,
      onFinish: () => {
        requestAnimationFrame(() => requestAnimationFrame(scroll));
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-200 pt-[env(safe-area-inset-top)] transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-[1920px]">

        {/* ── Top bar ── */}
        <div className="flex min-h-[4rem] items-center justify-between gap-3 px-3 sm:min-h-[4.5rem] md:min-h-[5.5rem] md:justify-center md:gap-6 md:px-4 lg:gap-8 rtl:flex-row-reverse">

          {/* Mobile hamburger — far left, hidden on md+ */}
          {!isAdmin && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 shrink-0 touch-manipulation rounded-xl border border-orange-200/90 bg-gradient-to-b from-orange-50 to-amber-50 text-zinc-800 shadow-sm transition hover:border-orange-300 hover:from-orange-100 hover:to-amber-100 hover:shadow md:hidden"
                  aria-label={t("Menu")}
                >
                  <Menu className="h-6 w-6" strokeWidth={2.25} aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={direction === "rtl" ? "right" : "left"}
                overlayClassName="bg-zinc-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                className="flex !w-[min(26rem,calc(100vw-0.75rem))] !max-w-none flex-col gap-0 border-zinc-200/80 bg-gradient-to-b from-amber-50/95 via-white to-orange-50/40 p-0 text-zinc-900 shadow-2xl sm:!max-w-md"
              >
                <SheetHeader className="border-b border-orange-100/90 bg-white/90 px-5 py-6 backdrop-blur-md">
                  <SheetTitle className="text-2xl font-bold tracking-tight text-zinc-900">{t("Menu")}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-5 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
                  <nav className="flex flex-col gap-3">
                    <Link
                      href="/products"
                      className="flex min-h-[3.5rem] items-center gap-4 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-lg font-semibold text-zinc-800 shadow-sm transition active:scale-[0.99] rtl:flex-row-reverse hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <ShoppingBag className="h-6 w-6" aria-hidden />
                      </span>
                      {t("Products")}
                    </Link>
                    <Link
                      href="/categories"
                      className="flex min-h-[3.5rem] items-center gap-4 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-lg font-semibold text-zinc-800 shadow-sm transition active:scale-[0.99] rtl:flex-row-reverse hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <LayoutGrid className="h-6 w-6" aria-hidden />
                      </span>
                      {t("Categories")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        goToSalesSection();
                      }}
                      className="flex min-h-[3.5rem] w-full items-center gap-4 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-start text-lg font-semibold text-zinc-800 shadow-sm transition active:scale-[0.99] rtl:flex-row-reverse hover:border-red-200 hover:bg-red-50/40 hover:text-red-800"
                    >
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <Tag className="h-6 w-6" aria-hidden />
                        <span className="absolute -end-0.5 -top-0.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                          {t("NEW")}
                        </span>
                      </span>
                      {t("Sales")}
                    </button>
                    <Link
                      href={route("vendor.register")}
                      className="flex min-h-[3.5rem] items-center gap-4 rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-lg font-semibold text-white shadow-md transition active:scale-[0.99] rtl:flex-row-reverse hover:from-orange-600 hover:to-amber-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
                        <Store className="h-6 w-6" aria-hidden />
                        <Upload
                          className="absolute bottom-1 end-1 h-3.5 w-3.5 text-white"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      </span>
                      {t("Become a seller")}
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center py-0.5">
            <img
              src="/primelogo.png"
              alt="Prime SH"
              className="h-16 w-auto object-contain sm:h-[4.5rem] md:h-[5rem] lg:h-[5.5rem]"
            />
          </Link>

          {/* Desktop search */}
          <div className="hidden w-full max-w-md shrink-0 md:flex md:w-56 lg:w-64 xl:w-72">
            <SearchAutocomplete />
          </div>

          {/* Main Navigation (desktop, client only) */}
          {isClient && (
            <nav className="hidden shrink-0 items-center gap-5 md:flex lg:gap-6 rtl:flex-row-reverse">
              <Link href="/products" className="font-medium text-black hover:text-orange-500">
                {t("Products")}
              </Link>
              <Link href="/categories" className="font-medium text-black hover:text-orange-500">
                {t("Categories")}
              </Link>
              <span
                onClick={goToSalesSection}
                className="relative cursor-pointer font-medium text-black hover:text-orange-500"
              >
                {t("Sales")}
                <span className="absolute top-6 -end-7 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white whitespace-nowrap">
                  {t("NEW")}
                </span>
              </span>
            </nav>
          )}

          <div className="flex shrink-0 items-center gap-2 md:gap-3 rtl:flex-row-reverse">
            <div className="hidden shrink-0 md:flex md:items-center">
              <LanguageSwitcher />
            </div>

            {isClient && (
              <Button variant="ghost" size="icon" className="hidden h-9 w-9 shrink-0 rounded-full text-black hover:bg-orange-200 sm:h-10 sm:w-10 md:flex" asChild>
                <Link
                  href={isVendor ? route("vendor.products") : route("vendor.register")}
                  aria-label={isVendor ? t("SELL PRODUCTS") : t("Sell with us")}
                  title={isVendor ? t("SELL PRODUCTS") : t("Sell with us")}
                >
                  <span className="relative flex h-9 w-9 items-center justify-center">
                    {isVendor ? (
                      <LayoutDashboard className="h-5 w-5" aria-hidden />
                    ) : (
                      <>
                        <Store className="h-5 w-5" aria-hidden />
                        <Upload
                          className="absolute bottom-0 end-0 h-3 w-3 text-orange-500"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                      </>
                    )}
                  </span>
                </Link>
              </Button>
            )}

            {/* Guest */}
            {isGuest && (
              <>
                <ShoppingCartSheet triggerClassName="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
                <Link href={route("login")}>
                  <Button className="h-9 rounded-full px-3 text-sm text-black hover:bg-orange-300 sm:h-10 sm:px-4 sm:text-base">
                    {t("Login")}
                  </Button>
                </Link>
              </>
            )}

            {/* Logged In */}
            {!isGuest && (
              <>
                {/* ADMIN */}
                {isAdmin && (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href={route("admin.dashboard")}>
                      <Button className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-white hover:bg-orange-600 rtl:flex-row-reverse">
                        <LayoutDashboard className="h-5 w-5" />
                        {t("Dashboard")}
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-white hover:bg-orange-600 rtl:flex-row-reverse"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("Logout")}
                    </Button>
                  </div>
                )}

                {/* CLIENT */}
                {!isAdmin && (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hidden md:flex rounded-full text-black hover:bg-orange-200">
                          <HelpCircle className="h-5 w-5 text-black" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-full p-8">
                        <DialogHeader>
                          <DialogTitle className="text-3xl font-bold">{t("Customer Support")}</DialogTitle>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <ShoppingCartSheet triggerClassName="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 shrink-0 rounded-full p-0 sm:h-10 sm:w-10">
                          <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                            <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel className="font-bold">{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                      {isVendor ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/vendor/dashboard" className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <LayoutDashboard size={18} /> {t("Vendor Dashboard")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route("vendor.products")} className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <Package size={18} /> {t("Products")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route("vendor.orders")} className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <Package size={18} /> {t("Orders")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route("vendor.sales")} className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <Tag size={18} /> {t("Sales")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={route("vendor.settings")} className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <UserCog size={18} /> {t("Settings")}
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/client/dashboard" className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <LayoutDashboard size={18} /> {t("Dashboard")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/client/my-orders" className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <Package size={18} /> {t("My Orders")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/client/wishlist" className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <Heart size={18} /> {t("Wishlist")}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/client/profile" className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                              <UserCog size={18} /> {t("Profile")}
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex cursor-pointer items-center gap-2 rtl:flex-row-reverse">
                          <LogOut size={18} /> {t("Logout")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Mobile search bar — visible only below md ── */}
        <div className="border-t border-gray-100 px-3 py-2 md:hidden">
          <SearchAutocomplete />
        </div>

      </div>
    </header>
  );
}