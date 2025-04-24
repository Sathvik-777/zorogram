
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore,collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";




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

document.addEventListener("DOMContentLoaded", function () {
    // === Typing Effect for Quotes ===
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

    // === Smooth Scroll Nav ===
    const navbarLinks = document.querySelectorAll(".nav-link");
    const homeNav = document.getElementById("home");
    const searchNav = document.getElementById("search");
    const searchSection = document.getElementById("description-div");
    const sections = { "search": "description-div", "about": "about-div" };

    navbarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            navbarLinks.forEach(link => link.classList.remove("active"));
            event.target.classList.add("active");

            const targetID = sections[event.target.id];
            if (targetID) {
                let targetDiv = document.getElementById(targetID);
                let navbarHeight = document.querySelector(".navbar").offsetHeight;
                let targetPosition = targetDiv.getBoundingClientRect().top + window.scrollY - navbarHeight - 70;

                window.scrollTo({ top: targetPosition, behavior: "smooth" });
            } else if (event.target.id === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });

    if (searchSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelector(".nav-link.active")?.classList.remove("active");
                    searchNav.classList.add("active");
                } else {
                    searchNav.classList.remove("active");
                    homeNav.classList.add("active");
                }
            });
        }, { threshold: 0.5 });
        observer.observe(searchSection);
    }

    // === Modal & Trip Planner ===
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

    // === Filtering Trip Sections ===
    const filterLinks = document.querySelectorAll(".trip-filter a");
    const filters = document.querySelectorAll(".filter");

    if (filterLinks.length > 0 && filters.length > 0) {
        filterLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                let targetId = this.getAttribute("href").substring(1);
                filters.forEach(filter => filter.style.display = "none");

                let targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.style.display = "block";
                }
            });
        });

        filters.forEach(filter => filter.style.display = "none");
        document.getElementById("destination").style.display = "block";
    }

    // === Open Day Form Function (Final) ===
    function openDayForm(dayNumber) {
        const formsContainer = document.getElementById('forms-container');
    
        // Hide all forms
        Array.from(formsContainer.children).forEach(child => {
            child.style.display = 'none';
        });
    
        // Show existing form if already created
        let existingForm = document.getElementById(`form-day-${dayNumber}`);
        if (existingForm) {
            existingForm.style.display = 'flex';
            existingForm.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    
        // Clone and show new form
        const templateForm = document.querySelector('.form-container');
        const clonedForm = templateForm.cloneNode(true);
        clonedForm.id = `form-day-${dayNumber}`;
        clonedForm.style.display = 'flex';
    
        // Update Day Heading
        const title = clonedForm.querySelector('.day-heading');
        if (title) title.textContent = `Day ${dayNumber}`;
        if (title) title.id = `D ${dayNumber}`;
    
        // 🎯 Step 1: Add tab switching logic to this form
        const tabButtons = clonedForm.querySelectorAll(".tab");
        const sections = clonedForm.querySelectorAll(".section");
        
    
        tabButtons.forEach(tab => {
            tab.addEventListener("click", function (e) {
                // Remove active class from all tabs
                tabButtons.forEach(t => t.classList.remove("active"));
                // Hide all sections
                sections.forEach(section => section.classList.remove("active"));
    
                // Add active class to clicked tab
                tab.classList.add("active");
                const sectionId = tab.getAttribute("data-target");
                const targetSection = clonedForm.querySelector(`#${sectionId}`);
                if (targetSection) targetSection.classList.add("active");
            });
        });
    
        // Append cloned form
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

        // Clear inputs
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

        // Clear inputs
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

        // Clear inputs (optional)
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
    
    // === Real-time Location Fetch ===
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
    

    // Call the function on form load
    

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
            submitForm();
        }
    });

    async function submitForm() {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to save your trip.");
                return;
            }
    
            const email = user.email;
            const tripName = document.getElementById('tripName').value.trim();
            if (!tripName) {
                alert("Trip name is required.");
                return;
            }
    
            const form = event.target.closest(".form-container");

            const headingEl = form.querySelector(".day-heading");
            if (!headingEl) {
               console.error("Day heading not found in the form.");
              return;
            }
const dayId = headingEl.textContent; // e.g., "Day 1"
    
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
                    foodMap[type]?.push({
                        item: name.trim(),
                        itemPrice: parseFloat(price.replace("₹", "").trim()),
                        location: location.trim()
                    });
                }
            });
    
            // ==== ACCOMMODATION ====
            const hotelItem = form.querySelector(".hotelCart .cart-item")?.textContent;
            let accommodationData = {};
            if (hotelItem) {
                // Expected format: "Hotel: <name> - ₹<price> - <address>"
                const match = hotelItem.match(/^Hotel:\s*(.+?)\s*-\s*₹(\d+(?:\.\d+)?)\s*-\s*(.+)$/);
                if (match) {
                    const [, name, price, address] = match;
                    accommodationData = {
                        hotelName: name.trim(),
                        hotelCost: parseFloat(price.trim()),
                        address: address.trim()
                    };
                } else {
                    console.warn("Accommodation format not recognized:", hotelItem);
                }
            }
            
    
            const travelItem = form.querySelector(".travelCart .cart-item")?.textContent;
let travelData = {};
if (travelItem) {
    // Expected format: "bike - Hyderabad - Bangalore - ₹500"
    const match = travelItem.match(/^(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*₹(\d+(?:\.\d+)?)/);
    if (match) {
        const [, mode, from, to, cost] = match;
        travelData = {
            mode: mode.trim(),
            from: from.trim(),
            to: to.trim(),
            cost: parseFloat(cost)
        };
    } else {
        console.warn("Travel format not recognized:", travelItem);
    }
}

            
            // ==== FIRESTORE PATH ====
            const userDoc = doc(db, email, tripName);
            const dayCollection = collection(userDoc, dayId);
    
            // Save data
            await setDoc(doc(dayCollection, "Food"), foodMap);
            await setDoc(doc(dayCollection, "Accommodation"), accommodationData);
            await setDoc(doc(dayCollection, "Travel"), travelData);
    
            alert(`${dayId} data saved successfully!`);
        } catch (error) {
            console.error("Firestore submission error:", error);
            alert("Failed to submit trip. Please try again.");
        }
    }      
    
    
});
