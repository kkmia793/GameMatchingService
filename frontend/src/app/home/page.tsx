"use client";
import { useState, useEffect } from "react";
import { auth, logOut } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      if (!loggedInUser) {
        router.push("/"); // 未ログインならログインページへリダイレクト
      } else {
        setUser(loggedInUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">募集一覧ページ</h1>

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logOut} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <p>認証中...</p>
      )}
    </div>
  );
}