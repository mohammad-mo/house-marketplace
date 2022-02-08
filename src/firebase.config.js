import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtOQT-7vsgROjykZuUtCuIQctGuAbjG5c",
  authDomain: "car-marketplace-app-2b0c3.firebaseapp.com",
  projectId: "car-marketplace-app-2b0c3",
  storageBucket: "car-marketplace-app-2b0c3.appspot.com",
  messagingSenderId: "830824625618",
  appId: "1:830824625618:web:45d759a8848b6b45e5840b"
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()