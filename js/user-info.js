// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase Configuration (Ensure this matches your firebase.js)
const firebaseConfig = {
    apiKey: "AIzaSyBls-s1CGz5gaE8Dy_uc1aGcVi7nvvr7WI",
    authDomain: "fitness-soul-454717.firebaseapp.com",
    projectId: "fitness-soul-454717",
    storageBucket: "fitness-soul-454717.appspot.com",
    messagingSenderId: "631085760200",
    appId: "1:631085760200:web:6310857602000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensure user is authenticated before allowing form submission
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No authenticated user, redirecting to login.");
        window.location.href = "/index.html"; // Redirect to login page
    }
});

// Handle form submission
document.getElementById('user-info-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "user", user.uid); // Ensure collection name is 'user'

        const userData = {
            age: document.getElementById('age').value.trim(),
            diet: document.getElementById('diet').value.trim(),
            "exercise-purpose": document.getElementById('exercise-purpose').value.trim(),
            height: document.getElementById('height').value.trim(),
            injury: document.getElementById('injury').value.trim(),
            weight: document.getElementById('weight').value.trim()
        };

        try {
            await setDoc(userRef, userData, { merge: true }); // Use merge to update only provided fields
            console.log("User data saved successfully!");

            window.location.href = "/dashboard.html"; // Redirect to dashboard after saving data
        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save user data. Please try again.");
        }
    } else {
        console.error("No authenticated user found.");
        alert("User not signed in. Please log in again.");
        window.location.href = "/index.html";
    }
});
