"use client";
import { useEffect, useState } from "react";
import { auth, signInWithGoogle } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      if (loggedInUser) {
        router.push("/home"); // ログイン済みなら /home へ移動
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Game Matching Service</h1>
      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Login with Google
      </button>
    </div>
  );
}