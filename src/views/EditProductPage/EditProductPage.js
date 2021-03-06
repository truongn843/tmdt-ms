import React from "react";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import { useHistory } from "react-router";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import EditProduct from "../../components/EditProduct/EditProduct";
import Footer from "../../components/Footer/Footer";

function EditProductPage() {

  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().type !== "admin")
          history.push("/user");
      }
      if (userID) verifyAdmin();
    }
    else
      localStorage.clear();
  });

  return (
    <>
      <AdminNavbar/>
      <EditProduct/>
      <Footer/>
    </>
  );
}

export default EditProductPage;
