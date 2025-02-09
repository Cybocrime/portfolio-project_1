import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs,  
  updateDoc, 
  doc, 
  getDoc,
  arrayUnion, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  serverTimestamp,where
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// User Signup Function
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    if (password.length < 8) throw new Error("Password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error("Password must include at least one uppercase letter, one number, and one special character.");
    }

    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) throw new Error("Email already in use.");

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);
    return user;
  } catch (error) {
    console.error("Error during signup:", error.message);
    throw error;
  }
};

// Sign-In Function
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) throw new Error("Please verify your email before logging in.");

    // Check for existing sessions
    const sessionsRef = collection(db, "sessions");
    const q = query(sessionsRef, where("userId", "==", user.uid), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    // Log out old sessions
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (docSnap) => {
        await updateDoc(doc(db, "sessions", docSnap.id), { isActive: false });
      });
    }

    // Store new session
    const sessionRef = await addDoc(sessionsRef, {
      userId: user.uid,
      email: user.email,
      loginTime: new Date(),
      isActive: true,
    });

    return { user, sessionId: sessionRef.id };
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    throw error;
  }
};

// Log-Out Function
export const logOutUser = async (sessionId) => {
  try {
    if (!sessionId) throw new Error("Session ID is required for logout.");

    // Mark session as inactive in Firestore
    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, { isActive: false, logoutTime: new Date() });

    // Sign out from Firebase Auth
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error during logout:", error.message);
    throw error;
  }
};

// Fetch Comments Function
export const fetchComments = async (lastVisibleDoc = null) => {
  try {
    const commentsRef = collection(db, "comments");
    let q = query(commentsRef, orderBy("timestamp", "desc"), limit(10));

    if (lastVisibleDoc) {
      q = query(commentsRef, orderBy("timestamp", "desc"), startAfter(lastVisibleDoc), limit(10));
    }

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        userEmail: data.userEmail,
        timestamp: data.timestamp?.toDate() || new Date(),
        likes: data.likesUser?.length || 0, // Safe fallback to 0
        dislikes: data.dislikesUser?.length || 0, // Safe fallback to 0
        replies: data.replies || [],
        likesUser: data.likesUser || [], // Default to empty array if undefined
        dislikesUser: data.dislikesUser || [], // Default to empty array if undefined
      };
    });

    return { comments, lastVisible: snapshot.docs[snapshot.docs.length - 1] };
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    throw error;
  }
};

// Add Comment to Firestore
export const addComment = async (text, currentUser) => {
  try {
    if (!currentUser || !currentUser.email || !currentUser.userId) {
      throw new Error("User not authenticated.");
    }

    const commentsRef = collection(db, "comments");
    const newComment = {
      userEmail: currentUser.email,
      userId: currentUser.userId,
      content: text,
      timestamp: serverTimestamp(),
      likes: 0,
      dislikes: 0,
      adminEmail: '',
      replies: [],
      likesUser: [], // Initialize as empty array
      dislikesUser: [], // Initialize as empty array
      isEdited: false,
      lastEditedTimestamp: null,
    };

    const docRef = await addDoc(commentsRef, newComment);
    newComment.id = docRef.id;

    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw error;
  }
};

// Verify Comment by Admin
export const verifyComment = async (commentId) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, { isVerified: true });
    console.log(`Comment ${commentId} verified successfully.`);
  } catch (error) {
    console.error("Error verifying comment:", error.message);
    throw error;
  }
};

// Update Comment in Firestore
export const updateCommentInFirestore = async (docId, commentData) => {
  try {
    const commentRef = doc(db, "comments", docId);
    const docSnap = await getDoc(commentRef);

    if (!docSnap.exists()) {
      console.error("Document not found for docId:", docId);
      throw new Error(`Comment with ID ${docId} not found.`);
    }

    console.log("Document fetched successfully:", docSnap.data());

    // Ensure values are always defined
    const updatedData = {
      likes: commentData.likes ?? 0,
      dislikes: commentData.dislikes ?? 0,
      likesUser: Array.isArray(commentData.likesUser) ? commentData.likesUser : [],
      dislikesUser: Array.isArray(commentData.dislikesUser) ? commentData.dislikesUser : [],
    };

    // Update Firestore document
    await updateDoc(commentRef, updatedData);

    console.log("Comment updated successfully.");
  } catch (error) {
    console.error("Error updating Firestore document:", error.message);
    throw error;
  }
};

// Reset Password Function
export const resetPassword = async (email) => {
  try {
    if (!email) throw new Error("Email address is required.");
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully to:", email);
    return { success: true, message: "Password reset email sent." };
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
};

// Reply to a comment function
export const addReplyToComment = async (commentDocId, newReply) => {
  try {
    console.log("Debug: commentDocId passed to addReplyToComment:", commentDocId);
    // Get the reference to the main comment document
    const commentRef = doc(db, "comments", commentDocId);

    // Update the replies array in the comment document using arrayUnion from Firestore SDK
    await updateDoc(commentRef, {
      replies: arrayUnion(newReply), // Add the new reply to the replies array
    });

    console.log("Reply added successfully to comment:", commentDocId);
  } catch (error) {
    console.error("Error adding reply to comment:", error.message);
    throw error;
  }
};
