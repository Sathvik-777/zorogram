import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBVNJzEZQyY0RCZlkfrqKrKdIggQrx62KU",
    authDomain: "zorogram-e0eea.firebaseapp.com",
    projectId: "zorogram-e0eea",
    storageBucket: "zorogram-e0eea.appspot.com",
    messagingSenderId: "3495535292",
    appId: "1:3495535292:web:3c8c21807fbfd1d3d026b9",
    measurementId: "G-7YFSQZZ72G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to sanitize email
function sanitizeEmail(email) {
    if (!email) return email;
    email = email.replace(/[^\x20-\x7E]/g, '');
    return email.trim().toLowerCase();
}

// Load User Trips
async function loadUserTrips() {
    const user = auth.currentUser;
    const tripsContainer = document.getElementById('profile-trips');
    tripsContainer.innerHTML = '';

    if (!user) {
        tripsContainer.innerHTML = '<p class="text-white text-center">Please log in to view your trips.</p>';
        return;
    }

    const email = sanitizeEmail(user.email);
    const userDocRef = doc(db, "users", email);
    const tripsCollectionRef = collection(userDocRef, "trips");

    try {
        const tripsSnapshot = await getDocs(tripsCollectionRef);
        if (tripsSnapshot.empty) {
            tripsContainer.innerHTML = '<p class="text-white text-center">No trips found. Start planning now!</p>';
            return;
        }

        tripsSnapshot.forEach(tripDoc => {
            const tripData = tripDoc.data();
            const tripName = tripDoc.id;
            const totalDays = tripData.totalDays || 0;
            const totalBudget = tripData.totalBudget || 0;

            const tripCard = document.createElement('div');
            tripCard.className = 'col-md-4 mb-4';
            tripCard.innerHTML = `
                <div class="card text-white bg-dark">
                    <div class="card-body">
                        <h5 class="card-title">${tripName}</h5>
                        <p class="card-text">Days: ${totalDays}</p>
                        <p class="card-text">Budget: ₹${totalBudget.toFixed(2)}</p>
                        <a href="destination_results.html?destination=${encodeURIComponent(tripName)}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
            tripsContainer.appendChild(tripCard);
        });
    } catch (error) {
        console.error("Error loading user trips:", error);
        tripsContainer.innerHTML = '<p class="text-white text-center">Error loading trips.</p>';
    }
}

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
    const loginButton = document.querySelector('.login-button');
    const usernameDisplay = document.querySelector('.username');
    const logoutImage = document.querySelector('.logout-image');

    if (user) {
        loginButton.classList.add('hidden');
        usernameDisplay.classList.remove('hidden');
        logoutImage.classList.remove('hidden');
        usernameDisplay.textContent = user.email.split('@')[0];
        loadUserTrips();
    } else {
        loginButton.classList.remove('hidden');
        usernameDisplay.classList.add('hidden');
        logoutImage.classList.add('hidden');
        document.getElementById('profile-trips').innerHTML = '<p class="text-white text-center">Please log in to view your trips.</p>';
    }

    logoutImage?.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.reload();
        }).catch(error => {
            console.error("Sign out error:", error);
        });
    });
});