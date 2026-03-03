import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAE-duQxQDdGFHY0sw-64biThFahpwP7r8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'catalogoticketloko-3aa6d.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'catalogoticketloko-3aa6d',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'catalogoticketloko-3aa6d.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '157104813027',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:157104813027:web:e72baf8f62384398d4e6d6',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export async function ensureAnonymousAuth() {
  const user = auth.currentUser
  if (user) return
  await signInAnonymously(auth)
}

const ADMINS_COL = 'admins'

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export async function isAdmin(uid: string): Promise<boolean> {
  const ref = doc(db, ADMINS_COL, uid)
  const snap = await getDoc(ref)
  return snap.exists()
}
