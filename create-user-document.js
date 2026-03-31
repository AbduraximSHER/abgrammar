/**
 * create-user-document.js
 * Creates a Firestore user document on first sign-in.
 * Loaded once as a module — replaces inline script blocks across all pages.
 */
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.createUserDocument = async function(user, provider) {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (user.email ? user.email.split("@")[0] : "User"),
        provider: provider,
        createdAt: serverTimestamp(),
        hasPlacement: false,
        level: null,
        placementScore: null,
        placementTakenAt: null
      });
    }
    return userRef;
  } catch(e) {
    console.error("createUserDocument error:", e);
    throw e;
  }
};
