import React from "react";
import UserNavbar from "../../components/NavBar/UserNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import "./homepage.css";

function HomePageUser() {
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
          if (doc.data().type === "admin")
            history.push("/admin");
        })
      }
      verifyAdmin();
    }
    else
      history.push("/");
  });

  document.title = "BK Phone";

  return (
    <div>
      <UserNavbar />
      <ProductList />
    </div>
  );
}

export default HomePageUser;
