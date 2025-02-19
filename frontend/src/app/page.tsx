"use client";
import { useState } from "react";
import { signInWithGoogle, logOut } from "@/lib/firebase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = async () => {
    const loggedInUser = await signInWithGoogle();
    setUser(loggedInUser);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">GameMatchingService</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logOut} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Login with Google
        </button>
      )}
    </div>
  );
}