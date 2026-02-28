import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Sign Up ──────────────────────────────────────────────────
export async function signUp(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    coins: 0,
    role: "user",
    banned: false,
    createdAt: serverTimestamp()
  });
  return cred.user;
}

// ── Sign In ──────────────────────────────────────────────────
export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (snap.exists() && snap.data().banned) {
    await signOut(auth);
    throw new Error("Your account has been banned. Contact support.");
  }
  return cred.user;
}

// ── Sign Out ─────────────────────────────────────────────────
export async function logOut() {
  await signOut(auth);
}

// ── Auth Guard — redirects to login if not signed in ─────────
export function requireAuth(redirectUrl = "/index.html") {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) {
        window.location.href = redirectUrl;
        return resolve(null);
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().banned) {
        await signOut(auth);
        window.location.href = redirectUrl + "?banned=1";
        return resolve(null);
      }
      resolve({ user, data: snap.data() });
    });
  });
}

// ── Admin Guard — redirects to dashboard if not admin ────────
export function requireAdmin(redirectUrl = "/dashboard.html") {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) {
        window.location.href = "/index.html";
        return resolve(null);
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data();
      if (!data || data.role !== "admin") {
        window.location.href = redirectUrl;
        return resolve(null);
      }
      resolve({ user, data });
    });
  });
}
