"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    router.push("/dashboard");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false // Important for better error handling
    });
  
    if (result?.error) {
      alert("Login failed: " + result.error);
      console.error("Login Error:", result.error); // Helps in debugging
    } else {
      router.push("/dashboard");
    }
  };



  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button
          onClick={() => signIn("google")}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
        >
          Sign in with Google
        </button>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />
          <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md">
            Sign in with Email
          </button>
        </form>
      </div>
    </div>
  );
}