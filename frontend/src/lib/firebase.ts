// frontend/src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration.
// These values are accessed via Next.js public environment variables.
const firebaseConfig = {
  apiKey: "AIzaSyAPTKPQleO1TN5EliTU0K8J8D1_XAHL_Xg",
  authDomain: "strikewise-aee67.firebaseapp.com",
  projectId: "strikewise-aee67",
  storageBucket: "strikewise-aee67.firebasestorage.app",
  messagingSenderId: "757635330449",
  appId: "1:757635330449:web:6bafa01d4bf89e0adeaa30",
  measurementId: "G-HDN53YZ3KM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the authentication service
const googleProvider = new GoogleAuthProvider(); // Create a new Google Auth Provider

export { auth, googleProvider };