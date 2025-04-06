// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth();

// DOM elements
const logoutBtn = document.getElementById('logoutBtn');
const editProfileBtn = document.getElementById('editProfileBtn');

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Failed to log out. Please try again.");
    }
});
// Load user data from Firestore
document.getElementById('generatePlanBtn').addEventListener('click', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
            } else {
                alert("No user data found.");
            }
        } else {
            alert("User not logged in.");
        }
    });
});

    // Calculate BMI
    const weight = parseFloat(userData.weight);
    const height = parseFloat(userData.height);
    if (weight && height) {
        const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
        document.getElementById('bmiValue').textContent = bmi;
    }


async function fetchExercisePlan() {
    try {
        document.getElementById('exerciseContent').innerHTML = "Loading...";

        const response = await fetch('http://localhost:3000/exercise-plan');
        const data = await response.json();

        if (data.error) {
            document.getElementById('exerciseContent').innerHTML = `<p>Error: ${data.error}</p>`;
            return;
        }

        // Format JSON into a table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Table Header
        const headerRow = table.insertRow();
        const headers = ['Day', 'Focus', 'Exercises', 'Notes'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.style.border = '1px solid #ddd';
            header.style.padding = '8px';
            header.style.textAlign = 'left';
            headerRow.appendChild(header);
        });

        // Table Rows
        for (const day in data.workoutPlan.days) {
            const dayData = data.workoutPlan.days[day];
            const row = table.insertRow();

            const dayCell = row.insertCell();
            dayCell.textContent = day;
            dayCell.style.border = '1px solid #ddd';
            dayCell.style.padding = '8px';

            const focusCell = row.insertCell();
            focusCell.textContent = dayData.focus;
            focusCell.style.border = '1px solid #ddd';
            focusCell.style.padding = '8px';

            const exercisesCell = row.insertCell();
            exercisesCell.innerHTML = dayData.exercises.map(exercise => {
                return `<div>${exercise.name} (Sets: ${exercise.sets}, Reps: ${exercise.reps}, Notes: ${exercise.notes})</div>`;
            }).join('');
            exercisesCell.style.border = '1px solid #ddd';
            exercisesCell.style.padding = '8px';

            const notesCell = row.insertCell();
            notesCell.textContent = dayData.notes;
            notesCell.style.border = '1px solid #ddd';
            notesCell.style.padding = '8px';
        }

        document.getElementById('exerciseContent').innerHTML = ''; // Clear existing content
        document.getElementById('exerciseContent').appendChild(table);

    } catch (error) {
        console.error("Error fetching exercise plan:", error);
        document.getElementById('exerciseContent').innerHTML = "Error fetching data. Please try again later.";
    }
}