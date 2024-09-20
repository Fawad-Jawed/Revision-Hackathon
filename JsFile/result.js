import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHGDb4o7pJZw3eOugSaVCEFiTtzKd7viI",
  authDomain: "class-1-39b59.firebaseapp.com",
  projectId: "class-1-39b59",
  storageBucket: "class-1-39b59.appspot.com",
  messagingSenderId: "401024482096",
  appId: "1:401024482096:web:f7825fe42b48fa9f2326f5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

const submit = document.getElementById("sub");
submit.addEventListener("click", async function () {
  const course = document.getElementById("course").value;
  const studentId = document.getElementById("student-id").value;
  const marks = document.getElementById("marks").value;
  const totalMarks = document.getElementById("total-marks").value;
  const grade = document.getElementById("grade").value;

  const resultData = {
    uid, // Add UID here
    course,
    studentId,
    marks,
    totalMarks,
    grade,
  };

  try {
    const docRef = await addDoc(collection(db, "results"), resultData);
    alert("Result Submitted successfully!");
    document.getElementById("registration-form").reset(); // Reset form fields
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Registration failed. Please try again.");
  }
});
