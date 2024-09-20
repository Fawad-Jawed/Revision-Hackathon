import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import {
  getAuth,
  signOut,
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
const db = getFirestore(app);
const auth = getAuth(app);

const signOutButton = document.getElementById("signout-btn");
signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
    window.location.href = "../Html Files/signIn.html"; // Redirect to sign-in page after sign out
  } catch (error) {
    console.error("Error signing out: ", error);
  }
});

async function fetchStudents() {
  const studentsContainer = document.getElementById("students-container");
  const querySnapshot = await getDocs(collection(db, "student"));

  let serialNumber = 1; // Initialize serial number
  querySnapshot.forEach((doc) => {
    const student = doc.data();
    const studentDiv = document.createElement("div");
    studentDiv.className = "border border-gray-300 p-4 rounded mb-4";

    studentDiv.innerHTML = `
            <p><strong>Serial No:</strong> ${serialNumber}</p>
            <p><strong>First Name:</strong> ${student.firstName}</p>
            <p><strong>Last Name:</strong> ${student.lastName}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Mobile:</strong> ${student.mobile}</p>
            <p><strong>CNIC:</strong> ${student.cnic}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <button class="bg-red-600 text-white py-1 px-2 rounded mt-2" data-id="${doc.id}">Delete Student</button>
        `;

    studentsContainer.appendChild(studentDiv);
    serialNumber++; // Increment serial number
  });
}

async function fetchResults() {
  const resultsContainer = document.getElementById("results-container");
  const querySnapshot = await getDocs(collection(db, "results"));

  let serialNumber = 1; // Initialize serial number
  querySnapshot.forEach((doc) => {
    const result = doc.data();
    const resultDiv = document.createElement("div");
    resultDiv.className = "border border-gray-300 p-4 rounded mb-4";

    resultDiv.innerHTML = `
            <p><strong>Serial No:</strong> ${serialNumber}</p>
            <p><strong>Course:</strong> ${result.course}</p>
            <p><strong>Student ID:</strong> ${result.studentId}</p>
            <p><strong>Marks:</strong> ${result.marks}</p>
            <p><strong>Total Marks:</strong> ${result.totalMarks}</p>
            <p><strong>Grade:</strong> ${result.grade}</p>
            <button class="bg-red-600 text-white py-1 px-2 rounded mt-2" data-id="${doc.id}">Delete Result</button>
        `;

    resultsContainer.appendChild(resultDiv);
    serialNumber++; // Increment serial number
  });
}

async function deleteResult(id) {
  await deleteDoc(doc(db, "results", id));
  window.location.reload(); // Refresh to show updated results
}

async function deleteStudent(id) {
  await deleteDoc(doc(db, "student", id));
  window.location.reload(); // Refresh to show updated students
}

document
  .getElementById("results-container")
  .addEventListener("click", (event) => {
    if (
      event.target.tagName === "BUTTON" &&
      event.target.textContent.includes("Delete Result")
    ) {
      const id = event.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this result?")) {
        deleteResult(id);
      }
    }
  });

document
  .getElementById("students-container")
  .addEventListener("click", (event) => {
    if (
      event.target.tagName === "BUTTON" &&
      event.target.textContent.includes("Delete Student")
    ) {
      const id = event.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this student?")) {
        deleteStudent(id);
      }
    }
  });

// Fetch students and results when the page loads
fetchStudents();
fetchResults();
