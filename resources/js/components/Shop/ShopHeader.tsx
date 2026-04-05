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

export default function NavBarOne() {
  const { t, direction } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { auth } = usePage().props as any;
  const user = auth.user;
  const isGuest = !user;
  const isAdmin = user && user.role === "admin";
  const avatarUrl = user ? getAvatarUrl(user.picture ?? user.avatar) : null;
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "U";

  const handleLogout = () => {
    router.post(route("logout"));
  };

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
      className={`sticky top-0 z-50 w-full border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-[1920px] px-3 md:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4 md:h-20 lg:h-24">
          
          {/* 1. SEARCH BAR (Left/Center on Mobile) */}
          <div className="flex flex-1 items-center min-w-0 max-w-[200px] sm:max-w-xs md:max-w-md">
            <div className="w-full">
              <SearchAutocomplete />
            </div>
          </div>

          {/* 2. LOGO (Bigger and pushed towards right side on mobile) */}
          <Link 
            href="/" 
            className="flex shrink-0 items-center px-1 order-2 md:order-none mx-auto md:mx-0"
          >
            <img
              src="/primelogo.png"
              alt="Prime SH"
              className="h-10 w-auto object-contain transition-all sm:h-12 md:h-16 lg:h-20"
            />
          </Link>

          {/* 3. DESKTOP NAVIGATION */}
          {!isAdmin && (
            <nav className="hidden shrink-0 items-center gap-6 md:flex rtl:flex-row-reverse">
              <Link href="/products" className="font-semibold text-zinc-900 hover:text-orange-500 transition-colors">
                {t("Products")}
              </Link>
              <Link href="/categories" className="font-semibold text-zinc-900 hover:text-orange-500 transition-colors">
                {t("Categories")}
              </Link>
              <span
                onClick={goToSalesSection}
                className="relative cursor-pointer font-semibold text-zinc-900 hover:text-orange-500 transition-colors"
              >
                {t("Sales")}
                <span className="absolute -top-3 -right-6 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white font-bold">
                  {t("NEW")}
                </span>
              </span>
            </nav>
          )}

          {/* 4. ACTION BUTTONS (Far Right) */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 order-3">
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>

            {!isAdmin && (
              <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 rounded-full text-zinc-700 hover:bg-orange-100" asChild>
                <Link href={route("vendor.register")} title={t("Sell with us")}>
                  <div className="relative">
                    <Store className="h-5 w-5" />
                    <Upload className="absolute -bottom-1 -right-1 h-3 w-3 text-orange-600" strokeWidth={3} />
                  </div>
                </Link>
              </Button>
            )}

            <ShoppingCartSheet triggerClassName="h-9 w-9 sm:h-10 sm:w-10 shrink-0" />

            {isGuest ? (
              <Link href={route("login")}>
                <Button className="h-9 rounded-full bg-zinc-900 px-4 text-xs font-bold text-white hover:bg-zinc-800 sm:h-10 sm:text-sm">
                  {t("Login")}
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 shrink-0 rounded-full p-0 sm:h-10 sm:w-10">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                      <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-bold">{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin/dashboard" : "/client/dashboard"} className="flex w-full items-center gap-2">
                      <LayoutDashboard size={16} /> {t("Dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut size={16} className="mr-2" /> {t("Logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* MOBILE MENU BURGER */}
            {!isAdmin && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg border border-zinc-200 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={direction === "rtl" ? "right" : "left"} className="w-[280px] p-0">
                  <SheetHeader className="border-b p-5 text-left">
                    <SheetTitle>{t("Menu")}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 p-4">
                    <Link href="/products" className="flex items-center gap-3 p-3 font-semibold hover:bg-orange-50 rounded-xl">
                      <ShoppingBag size={20} /> {t("Products")}
                    </Link>
                    <Link href="/categories" className="flex items-center gap-3 p-3 font-semibold hover:bg-orange-50 rounded-xl">
                      <LayoutGrid size={20} /> {t("Categories")}
                    </Link>
                    <Link href={route("vendor.register")} className="flex items-center gap-3 p-3 font-semibold bg-orange-500 text-white rounded-xl">
                      <Store size={20} /> {t("Become a seller")}
                    </Link>
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