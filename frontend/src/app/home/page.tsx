"use client";
import { useState, useEffect } from "react";
import { auth, logOut, getGamePosts } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [gamePosts, setGamePosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 認証状態をチェック
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      if (!loggedInUser) {
        router.push("/"); // 未ログインならログインページへリダイレクト
      } else {
        setUser(loggedInUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Firestoreから募集一覧を取得
    const fetchGamePosts = async () => {
      const posts = await getGamePosts();
      setGamePosts(posts);
    };
    fetchGamePosts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">募集一覧</h1>

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logOut} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>

          {/* 募集一覧表示 */}
          <div className="mt-6 w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">現在の募集</h2>
            {gamePosts.length > 0 ? (
              gamePosts.map(post => (
                <div key={post.id} className="border p-4 mb-4 rounded">
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.gameName}</p>
                  <div className="flex items-center mt-2">
                    <img src={post.host.photoURL} alt="Host" className="w-8 h-8 rounded-full mr-2" />
                    <p className="text-sm">{post.host.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>現在、募集はありません。</p>
            )}
          </div>
        </>
      ) : (
        <p>認証中...</p>
      )}
    </div>
  );
}