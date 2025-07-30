// frontend/src/app/login/page.tsx
"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase"; // Import Firebase auth and provider
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const router = useRouter();
  // Get backend URL from environment variable for API calls
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleGoogleLogin = async () => {
    if (!backendUrl) {
      console.error("Backend URL (NEXT_PUBLIC_BACKEND_URL) is not defined in environment variables.");
      alert("Application configuration error. Please contact support.");
      return;
    }

    try {
      // 1. Initiate Google Sign-In using Firebase client SDK
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Get the Firebase ID Token from the authenticated user
      const idToken = await result.user.getIdToken();

      // 3. Send the Firebase ID Token to your FastAPI backend for verification
      const response = await fetch(`${backendUrl}/api/strikewise/auth/login/firebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-ID-Token': idToken, // Send token in custom header as configured in backend
        },
        body: JSON.stringify({}), // Empty body as token is in header
      });

      const data = await response.json();

      if (response.ok) {
        // 4. Store your backend's custom JWT (session token) received from FastAPI
        localStorage.setItem('accessToken', data.access_token);
        // Optionally store basic user info from your backend's response
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);

        // 5. Redirect the user to the main application page
        router.push('/strikewiseSelector');
      } else {
        console.error('Backend Login Error:', data.detail || 'Login failed');
        alert('Login failed. Please try again.');
      }
    } catch (error: any) { // Type 'error' as 'any' to access 'code' property
      console.error("Firebase Google Login Error:", error);
      // Handle common Firebase authentication errors
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Google Sign-In popup was closed. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        alert('Multiple login popups detected. Please try again.');
      } else {
        alert(`Failed to sign in with Google: ${error.message || 'Unknown error'}`);
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