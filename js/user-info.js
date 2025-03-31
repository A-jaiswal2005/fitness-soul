import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.getElementById('user-info-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            age: document.getElementById('age').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            exercisePurpose: document.getElementById('exercise-purpose').value,
            injury: document.getElementById('injury').value,
            diet: document.getElementById('diet').value
        });

        window.location.href = "/dashboard.html";
    }
});
