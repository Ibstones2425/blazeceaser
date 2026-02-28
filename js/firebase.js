import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWdYxLs5UJ8HjWSQjdxiLrUxLwTkDsb8M",
  authDomain: "blazeceaser-70a05.firebaseapp.com",
  projectId: "blazeceaser-70a05",
  storageBucket: "blazeceaser-70a05.firebasestorage.app",
  messagingSenderId: "864113913390",
  appId: "1:864113913390:web:a815abb99763bbb80579bf",
  measurementId: "G-0STMV1P5CB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
