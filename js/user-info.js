// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase Configuration (Copy this from firebase.js)
const firebaseConfig = {
    apiKey: "AIzaSyBls-s1CGz5gaE8Dy_uc1aGcVi7nvvr7WI",
    authDomain: "fitness-soul-454717.firebaseapp.com",
    projectId: "fitness-soul-454717",
    storageBucket: "fitness-soul-454717.appspot.com",
    messagingSenderId: "631085760200",
    appId: "1:631085760200:web:6310857602000000000000"
};

// Initialize Firebase (this is the missing step)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensure user is authenticated before showing form
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No authenticated user, redirecting to login.");
        window.location.href = "/index.html";
    }
});

// Handle form submission
document.getElementById('user-info-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);

        const userData = {
            age: document.getElementById('age').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            exercisePurpose: document.getElementById('exercise-purpose').value,
            injury: document.getElementById('injury').value,
            diet: document.getElementById('diet').value
        };

        try {
            await setDoc(userRef, userData); // Save user data
            console.log("User data saved successfully!");

            window.location.href = "dashboard.html"; // Redirect to dashboard
        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save user data. Please try again.");
        }
    } else {
        console.error("No authenticated user found.");
        alert("User not signed in. Please log in again.");
        window.location.href = "index.html";
    }
});
