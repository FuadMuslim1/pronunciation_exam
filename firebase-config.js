// ================================
// Firebase Configuration (GLOBAL)
// ================================

const firebaseConfig = {
  apiKey: "AIzaSyBwShyAwMUoenFw5MUebCX_nxGd9Z926BQ",
  authDomain: "the-examination.firebaseapp.com",
  projectId: "the-examination",
  storageBucket: "the-examination.firebasestorage.app",
  messagingSenderId: "614990640750",
  appId: "1:614990640750:web:e5420a4beb25e9447d987f",
  measurementId: "G-H6YH9SXD59"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore Database
const db = firebase.firestore();
