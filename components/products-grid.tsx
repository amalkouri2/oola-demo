"use client"

import { useEffect, useState } from "react"
import { fetchProducts, type Product } from "@/lib/products"
import { ProductCard } from "./product-card"

export function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError("فشل تحميل المنتجات. يرجى المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mx-auto mb-4" />
          <p className="text-[rgb(var(--muted-foreground))]">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-[rgb(var(--muted-foreground))]"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
          <p className="text-[rgb(var(--muted-foreground))]">
            لم يتم إضافة أي منتجات بعد
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
