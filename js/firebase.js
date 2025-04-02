// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpguw_5fYNtpA2zW2SPZEr1utQF4YEm_s",
    authDomain: "fitness-soul-9277b.firebaseapp.com",
    projectId: "fitness-soul-9277b",
    storageBucket: "fitness-soul-9277b.appspot.com",
    messagingSenderId: "350767055636",
    appId: "1:350767055636:web:3507670556360000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


// Function to Switch Tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));

        e.target.classList.add('active');
        if (e.target.id === "tab-signin") {
            document.getElementById('form-signin').classList.add('active');
        } else {
            document.getElementById('form-signup').classList.add('active');
        }
    });
});

// Function to Save User Info in Firestore
// Sign In Function
document.getElementById('form-signin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    console.log("Attempting sign in with:", email);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in successfully:", userCredential.user);

        // Check if user has filled the info form
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().age !== null) {
            console.log("User data exists, redirecting to dashboard.");
            window.location.href = "dashboard.html";
        } else {
            console.log("User needs to fill additional info, redirecting.");
            window.location.href = "user-info.html";
        }
    } catch (error) {
        console.error("Error signing in:", error.message);
        document.getElementById('signin-error').textContent = error.message;
        document.getElementById('signin-error').style.display = 'block';
    }
});
// Sign Up Function
document.getElementById('form-signup').addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = "Passwords do not match!";
        document.getElementById('signup-error').style.display = 'block';
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            console.log("User signed up:", userCredential.user);
            await saveUserInfo(userCredential.user.uid, fullName, email);
            window.location.href = "user-info.html"; // Redirect to user info form
        })
        .catch((error) => {
            document.getElementById('signup-error').textContent = error.message;
            document.getElementById('signup-error').style.display = 'block';
        });
});

// Google Sign-In Function
const googleSignIn = () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            console.log("Google Sign In successful:", result.user);
            const userDoc = await getDoc(doc(db, "user", result.user.uid));

            if (!userDoc.exists()) {
                await saveUserInfo(result.user.uid, result.user.displayName, result.user.email);
            }
            checkUserProfile(result.user.uid);
        })
        .catch((error) => {
            console.error("Google Sign In error:", error);
            document.getElementById('signin-error').textContent = error.message;
            document.getElementById('signin-error').style.display = 'block';
        });
};

document.getElementById('google-signin').addEventListener('click', googleSignIn);
document.getElementById('google-signup').addEventListener('click', googleSignIn);

// Function to Check User Profile Completion
const checkUserProfile = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data().age !== null) {
        window.location.href = "dashboard.html"; // Redirect if profile is complete
    } else {
        window.location.href = "user-info.html"; // Redirect to user info form
    }
};

// Check Authentication State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        checkUserProfile(user.uid);
    }
});
