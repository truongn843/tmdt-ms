import React from "react";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import AddProduct from "../../components/AddProduct/AddProduct";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

function AddProductPage() {

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
          if (doc.data().type !== "admin")
            history.push("/user");
        })
      }
      verifyAdmin();
    }
    else
      history.push("/");
  });

  return (
    <>
      <AdminNavbar />
      <AddProduct />
    </>
  );
}

export default AddProductPage;
