import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import GuestNavbar from "../../components/NavBar/GuestNavbar";
import ProductList from "../../components/ProductList/ProductList";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import Footer from "../../components/Footer/Footer"

import "./homepage.css";

function HomePageGuest() {
  let history = useHistory();
  const auth = getAuth(app);
  const userID = localStorage.getItem('userID');
  const [search, setSearch] = useState({value: null});

  onAuthStateChanged(auth, (user)=> {
    if(user){
      const verifyAdmin = async () => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userID);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().type === "admin")
          history.push("/admin");
        else
          history.push("/user");
      }
      if (userID) verifyAdmin();
    }
    else localStorage.clear();
  });

  document.title = "BK Phone";

  const handleSearchCallback = (searchData) => {
    setSearch({value: searchData})
  }
  return (
    <div>
      <GuestNavbar parentCallBack={handleSearchCallback}/>
      <ProductList search={search.value}/>
      <Footer/>
    </div>
  );
}

export default HomePageGuest;
