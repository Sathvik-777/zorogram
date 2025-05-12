document.addEventListener("DOMContentLoaded", function () {
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
                    targetSection.style.display = "flex";
                }
            });
        });

        filters.forEach(filter => filter.style.display = "none");
        document.getElementById("destination").style.display = "flex";
    }

    // Underlining the selected filter
    filterLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove underline from all
            filterLinks.forEach(l => l.classList.remove("active-filter"));
            this.classList.add("active-filter");

            // Hide all filter blocks
            filters.forEach(filter => filter.style.display = "none");

            // Show selected one
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = "flex";
            }
        });
    });

    // Search filter functions
    function searchDays() {
        const daysInput = document.getElementById('search-noofdays');
        if (!daysInput) {
            alert("Search input for number of days not found.");
            return;
        }
        const days = daysInput.value.trim();
        if (!days) {
            alert("Please enter number of days.");
            return;
        }
        window.location.href = `days_results.html?days=${days}`;
    }

    function searchDestination() {
        const destinationInput = document.getElementById('search-destination');
        if (!destinationInput) {
            alert("Search input for destination not found.");
            return;
        }
        const destination = destinationInput.value.trim();
        if (!destination) {
            alert("Please enter a destination.");
            return;
        }
        window.location.href = `destination_results.html?destination=${encodeURIComponent(destination)}`;
    }

    function searchBudget() {
        const budgetInput = document.getElementById('search-budget');
        if (!budgetInput) {
            alert("Budget input field not found.");
            return;
        }
        const budget = budgetInput.value.trim();
        if (!budget) {
            alert("Please enter a budget.");
            return;
        }
        if (budget <= 0) {
            alert("Please enter a valid budget greater than 0.");
            return;
        }
        window.location.href = `budget_results.html?budget=${budget}`;
    }

    function searchUser() {
        const usernameInput = document.getElementById('search-username');
        if (!usernameInput) {
            alert("Search input for username not found.");
            return;
        }
        const username = usernameInput.value.trim();
        if (!username) {
            alert("Please enter a username to search.");
            return;
        }
        window.location.href = `user_trips.html?user=${encodeURIComponent(username)}`;
    }

    // Attach event listeners to search buttons
    const searchDaysButton = document.querySelector("#days button");
    const searchDestinationButton = document.querySelector("#destination button");
    const searchBudgetButton = document.querySelector("#budget button");
    const searchUserButton = document.querySelector("#username button");

    if (searchDaysButton) {
        searchDaysButton.addEventListener("click", searchDays);
    }
    if (searchDestinationButton) {
        searchDestinationButton.addEventListener("click", searchDestination);
    }
    if (searchBudgetButton) {
        searchBudgetButton.addEventListener("click", searchBudget);
    }
    if (searchUserButton) {
        searchUserButton.addEventListener("click", searchUser);
    }
});