import React from "react";
import { useHistory } from "react-router";
import Navbar from "../../components/NavBar/AdminNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { app } from "../../firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

import "./homepage.css";

function HomePageGuest() {
  let history = useHistory();
  const auth = getAuth(app);
  let email = localStorage.getItem('email');

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
          if (doc.data().type === "user")
            history.push("/user");
        })
      }
      verifyAdmin();
    }
    else
      history.push("/");
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
