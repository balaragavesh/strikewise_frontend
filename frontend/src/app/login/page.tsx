"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase"; // Using relative path
import { useRouter } from "next/navigation";
import React from "react";

// Define a type for Firebase errors to make error handling safer
interface FirebaseError extends Error {
  code: string;
}

export default function LoginPage() {
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleGoogleLogin = async () => {
    if (!backendUrl) {
      console.error("Backend URL (NEXT_PUBLIC_BACKEND_URL) is not defined in environment variables.");
      alert("Application configuration error. Please contact support.");
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${backendUrl}/api/strikewise/auth/login/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-ID-Token': idToken,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);
        router.push('/strikewiseSelector');
      } else {
        console.error('Backend Login Error:', data.detail || 'Login failed');
        alert('Login failed. Please try again.');
      }
    } catch (error: unknown) { // FIX 1: Use 'unknown' for type safety
      console.error("Firebase Google Login Error:", error);
      
      // FIX 2: Safely check the error's properties before using them
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          alert('Google Sign-In popup was closed. Please try again.');
        } else if (firebaseError.code === 'auth/cancelled-popup-request') {
          alert('Multiple login popups detected. Please try again.');
        } else {
          alert(`Failed to sign in with Google: ${firebaseError.message || 'Unknown error'}`);
        }
      } else {
        alert(`An unknown error occurred during login.`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Login to Strikewise</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}