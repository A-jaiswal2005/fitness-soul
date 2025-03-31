// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
// Firebase Configuration (Yes, it includes your API Key)
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
const saveUserInfo = async (userId, fullName, email) => {
    await setDoc(doc(db, "users", userId), {
        fullName: fullName,
        email: email,
        age: null,
        height: null,
        weight: null,
        exercisePurpose: null,
        injury: null,
        diet: null
    });
};
// Sign In Function
document.getElementById('form-signin').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed in:", userCredential.user);
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            document.getElementById('signin-error').textContent = error.message;
            document.getElementById('signin-error').style.display = 'block';
        });
});

// Sign Up Function
document.getElementById('form-signup').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = "Passwords do not match!";
        document.getElementById('signup-error').style.display = 'block';
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed up:", userCredential.user);
            document.getElementById('signup-success').textContent = "Account created successfully! Please sign in.";
            document.getElementById('signup-success').style.display = 'block';
            setTimeout(() => {
                document.getElementById('tab-signin').click();
            }, 2000);
        })
        .catch((error) => {
            document.getElementById('signup-error').textContent = error.message;
            document.getElementById('signup-error').style.display = 'block';
        });
});

// Google Sign-In Function
const googleSignIn = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Google Sign In successful:", result.user);
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            console.error("Google Sign In error:", error);
            document.getElementById('signin-error').textContent = error.message;
            document.getElementById('signin-error').style.display = 'block';
        });
};

document.getElementById('google-signin').addEventListener('click', googleSignIn);
document.getElementById('google-signup').addEventListener('click', googleSignIn);

// Check Authentication State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().age !== null) {
            window.location.href = "/dashboard.html";
        } else {
            window.location.href = "/user-info.html";
        }
    }
});