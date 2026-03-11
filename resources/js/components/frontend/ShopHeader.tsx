"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Heart,
  Package,
  UserCog,
  Tag,
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

// ── Types ────────────────────────────────────────────────────
interface Suggestion {
  id: number;
  name: string;
  slug: string;
  type: "product" | "category";
  price?: number;
  image_url?: string | null;
}

// ── Search Bar Component ─────────────────────────────────────
function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced fetch suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const all: Suggestion[] = [
          ...(data.categories || []),
          ...(data.products || []),
        ];
        setSuggestions(all);
        setIsOpen(all.length > 0);
        setHighlighted(-1);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250); // 250ms debounce — fast but not spammy
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    router.get(route("search"), { q: query });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && suggestions[highlighted]) {
        goTo(suggestions[highlighted]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlighted(-1);
    }
  };

  const goTo = (suggestion: Suggestion) => {
    setIsOpen(false);
    setQuery(suggestion.name);
    if (suggestion.type === "category") {
      router.get(`/categories/${suggestion.slug}`);
    } else {
      router.get(`/product/${suggestion.slug}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${mobile ? "w-full" : "flex-1 max-w-md"}`}>
      {/* Input Row */}
      <div className="relative flex w-full items-center">
        {mobile && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        )}
        <Input
          type="search"
          placeholder="Search products, brands and categories"
          className={`h-10 w-full text-black ${mobile ? "pl-9 rounded-lg" : "rounded-r-none border-r-0"}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          autoComplete="off"
        />
        {!mobile && (
          <Button
            onClick={handleSearch}
            className="h-10 rounded-l-none bg-orange-500 hover:bg-orange-600 flex-shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[200] overflow-hidden">

          {/* Categories section */}
          {suggestions.filter(s => s.type === "category").length > 0 && (
            <>
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</span>
              </div>
              {suggestions
                .filter(s => s.type === "category")
                .map((s, i) => (
                  <button
                    key={`cat-${s.id}`}
                    onMouseDown={() => goTo(s)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      highlighted === i ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0 flex items-center justify-center">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <Tag className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                      <p className="text-xs text-gray-400">Category</p>
                    </div>
                  </button>
                ))}
            </>
          )}

          {/* Products section */}
          {suggestions.filter(s => s.type === "product").length > 0 && (
            <>
              <div className="px-3 pt-2 pb-1 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</span>
              </div>
              {suggestions
                .filter(s => s.type === "product")
                .map((s, i) => {
                  const globalIndex = suggestions.filter(x => x.type === "category").length + i;
                  return (
                    <button
                      key={`prod-${s.id}`}
                      onMouseDown={() => goTo(s)}
                      onMouseEnter={() => setHighlighted(globalIndex)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        highlighted === globalIndex ? "bg-orange-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {s.image_url ? (
                          <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-gray-400 m-auto mt-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                        {s.price !== undefined && (
                          <p className="text-xs text-orange-500 font-medium">${s.price.toFixed(2)}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
            </>
          )}

          {/* See all results footer */}
          <div className="border-t border-gray-100">
            <button
              onMouseDown={handleSearch}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main NavBar ──────────────────────────────────────────────
export default function NavBarOne() {
  const [isScrolled, setIsScrolled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { auth } = usePage().props as any;
  const user = auth.user;
  const isGuest = !user;
  const isAdmin = user && user.role === "admin";
  const avatarUrl = user ? getAvatarUrl(user.picture) : null;
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "U";

  const handleLogout = () => {
    router.post(route("logout"));
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
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between px-4 md:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/primelogo.png" alt="Prime SH" className="h-30 w-auto" />
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Main Navigation (client only) */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center gap-6 mr-8">
              <Link href="/collections" className="text-black hover:text-orange-500 font-medium">
                Collections
              </Link>
              <Link href="/categories" className="text-black hover:text-orange-500 font-medium">
                Categories
              </Link>
              <span
                onClick={() => {
                  const el = document.getElementById("sales");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="relative cursor-pointer text-black hover:text-orange-500 font-medium"
              >
                Sales
                <span className="absolute top-6 -right-7 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  NEW
                </span>
              </span>
            </nav>
          )}

          <div className="flex items-center gap-4">

            {/* Guest */}
            {isGuest && (
              <>
                <ShoppingCartSheet />
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
                {/* ADMIN */}
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
                          <DialogTitle className="text-3xl font-bold">Customer Support</DialogTitle>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <ShoppingCartSheet />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 rounded-full h-10 w-10">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel className="font-bold">{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/client/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard size={18} /> Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/client/my-orders" className="flex items-center gap-2 cursor-pointer">
                            <Package size={18} /> My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/client/wishlist" className="flex items-center gap-2 cursor-pointer">
                            <Heart size={18} /> Wishlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/client/profile" className="flex items-center gap-2 cursor-pointer">
                            <UserCog size={18} /> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                          <LogOut size={18} /> Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu */}
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
                    {/* Mobile search with autocomplete */}
                    <SearchBar mobile />
                    <nav className="grid gap-2">
                      <Link href="/collections" className="py-2 text-base text-black">Collections</Link>
                      <Link href="/categories" className="py-2 text-base text-black">Categories</Link>
                      <button
                        onClick={() => document.getElementById("sales-section")?.scrollIntoView({ behavior: "smooth" })}
                        className="py-2 text-base text-black text-left"
                      >
                        Sales
                      </button>
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
