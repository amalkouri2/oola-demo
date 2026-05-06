"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { AddProductForm } from "@/components/add-product-form"
import { SellerProducts } from "@/components/seller-products"

export default function SellerDashboard() {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/")
      } else if (role !== null && role !== "seller") {
        router.push("/home")
      }
    }
  }, [user, role, loading, router])

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
      </div>
    )
  }

  if (!user || role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">غير مصرح</h2>
          <p className="text-[rgb(var(--muted-foreground))]">
            هذه الصفحة متاحة للبائعين فقط
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">لوحة البائع</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <AddProductForm userId={user.uid} onSuccess={handleProductAdded} />
          </div>

          {/* Seller Products */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">منتجاتك</h3>
              <SellerProducts userId={user.uid} refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
