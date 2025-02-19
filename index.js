// Array of quotes
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

// Function to display each quote one by one with typing effect
function typeQuote(index = 0) {
  const currentQuote = quotes[currentQuoteIndex];

  if (index < currentQuote.length) {
    quoteElement.textContent += currentQuote.charAt(index);
    setTimeout(() => typeQuote(index + 1), 100); // Adjust speed (100ms) for typing
  } else {
    setTimeout(() => {
      quoteElement.textContent = ""; // Clear the quote before displaying the next one
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length; // Move to the next quote
      typeQuote(); // Recursively call to type the next quote
    }, 2000); // Pause for 2 seconds before the next quote
  }
}

// Start typing the first quote when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  typeQuote();
});
