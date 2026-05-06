"use client"

import { useEffect, useState } from "react"
import { fetchProductsByUser, type Product } from "@/lib/products"
import { ProductCard } from "./product-card"

interface SellerProductsProps {
  userId: string
  refreshKey: number
}

export function SellerProducts({ userId, refreshKey }: SellerProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const data = await fetchProductsByUser(userId)
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch seller products:", err)
        setError("فشل تحميل منتجاتك")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [userId, refreshKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gold border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-400 text-center py-8">{error}</p>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[rgb(var(--muted-foreground))]">
          لم تضف أي منتجات بعد
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
