import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVNJzEZQyY0RCZlkfrqKrKdIggQrx62KU",
  authDomain: "zorogram-e0eea.firebaseapp.com",
  projectId: "zorogram-e0eea",
  storageBucket: "zorogram-e0eea.appspot.com",
  messagingSenderId: "3495535292",
  appId: "1:3495535292:web:3c8c21807fbfd1d3d026b9",
  measurementId: "G-7YFSQZZ72G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function pass(id, iconId) {
  const x = document.getElementById(id);
  const icon = document.getElementById(iconId);
  if (x.type === "password") {
    x.type = "text";
    icon.src = "eye-open.svg";
  } else {
    x.type = "password";
    icon.src = "eye-close.svg";
  }
}

function displayResponse(success, message) {
  document.querySelector('.Page_response').style.display = 'block';
  document.querySelector('.response_msg').innerText = message;
  document.getElementById('response_img1').style.display = success ? 'block' : 'none';
  document.getElementById('response_img2').style.display = success ? 'none' : 'block';
  setTimeout(() => {
    document.querySelector('.Page_response').style.display = 'none';
  }, 3000);
}

// Signup Function with Debug Logs
window.sign_up_user = function (event) {
  event.preventDefault();

  const form = document.getElementById('signupForm');
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('pswd');
  const rePassword = formData.get('re-pswd');

  console.log("Signup: Collected email:", email);
  console.log("Signup: Password and rePassword match?", password === rePassword);

  if (password !== rePassword) {
    console.warn("Signup: Password mismatch!");
    displayResponse(false, 'Passwords do not match.');
    return;
  }

  console.log("Signup: Attempting to create user...");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Signup: User created successfully!", userCredential.user);
      displayResponse(true, 'User registered successfully!');
      form.reset();
    })
    .catch((error) => {
      console.error("Signup Error:", error.code, error.message);
      displayResponse(false, error.message);
    });
}

// Login Function with Debug Logs
window.validateLoginForm = function (event) {
  event.preventDefault();

  const form = document.getElementById('loginForm');
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('pswd');

  console.log("Login: Attempting login with email:", email);
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("Login: Success! User logged in:", userCredential.user);
    displayResponse(true, 'Login successful!');
    form.reset();
    // Redirect to index.html
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000); // Optional short delay to show message
  })
  .catch((error) => {
    console.error("Login Error:", error.code, error.message);
    displayResponse(false, error.message);
  });}
