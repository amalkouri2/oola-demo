"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createUserDocument, getUserRole, type UserData } from "@/lib/user"

interface AuthContextType {
  user: User | null
  role: "seller" | "buyer" | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const firebaseErrorMap: Record<string, string> = {
  "auth/email-already-in-use": "البريد الإلكتروني مستخدم بالفعل.",
  "auth/invalid-email": "البريد الإلكتروني غير صالح.",
  "auth/weak-password": "كلمة المرور ضعيفة جدا.",
  "auth/user-not-found": "المستخدم غير موجود.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/too-many-requests": "طلبات كثيرة - حاول لاحقا.",
  "auth/invalid-credential": "بيانات الاعتماد غير صالحة.",
}

function getFriendlyError(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code
    return firebaseErrorMap[code] || "حدث خطأ غير معروف"
  }
  return "حدث خطأ غير معروف"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<"seller" | "buyer" | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Fetch user role from Firestore
        const userRole = await getUserRole(firebaseUser.uid)
        setRole(userRole)
      } else {
        setRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (err) {
      setError(getFriendlyError(err))
      return false
    }
  }

  const signup = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      // Create user document in Firestore with seller role
      await createUserDocument(
        userCredential.user.uid,
        userCredential.user.email || email,
        "seller"
      )
      setRole("seller")
      return true
    } catch (err) {
      setError(getFriendlyError(err))
      return false
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await signOut(auth)
      setRole(null)
    } catch (err) {
      setError(getFriendlyError(err))
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
