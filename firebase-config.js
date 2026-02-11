// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDfhhVF5aHWZMhcGydBOLbc4HzHnsEm5AA",
    authDomain: "portfolio-website-72656.firebaseapp.com",
    projectId: "portfolio-website-72656",
    storageBucket: "portfolio-website-72656.firebasestorage.app",
    messagingSenderId: "1015455571076",
    appId: "1:1015455571076:web:a516619b3c38d9486136d1",
    measurementId: "G-0PMWQF9TS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("Firebase initialized");

export { app, analytics, db };
