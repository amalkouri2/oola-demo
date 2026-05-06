"use client"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface SellerRegistrationFormProps {
  isOpen: boolean
  onClose: () => void
}

export function SellerRegistrationForm({ isOpen, onClose }: SellerRegistrationFormProps) {
  const [fullName, setFullName] = useState("")
  const [brandName, setBrandName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim() || !brandName.trim() || !whatsapp.trim()) {
      setError("جميع الحقول مطلوبة")
      return
    }

    // Validate WhatsApp number
    const phoneRegex = /^[0-9+\s-]{10,15}$/
    if (!phoneRegex.test(whatsapp.replace(/\s/g, ""))) {
      setError("رقم الواتساب غير صحيح")
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "sellers"), {
        fullName: fullName.trim(),
        brandName: brandName.trim(),
        whatsapp: whatsapp.trim(),
        createdAt: serverTimestamp(),
        status: "pending"
      })

      setSuccess(true)
      setFullName("")
      setBrandName("")
      setWhatsapp("")

      // Auto close after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 3000)
    } catch (err) {
      console.error("Failed to submit seller registration:", err)
      setError("حدث خطأ أثناء التسجيل. حاول مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFullName("")
      setBrandName("")
      setWhatsapp("")
      setError(null)
      setSuccess(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 card animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 left-4 text-[rgb(var(--muted-foreground))] hover:text-white transition-colors disabled:opacity-50"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gold">انضم كبائع</h2>
          <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2">
            سجل معلوماتك للانضمام كبائع في منصة أولى
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--success))]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--success))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[rgb(var(--success))]">تم التسجيل بنجاح!</h3>
            <p className="text-sm text-[rgb(var(--muted-foreground))] mt-2">
              سيتم التواصل معك قريباً
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
              >
                الاسم الكامل
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="brandName"
                className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
              >
                اسم العلامة التجارية
              </label>
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="أدخل اسم علامتك التجارية"
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
              >
                رقم الواتساب
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+966 5XX XXX XXXX"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-[rgb(var(--primary-foreground))] border-t-transparent" />
                  جاري التسجيل...
                </span>
              ) : (
                "تسجيل كبائع"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
