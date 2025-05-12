import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// Function to sanitize email by removing non-printable characters and converting to lowercase
function sanitizeEmail(email) {
  if (!email) return email;
  email = email.replace(/[^\x20-\x7E]/g, '');
  return email.trim().toLowerCase();
}

// Function to log email character codes for debugging
function logEmailDebug(email) {
  console.log("Raw email:", email);
  console.log("Email length:", email.length);
  console.log("Email character codes:", email.split('').map(char => char.charCodeAt(0)));
}

document.addEventListener("DOMContentLoaded", function () {
    const quotes = [
        "Plan. Explore. Share.",
        "Discover. Capture. Inspire.",
        "Organize. Document. Connect.",
        "Prepare. Experience. Engage.",
        "Chart. Photograph. Bond.",
        "Schedule. Snap. Share."
    ];
    let currentQuoteIndex = 0;
    const quoteElement = document.getElementById("quote");

    function typeQuote(index = 0) {
        const currentQuote = quotes[currentQuoteIndex];
        if (index < currentQuote.length) {
            quoteElement.textContent += currentQuote.charAt(index);
            setTimeout(() => typeQuote(index + 1), 100);
        } else {
            setTimeout(() => {
                quoteElement.textContent = "";
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                typeQuote();
            }, 2000);
        }
    }
    if (quoteElement) typeQuote();

    document.getElementById('startButton').addEventListener('click', function () {
        document.getElementById('backgroundContainer').classList.remove('hidden');
        this.style.display = 'none';
    });

    document.getElementById('planButton').addEventListener('click', function () {
        const tripName = document.getElementById('tripName').value.trim();
        const numberOfDays = parseInt(document.getElementById('numberOfDays').value, 10);
        const tripTitle = document.getElementById('tripTitle');
        const tripFormContainer = document.getElementById('tripFormContainer');
        const tripContainer = document.getElementById('tripContainer');
        const dayButtonsContainer = document.getElementById('dayButtonsContainer');

        if (!tripName || isNaN(numberOfDays) || numberOfDays <= 0) {
            alert('Please enter a valid trip name and number of days.');
            return;
        }

        tripFormContainer.classList.add('hidden');
        tripTitle.textContent = `Trip: ${tripName} (${numberOfDays} days)`;
        tripTitle.classList.remove('hidden');
        tripContainer.classList.remove('hidden');
        dayButtonsContainer.innerHTML = '';

        for (let i = 1; i <= numberOfDays; i++) {
            const dayBox = document.createElement('div');
            dayBox.className = 'day-box trip-start-btn';
            dayBox.textContent = `Day ${i}`;
            dayBox.id = `day-${i}`;
            dayBox.addEventListener('click', () => openDayForm(i));
            dayButtonsContainer.appendChild(dayBox);
        }
    });

    document.getElementById('resetButton').addEventListener('click', function () {
        document.getElementById('tripTitle').textContent = '';
        document.getElementById('tripTitle').classList.add('hidden');
        document.getElementById('tripContainer').classList.add('hidden');
        document.getElementById('dayButtonsContainer').innerHTML = '';
        document.getElementById('tripFormContainer').classList.remove('hidden');
        document.getElementById('tripName').value = '';
        document.getElementById('numberOfDays').value = '';
    });

    document.getElementById('closeButton').addEventListener('click', function () {
        document.getElementById('backgroundContainer').classList.add('hidden');
        document.getElementById('startButton').style.display = 'block';
    });

    function openDayForm(dayNumber) {
        const formsContainer = document.getElementById('forms-container');
        Array.from(formsContainer.children).forEach(child => {
            child.style.display = 'none';
        });

        let existingForm = document.getElementById(`form-day-${dayNumber}`);
        if (existingForm) {
            existingForm.style.display = 'flex';
            existingForm.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const templateForm = document.querySelector('.form-container');
        const clonedForm = templateForm.cloneNode(true);
        clonedForm.id = `form-day-${dayNumber}`;
        clonedForm.style.display = 'flex';

        const title = clonedForm.querySelector('.day-heading');
        if (title) title.textContent = `Day ${dayNumber}`;
        if (title) title.id = `D ${dayNumber}`;

        const tabButtons = clonedForm.querySelectorAll(".tab");
        const sections = clonedForm.querySelectorAll(".section");

        tabButtons.forEach(tab => {
            tab.addEventListener("click", function (e) {
                tabButtons.forEach(t => t.classList.remove("active"));
                sections.forEach(section => section.classList.remove("active"));

                tab.classList.add("active");
                const sectionId = tab.getAttribute("data-target");
                const targetSection = clonedForm.querySelector(`#${sectionId}`);
                if (targetSection) targetSection.classList.add("active");
            });
        });

        formsContainer.appendChild(clonedForm);
        clonedForm.scrollIntoView({ behavior: 'smooth' });
    }

    function addTravel(btn) {
        const form = btn.closest(".form-container");
        const travelMode = form.querySelector(".travelMode").value;
        const travelFrom = form.querySelector(".travelFrom").value;
        const travelTo = form.querySelector(".travelTo").value;
        const travelPrice = form.querySelector(".travelPrice").value;
        const travelCart = form.querySelector(".travelCart");

        if (!travelFrom || !travelTo || !travelPrice) {
            alert("Please enter all travel details.");
            return;
        }

        const item = document.createElement("div");
        item.className = "cart-item";
        item.textContent = `${travelMode} - ${travelFrom} - ${travelTo} - ₹${travelPrice}`;
        travelCart.appendChild(item);

        form.querySelector(".travelFrom").value = '';
        form.querySelector(".travelTo").value = '';
        form.querySelector(".travelPrice").value = '';
    }

    function addHotel(btn) {
        const form = btn.closest(".form-container");
        const hotelName = form.querySelector(".hotelName").value;
        const hotelPrice = form.querySelector(".hotelCost").value;
        const hotelLocation = form.querySelector(".hotelLocation").value;
        const hotelCart = form.querySelector(".hotelCart");

        if (!hotelName || !hotelPrice) {
            alert("Please enter hotel name and price.");
            return;
        }

        const item = document.createElement("div");
        item.className = "cart-item";
        item.textContent = `Hotel: ${hotelName} - ₹${hotelPrice} - ${hotelLocation}`;
        hotelCart.appendChild(item);

        form.querySelector(".hotelName").value = '';
        form.querySelector(".hotelCost").value = '';
        form.querySelector(".hotelLocation").value = '';
    }

    function addFood(btn) {
        const form = btn.closest(".form-container");
        const foodType = form.querySelector(".foodType").value;
        const foodName = form.querySelector(".foodName").value;
        const foodPrice = form.querySelector(".foodPrice").value;
        const foodLocation = form.querySelector(".foodLocation").value;
        const foodCart = form.querySelector(".foodCart");

        if (!foodName || !foodPrice) {
            alert("Please enter food name and price.");
            return;
        }

        const item = document.createElement("div");
        item.className = "cart-item";
        item.textContent = `${foodType} - ${foodName} - ₹${foodPrice} - ${foodLocation}`;
        foodCart.appendChild(item);

        form.querySelector(".foodName").value = '';
        form.querySelector(".foodPrice").value = '';
        form.querySelector(".foodLocation").value = '';
    }

    function showSection(id, event) {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.querySelectorAll(".section").forEach(section => section.classList.remove("active"));
        document.getElementById(id).classList.add("active");
        event.target.classList.add("active");
    }

    function getLocationAndSetAddress(inputElement) {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

            try {
                const res = await fetch(url);
                const data = await res.json();
                inputElement.value = data.display_name || "Unknown location";
            } catch (err) {
                console.error("Error fetching location:", err);
                alert("Unable to fetch location.");
            }
        });
    }

    document.getElementById("forms-container").addEventListener("click", function (e) {
        const btn = e.target;

        if (btn.matches("button") && btn.textContent.trim().toLowerCase() === "add") {
            const form = btn.closest(".form-container");

            const section = btn.closest(".section");
            if (section && section.id === "food-section") {
                addFood(btn);
            } else if (section && section.id === "hotel-section") {
                addHotel(btn);
            } else if (section && section.id === "travel-section") {
                addTravel(btn);
            }
        }
        if (btn.matches("button") && btn.textContent.trim() === "📍") {
            const input = btn.previousElementSibling;
            if (input && input.classList.contains("foodLocation")) {
                getLocationAndSetAddress(input);
            } else if (input && input.classList.contains("hotelLocation")) {
                getLocationAndSetAddress(input);
            }
        }
        if (btn.matches("button") && btn.textContent.trim().toLowerCase() === "submit") {
            submitForm(btn);
        }
    });

    async function submitForm(btn) {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("You must be logged in to save your trip.");
            }

            const rawEmail = user.email;
            logEmailDebug(rawEmail);
            const email = sanitizeEmail(rawEmail);
            console.log("Sanitized email:", email);

            const tripName = document.getElementById('tripName').value.trim();
            if (!tripName) {
                throw new Error("Trip name is required.");
            }

            const form = btn.closest(".form-container");

            const headingEl = form.querySelector(".day-heading");
            if (!headingEl) {
                throw new Error("Day heading not found in the form.");
            }
            const dayId = headingEl.textContent.trim();

            // Calculate budget while parsing data
            let dayBudget = 0;

            // ==== FOOD ====
            const foodItems = form.querySelectorAll(".foodCart .cart-item");
            const foodMap = {
                Breakfast: [],
                Lunch: [],
                Dinner: [],
                Snack: []
            };

            foodItems.forEach(item => {
                const [type, name, price, location] = item.textContent.split(" - ");
                if (type && name && price && location) {
                    const itemPrice = parseFloat(price.replace("₹", "").trim());
                    foodMap[type]?.push({
                        item: name.trim(),
                        itemPrice: itemPrice,
                        location: location.trim()
                    });
                    dayBudget += itemPrice;
                }
            });

            // ==== ACCOMMODATION ====
            const hotelItems = form.querySelectorAll(".hotelCart .cart-item");
            const accommodationArray = [];
            hotelItems.forEach(hotelItem => {
                const text = hotelItem.textContent;
                const match = text.match(/^Hotel:\s*(.+?)\s*-\s*₹(\d+(?:\.\d+)?)\s*-\s*(.+)$/);
                if (match) {
                    const [, name, price, address] = match;
                    const hotelCost = parseFloat(price.trim());
                    accommodationArray.push({
                        hotelName: name.trim(),
                        hotelCost: hotelCost,
                        address: address.trim()
                    });
                    dayBudget += hotelCost;
                }
            });

            // ==== TRAVEL ====
            const travelItems = form.querySelectorAll(".travelCart .cart-item");
            const travelArray = [];
            travelItems.forEach(travelItem => {
                const text = travelItem.textContent;
                const match = text.match(/^(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*₹(\d+(?:\.\d+)?)/);
                if (match) {
                    const [, mode, from, to, cost] = match;
                    const travelCost = parseFloat(cost);
                    travelArray.push({
                        mode: mode.trim(),
                        from: from.trim(),
                        to: to.trim(),
                        cost: travelCost
                    });
                    dayBudget += travelCost;
                }
            });

            // ==== USER-SPECIFIC FIRESTORE PATH ====
            const userDocRef = doc(db, "users", email);
            const tripDocRef = doc(collection(userDocRef, "trips"), tripName);
            const dayDocRef = doc(collection(tripDocRef, "days"), dayId);

            await setDoc(dayDocRef, {
                Food: foodMap,
                Travel: travelArray,
                Accommodation: accommodationArray
            }, { merge: true });

            const tripDocSnap = await getDoc(tripDocRef);
            let currentTotalDays = 0;
            let totalBudget = dayBudget;
            if (tripDocSnap.exists()) {
                const tripData = tripDocSnap.data();
                currentTotalDays = tripData.totalDays || 0;
                totalBudget = (tripData.totalBudget || 0) + dayBudget;
            }

            const dayNumber = parseInt(dayId.replace("Day ", "").trim());
            if (dayNumber > currentTotalDays) {
                await setDoc(tripDocRef, {
                    totalDays: dayNumber,
                    totalBudget: totalBudget
                }, { merge: true });
            } else {
                await setDoc(tripDocRef, {
                    totalBudget: totalBudget
                }, { merge: true });
            }

            // ==== GLOBAL TRIPS COLLECTION ====
            const safeTripId = tripName;
            const globalTripDocRef = doc(db, "trips", safeTripId);
            const globalUserDocRef = doc(collection(globalTripDocRef, "users"));
            console.log("Saved under document ID:", globalUserDocRef.id);
            console.log("Email stored as field:", email);

            const globalDayDocRef = doc(collection(globalUserDocRef, "days"), dayId);

            await setDoc(globalDayDocRef, {
                Food: foodMap,
                Travel: travelArray,
                Accommodation: accommodationArray
            }, { merge: true });

            const globalUserDocSnap = await getDoc(globalUserDocRef);
            let globalTotalBudget = dayBudget;
            if (globalUserDocSnap.exists()) {
                const userData = globalUserDocSnap.data();
                globalTotalBudget = (userData.totalBudget || 0) + dayBudget;
            }

            await setDoc(globalUserDocRef, {
                email: email,
                totalDays: dayNumber,
                totalBudget: globalTotalBudget
            }, { merge: true });

            const globalTripDocSnap = await getDoc(globalTripDocRef);
            let globalCurrentTotalDays = 0;
            if (globalTripDocSnap.exists() && globalTripDocSnap.data().totalDays) {
                globalCurrentTotalDays = globalTripDocSnap.data().totalDays;
            }

            if (dayNumber > globalCurrentTotalDays) {
                await setDoc(globalTripDocRef, {
                    tripName: tripName,
                    totalDays: dayNumber
                }, { merge: true });
            }

            // Show success message with navigation links
            const message = `
                ${dayId} data saved successfully!
                \n\nExplore your trip:
                - View by Destination: <a href="destination_results.html?destination=${tripName}" target="_blank">Click here</a>
                - View by Days: <a href="days_results.html?days=${dayNumber}" target="_blank">Click here</a>
                - View by Budget: <a href="budget_results.html?budget=${globalTotalBudget.toFixed(2)}" target="_blank">Click here</a>
            `;
            alert(message);
        } catch (error) {
            console.error("Firestore submission error:", error);
            alert(`Failed to submit trip: ${error.message}`);
        }
    }
});