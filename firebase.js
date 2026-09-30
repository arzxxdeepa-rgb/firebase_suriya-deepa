import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjPd9g6yjud-M9Cb2QPfw_TljewV-wMP4",
  authDomain: "student-management-283e9.firebaseapp.com",
  projectId: "student-management-283e9",
  storageBucket: "student-management-283e9.firebasestorage.app",
  messagingSenderId: "1005756414594",
  appId: "1:1005756414594:web:1f56f650a97fbb9ba0929b",
  measurementId: "G-L3SQ6EW6W9"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function registerStudent(data) {
  const { email, password, firstName, lastName, phone = "", department = "", year = "", gender = "" } = data;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  const profile = {
    uid,
    firstName,
    lastName,
    email,
    phone,
    department,
    year,
    gender,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, "students", uid), profile, { merge: true });
  return userCredential;
}

export async function loginStudent(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function logoutStudent() {
  return signOut(auth);
}

export function monitorAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function saveStudentProfile(uid, data) {
  await setDoc(doc(db, "students", uid), { ...data, uid }, { merge: true });
}

export async function getStudentProfile(uid) {
  const snapshot = await getDoc(doc(db, "students", uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveRegistration(data) {
  return addDoc(collection(db, "registrations"), {
    ...data,
    createdAt: serverTimestamp()
  });
}
