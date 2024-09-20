import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const signOutButton = document.getElementById("signout-btn");
  signOutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      window.location.href = "../Html Files/signIn.html"; // Redirect after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  });

  // Check authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchStudentData(user.uid); // Fetch student data
      fetchResultsData(user.uid); // Fetch results data
      setupEditButton(); // Set up the edit button after fetching data
    } else {
      console.error("No user is signed in.");
      window.location.href = "../Html Files/signIn.html"; // Redirect if no user is signed in
    }
  });
});

// Fetch student data
let currentStudentId = null;

async function fetchStudentData(userId) {
  const studentCollectionRef = collection(db, "student");
  const q = query(studentCollectionRef, where("uid", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    const studentDetailsDiv = document.getElementById("student-details");
    studentDetailsDiv.innerHTML = ""; // Clear existing data

    if (querySnapshot.empty) {
      studentDetailsDiv.innerHTML = "<p>No data found for this user.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      currentStudentId = doc.id; // Save the document ID for later use
      studentDetailsDiv.innerHTML = `
                <p><strong>First Name:</strong> <span id="first-name">${data.firstName}</span></p>
                <p><strong>Last Name:</strong> <span id="last-name">${data.lastName}</span></p>
                <p><strong>Email:</strong> <span id="email">${data.email}</span></p>
                <p><strong>Mobile:</strong> <span id="mobile">${data.mobile}</span></p>
                <p><strong>CNIC:</strong> <span id="cnic">${data.cnic}</span></p>                
                <p><strong>Gender:</strong> <span id="gender">${data.gender}</span></p>
            `;
    });

    const editButton = document.getElementById("edit-btn");
    if (editButton) {
      editButton.classList.remove("hidden"); // Show edit button
    }
  } catch (error) {
    console.error("Error fetching student data: ", error);
  }
}

// Fetch results data
async function fetchResultsData(userId) {
  const resultsCollectionRef = collection(db, "results");
  const q = query(resultsCollectionRef, where("uid", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // Clear existing results

    if (querySnapshot.empty) {
      resultsDiv.innerHTML = "<p>No results found for this user.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const result = doc.data();
      resultsDiv.innerHTML += `
                <div class="border p-4 mb-2 bg-gray-50 rounded shadow">
                    <h3 class="font-semibold">Course: ${result.course}</h3>
                    <p>Total Marks: ${result.totalMarks}</p>
                    <p>Marks: ${result.marks}</p>
                    <p>Grade: ${result.grade}</p> 
                </div>
            `;
    });
  } catch (error) {
    console.error("Error fetching results data: ", error);
  }
}

// Edit functionality
function setupEditButton() {
  const editButton = document.getElementById("edit-btn");
  if (!editButton) return; // If button is not found, exit

  editButton.addEventListener("click", () => {
    const firstName = document.getElementById("first-name").innerText;
    const lastName = document.getElementById("last-name").innerText;
    const cnic = document.getElementById("cnic").innerText;

    // Create a form to edit details (only first name, last name, and CNIC)
    const editForm = `
      <h3 class="font-semibold mb-2">Edit Your Details</h3>
      <input type="text" id="edit-first-name" class="border p-2 w-full mb-2" placeholder="First Name" value="${firstName}">
      <input type="text" id="edit-last-name" class="border p-2 w-full mb-2" placeholder="Last Name" value="${lastName}">
      <input type="text" id="edit-cnic" class="border p-2 w-full mb-2" placeholder="CNIC" value="${cnic}">
      <button id="save-btn" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Save Changes</button>
    `;

    document.getElementById("student-details").innerHTML = editForm; // Replace details with the form

    // Handle save button click
    document.getElementById("save-btn").addEventListener("click", async () => {
      const updatedData = {
        firstName: document.getElementById("edit-first-name").value,
        lastName: document.getElementById("edit-last-name").value,
        cnic: document.getElementById("edit-cnic").value,
      };

      try {
        const studentDocRef = doc(db, "student", currentStudentId);
        await updateDoc(studentDocRef, updatedData);
        alert("Details updated successfully!");
        fetchStudentData(auth.currentUser.uid); // Refresh data
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update details.");
      }
    });
  });
}
