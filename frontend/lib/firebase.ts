import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Googleログイン処理
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User:", result.user);
    return result.user;
  } catch (error) {
    console.error("Googleログインエラー:", error);
  }
};

// ログアウト処理
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("ログアウトしました");
  } catch (error) {
    console.error("ログアウトエラー:", error);
  }
};

// Firestoreにユーザーを保存
export const saveUserToFirestore = async (user: any) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
      role: "user",
    });
  }
};

// Firestoreから募集一覧を取得
export const getGamePosts = async () => {
  try {
    const gamesCollection = collection(db, "games");
    const q = query(gamesCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const gamePosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return gamePosts;
  } catch (error) {
    console.error("募集一覧の取得に失敗:", error);
    return [];
  }
};