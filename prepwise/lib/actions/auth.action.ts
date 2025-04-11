import { auth as authInstance, db } from "@/firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";


export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<any | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password
    );
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name,
      // Add any other relevant user data here
    });

    // Fetch user data from Firestore and return as plain object
    const userData = await getUserData(user.uid);
    console.log("userData", userData);
    return {
      success: true,
      message: "User signed up successfully",
      data: userData ? JSON.parse(JSON.stringify(userData)) : null,
      user: userCredential,
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "User signed up failed"
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<any | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email,
      password
    );
    const user = userCredential.user;

    // Fetch user data from Firestore and return as plain object
    const userData = await getUserData(user.uid);
    return  {
      success: true,
      message: "Signed in successfully",
      data: userData ? JSON.parse(JSON.stringify(userData)) : null,
      user: userCredential
    };
  } catch (error) {
    console.error("Login error:", error);
    return  {
      success: false,
      message: "Login failed",
    };
  }
}


export async function signOutUser(): Promise<void> {
  try {
    await signOut(authInstance);
  } catch (error) {
    console.error("Signout error:", error);
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  return authInstance.currentUser !== null;
}

export async function getCurrentUser(): Promise<User | null> {
  return authInstance.currentUser;
}

export async function getUserData(uid: string): Promise<any | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("User data not found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
