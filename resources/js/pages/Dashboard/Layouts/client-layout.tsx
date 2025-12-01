import React from "react"
import { usePage, Link, router } from "@inertiajs/react"
import { User, ShoppingBag, Heart, Home, Package, UserCog, LogOut, LayoutDashboard } from "lucide-react"
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
import type { PageProps } from "@/types"
 const handleLogout = () => {
  router.post(route('logout'));
};
const navigation = [
  { name: "Dashboard", href: "/client/dashboard", icon: Home },
  { name: "Orders", href: "/client/orders", icon: ShoppingBag },
  { name: "Wishlist", href: "/client/wishlist", icon: Heart },
  { name: "Profile", href: "/client/profile", icon: User },
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // ✅ Correct way: get page props from Inertia
  const { auth } = usePage<PageProps>().props
  const user = auth.user

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Customer Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <Input type="search" placeholder="Search products..." className="w-full" />
          </div>

          <div className="flex items-center gap-4">
          <Link href={route('home')}>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium">
                <Home className="h-4 w-4" />
                    Home
                </Button>
         </Link>
            <Button variant="ghost" size="icon">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </Button>

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
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
