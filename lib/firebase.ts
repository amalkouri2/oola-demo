import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAoyAArE5JSZvB2h35EjvPojBQyGBL7x8o",
  authDomain: "oola-house.firebaseapp.com",
  projectId: "oola-house",
  storageBucket: "oola-house.appspot.com",
  messagingSenderId: "152191370232",
  appId: "1:152191370232:web:f5fb5fbf1b4bb1f0ca8c0d",
}

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
