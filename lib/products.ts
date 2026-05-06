import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Product {
  id?: string
  name: string
  price: number
  image: string
  createdBy: string
  createdAt: Timestamp
}

/**
 * Fetch all products from Firestore
 */
export async function fetchProducts(): Promise<Product[]> {
  const productsRef = collection(db, "products")
  const q = query(productsRef, orderBy("createdAt", "desc"))

  try {
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    // Fallback without ordering if index doesn't exist
    console.warn("Ordered query failed, using unordered:", error)
    const snapshot = await getDocs(productsRef)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  }
}

/**
 * Fetch products created by a specific user
 */
export async function fetchProductsByUser(uid: string): Promise<Product[]> {
  const productsRef = collection(db, "products")
  const q = query(productsRef, where("createdBy", "==", uid))

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}

/**
 * Add a new product to Firestore
 */
export async function addProduct(
  name: string,
  price: number,
  image: string,
  createdBy: string
): Promise<string> {
  const productsRef = collection(db, "products")
  const docRef = await addDoc(productsRef, {
    name,
    price,
    image,
    createdBy,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}
