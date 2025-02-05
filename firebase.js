// Import Firebase functions
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// import { getFirestore, collection, addDoc } from 'firebase/firestore'

import { getAnalytics, isSupported } from 'firebase/analytics'
import { addDoc, collection, getFirestore } from 'firebase/firestore'

// Firebase configuration (use environment variables in production)
const firebaseConfig = {
  apiKey: 'AIzaSyCtI_4eS9oG2Q6hbZcxH-UA0omhRnVAZeI',
  authDomain: 'resoluteai-e7666.firebaseapp.com',
  projectId: 'resoluteai-e7666',
  storageBucket: 'resoluteai-e7666.appspot.com',
  messagingSenderId: '712278603791',
  appId: '1:712278603791:web:16b5caf1762b1e61e74b7a',
  measurementId: 'G-6C06H6Y8RQ'
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Firebase Auth
const auth = getAuth(app)

// Initialize Analytics (only if supported, avoids errors in non-browser environments)
let analytics

isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app)
  }
})

// Function to add data to Firestore
const addDataToFirestore = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName)
    const docRef = await addDoc(colRef, data)

    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export { app, db, auth, analytics, addDataToFirestore }
