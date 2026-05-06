"use client"

import { useState } from "react"
import { addProduct } from "@/lib/products"

interface AddProductFormProps {
  userId: string
  onSuccess: () => void
}

export function AddProductForm({ userId, onSuccess }: AddProductFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!name.trim()) {
      setError("يرجى إدخال اسم المنتج")
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("يرجى إدخال سعر صالح")
      return
    }

    if (!image.trim()) {
      setError("يرجى إدخال رابط الصورة")
      return
    }

    setIsSubmitting(true)

    try {
      await addProduct(name.trim(), priceNum, image.trim(), userId)
      setSuccess(true)
      setName("")
      setPrice("")
      setImage("")
      onSuccess()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to add product:", err)
      setError("فشل إضافة المنتج. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-lg font-semibold mb-4">إضافة منتج جديد</h3>

      <div>
        <label
          htmlFor="productName"
          className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
        >
          اسم المنتج
        </label>
        <input
          id="productName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: كريم مرطب للبشرة"
          className="input-field"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="productPrice"
          className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
        >
          السعر (ر.س)
        </label>
        <input
          id="productPrice"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="مثال: 99"
          className="input-field"
          dir="ltr"
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="productImage"
          className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
        >
          رابط الصورة
        </label>
        <input
          id="productImage"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="input-field"
          dir="ltr"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-400 text-sm" role="status">
          تم إضافة المنتج بنجاح!
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? "جاري الإضافة..." : "إضافة المنتج"}
      </button>
    </form>
  )
}
