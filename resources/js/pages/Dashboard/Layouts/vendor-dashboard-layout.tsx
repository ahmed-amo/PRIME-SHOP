import React from "react"
import { Banknote, LayoutDashboard, Package, Plus, Settings, ShoppingCart } from "lucide-react"
import DashboardLayout from "./dashboard-layout"
import { useI18n } from "@/lib/i18n"

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n()

  const navigation = [
    { name: t("Dashboard"), href: route("vendor.dashboard"), icon: LayoutDashboard },
    { name: t("Add Product"), href: route("vendor.products.create"), icon: Plus },
    { name: t("Manage Products"), href: route("vendor.products"), icon: Package },
    { name: t("Orders Received"), href: route("vendor.orders"), icon: ShoppingCart },
    { name: t("Sales / Revenue"), href: route("vendor.sales"), icon: Banknote },
    { name: t("Shop Settings"), href: route("vendor.settings"), icon: Settings },
  ]

  return (
    <DashboardLayout navigation={navigation} portalLabel={t("Seller Portal")}>
      {children}
    </DashboardLayout>
  )
}

