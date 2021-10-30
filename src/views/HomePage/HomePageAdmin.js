import React from "react";
import { useHistory } from "react-router";
import Navbar from "../../components/NavBar/AdminNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { app } from "../../firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"

import "./homepage.css";

function HomePageGuest() {
  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().type === "user")
            history.push("/user");
      }
      if (userID) verifyAdmin();
    }
    else{
      history.push("/");
      localStorage.clear();
    }
      
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };
  document.title = "BK Phone";
  return (
    <div>
      <Navbar handleLogout={handleLogout} />
      <ProductList />
    </div>
  );
}

export default HomePageGuest;
