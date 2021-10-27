// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAx8rbh1c8b1rRjX8qRcq9Vw4If7v_uoPU",
  authDomain: "tmdt-project-f2b6d.firebaseapp.com",
  databaseURL: "https://tmdt-project-f2b6d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tmdt-project-f2b6d",
  storageBucket: "tmdt-project-f2b6d.appspot.com",
  messagingSenderId: "1055592252236",
  appId: "1:1055592252236:web:0b71cb32778743c708c5e9",
  measurementId: "G-76716E7GGW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);