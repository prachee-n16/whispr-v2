import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {
    signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, where, query, getDocs } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAR8XSr6zUCRE0piG7RLpeh7MRrL6zFe0A",
    authDomain: "whispr-c1810.firebaseapp.com",
    projectId: "whispr-c1810",
    storageBucket: "whispr-c1810.appspot.com",
    messagingSenderId: "1095903407273",
    appId: "1:1095903407273:web:e8a23c5ebb8e09a5748db8",
    measurementId: "G-7NTYBG1S23"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const auth = firebase.auth();

// Database 
export const db = getFirestore();

// Google Sign-in Popup
export const signInWithGoogle = async () => {
    try {
        const res = await auth.signInWithPopup(provider);
        const user = res.user;
        const userRef = collection(db, "users");
        const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
        if (result.empty) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        alert(err.message);
    }
};

// Sign in with an email and password
export const signInWithEmailAndPassword = async (email, password) => {
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        alert(err.message);
    }
};

// Register with email and password
export const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await auth.createUserWithEmailAndPassword(email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err) {
        alert(err.message);
    }
};

export const logout = () => {
    signOut(auth);
};

export default firebase;