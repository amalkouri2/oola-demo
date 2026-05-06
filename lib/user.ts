import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface UserData {
  uid: string
  email: string
  role: "seller" | "buyer"
  createdAt: Date
}

/**
 * Create a new user document in Firestore
 */
export async function createUserDocument(
  uid: string,
  email: string,
  role: "seller" | "buyer" = "seller"
): Promise<void> {
  const userRef = doc(db, "users", uid)
  await setDoc(userRef, {
    uid,
    email,
    role,
    createdAt: new Date(),
  })
}

/**
 * Get user role from Firestore
 */
export async function getUserRole(uid: string): Promise<"seller" | "buyer" | null> {
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const data = userSnap.data()
    return data.role as "seller" | "buyer"
  }

  return null
}

/**
 * Get full user data from Firestore
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as UserData
  }

  return null
}
