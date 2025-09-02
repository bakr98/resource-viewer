// Firebase initialization and Firestore instance

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID!,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Export Firestore client to be used in components
export const db = getFirestore(app);