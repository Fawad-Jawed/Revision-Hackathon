import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHGDb4o7pJZw3eOugSaVCEFiTtzKd7viI",
  authDomain: "class-1-39b59.firebaseapp.com",
  projectId: "class-1-39b59",
  storageBucket: "class-1-39b59.appspot.com",
  messagingSenderId: "401024482096",
  appId: "1:401024482096:web:f7825fe42b48fa9f2326f5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const btn2 = document.getElementById("btn");
btn2.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const userType = document.querySelector('input[name="select"]:checked').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Sign In successful");

      // Redirect based on user type
      if (userType === "admin") {
        window.location.href = `../Html Files/resultForm.html?uid=${user.uid}`;
      } else if (userType === "student") {
        window.location.href = "../Html Files/detail.html";
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in: ", errorCode, errorMessage);
      alert("Sign In failed. Please check your credentials.");
    });
});
