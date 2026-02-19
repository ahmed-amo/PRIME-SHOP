import React, { useState } from "react"
import { usePage, Link, router } from "@inertiajs/react"
import {  ShoppingBag, Heart, Home, Package, UserCog, LogOut, LayoutDashboard, Search, Bell, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { PageProps } from "@/types"
import { getAvatarUrl } from "@/lib/avatar"
import DarkModeToggle from "@/components/darkmode"
import ShoppingCartSheet from "@/components/ShopingCart"
import AppProviders from '../../../layouts/Provider'

const handleLogout = () => {
  router.post(route('logout'))
}

const navigation = [
  { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "My Orders", href: "/client/my-orders", icon: Package },
  { name: "Wishlist", href: "/client/wishlist", icon: Heart },
  { name: "Profile", href: "/client/profile", icon: UserCog },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const page = usePage<PageProps>()
  const { auth } = page.props
  const url = page.url
  const user = auth.user
  const avatarUrl = getAvatarUrl(user?.picture)
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "U"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (

    <AppProviders>

        <div className="flex h-screen bg-white dark:bg-gray-950 relative overflow-hidden">
          {/* Decorative Orange Waves Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Wave 1 */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full blur-3xl"></div>
            {/* Wave 2 */}
            <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-amber-400/15 to-orange-500/10 rounded-full blur-3xl"></div>
            {/* Wave 3 */}
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-orange-500/20 to-orange-300/10 rounded-full blur-3xl"></div>
            {/* Wave 4 - Dark mode only */}
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-br from-orange-600/10 to-orange-400/5 rounded-full blur-2xl dark:opacity-100 opacity-0"></div>
          </div>

          {/* Modern Sidebar - Hidden on mobile */}
          <aside className="hidden lg:flex w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex-col shadow-xl z-10">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Prime Shop</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer Portal</p>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="px-6 py-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-b border-gray-200/50 dark:border-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{user.name} 👋</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = window.location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Card at Bottom */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-3 px-3 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl shadow-sm">
                <Avatar className="h-10 w-10 ring-2 ring-orange-500">
                  <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden z-10">
            {/* Professional Top Navbar */}
            <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-4 md:px-6 shadow-sm">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <ShoppingBag className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Prime Shop</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Customer Portal</p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-6 py-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 border-b">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{user.name} 👋</p>
                  </div>
                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                      const isActive = url === item.href || url.startsWith(item.href + "/")
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </nav>
                  <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex items-center gap-3 px-3 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl shadow-sm">
                      <Avatar className="h-10 w-10 ring-2 ring-orange-500">
                        <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products, orders..."
                    className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur border-gray-200/50 dark:border-gray-700/50 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Home Button */}
                <Link href={route('home')}>
                  <Button
                    variant="outline"
                    className="gap-2 border-orange-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>

                {/* Dark Mode Toggle */}
                <DarkModeToggle />

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-full backdrop-blur"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* Shopping Cart - ALWAYS ORANGE */}
                <div className="relative">
                  <ShoppingCartSheet
                    triggerClassName="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30"
                  />
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 rounded-full h-10 w-10 ring-2 ring-gray-200/50 dark:ring-gray-700/50 hover:ring-orange-500">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl ?? undefined} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl" align="end">
                    <DropdownMenuLabel className="pb-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/dashboard"
                        className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md"
                      >
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/my-orders"
                        className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md"
                      >
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium">My Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/wishlist"
                        className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md"
                      >
                        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                          <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span className="font-medium">Wishlist</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/client/profile"
                        className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md"
                      >
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                          <UserCog className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium">Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                    >
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Page Content with Professional Styling */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
        </AppProviders>
  )
}
