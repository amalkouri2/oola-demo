"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { SellerRegistrationForm } from "@/components/seller-registration-form"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, error, login, signup, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showSellerForm, setShowSellerForm] = useState(false)

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/home")
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setSuccessMessage(null)

    if (!email || password.length < 6) {
      return
    }

    setIsSubmitting(true)
    const success = await login(email, password)
    setIsSubmitting(false)

    if (success) {
      setSuccessMessage("تم تسجيل الدخول بنجاح!")
      router.push("/home")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setSuccessMessage(null)

    if (!email || password.length < 6) {
      return
    }

    setIsSubmitting(true)
    const success = await signup(email, password)
    setIsSubmitting(false)

    if (success) {
      setSuccessMessage("تم إنشاء الحساب بنجاح!")
      router.push("/home")
    }
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
      </div>
    )
  }

  // If user is logged in, show nothing (will redirect)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <header className="bg-black text-gold py-4 text-center">
        <h1 className="text-2xl font-bold">Oola Platform</h1>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <h2 className="text-xl font-semibold mb-6">تسجيل الدخول</h2>

        <div className="card">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="input-field"
                dir="ltr"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[rgb(var(--muted-foreground))] mb-2"
              >
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور (6 أحرف على الأقل)"
                className="input-field"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm" role="alert">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="text-green-400 text-sm" role="status">
                {successMessage}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSignup}
                disabled={isSubmitting || !email || password.length < 6}
                className="btn-secondary flex-1"
              >
                {isSubmitting ? "جاري..." : "إنشاء حساب"}
              </button>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isSubmitting || !email || password.length < 6}
                className="btn-primary flex-1"
              >
                {isSubmitting ? "جاري..." : "تسجيل دخول"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-[rgb(var(--muted-foreground))] mt-6">
          عند إنشاء حساب جديد، ستحصل على دور بائع تلقائيا
        </p>

        {/* Join as Seller Section */}
        <div className="mt-8 pt-8 border-t border-[rgb(var(--border))]">
          <div className="text-center">
            <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">
              هل لديك منتجات للبيع؟
            </p>
            <button
              onClick={() => setShowSellerForm(true)}
              className="btn-primary w-full"
            >
              انضم كبائع
            </button>
          </div>
        </div>
      </main>

      {/* Seller Registration Modal */}
      <SellerRegistrationForm
        isOpen={showSellerForm}
        onClose={() => setShowSellerForm(false)}
      />
    </div>
  )
}
