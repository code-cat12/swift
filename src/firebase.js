import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB9VKUSUBatANEEXSs4jV7sBtBVWow8g_E",
  authDomain: "swift-23cd0.firebaseapp.com",
  projectId: "swift-23cd0",
  storageBucket: "swift-23cd0.firebasestorage.app",
  messagingSenderId: "626284159666",
  appId: "1:626284159666:web:5a71c1767176e3a4805fab",
  measurementId: "G-LZ749B0P0F"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
