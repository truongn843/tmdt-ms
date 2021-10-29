import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import GuestNavbar from "../../components/NavBar/GuestNavbar";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {app} from "../../firebase";
import {getFirestore, query, collection, where, getDocs, doc, getDoc}from "firebase/firestore"
import UserNavbar from "../../components/NavBar/UserNavbar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import ProductDetail from "../../components/ProductDetail/ProductDetail";

function ProductPage(props) {
  const [navbar, setNavbar] = useState({bar: null});
  const [prdID, setPrdID] = useState({value: null});
  const auth = getAuth(app);
  const email = localStorage.getItem('email');
  let history = useHistory();


  const db = getFirestore(app);
  const verifyAdmin = async () => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
      if (doc.data().type === "admin")
        setNavbar({bar: (<AdminNavbar/>)})
      else 
        setNavbar({bar: (<UserNavbar/>)})
    })
  }

  // onAuthStateChanged(auth, (user)=>{
  //   if (user){}
  //   else 
  //     setNavbar({bar: (<GuestNavbar/>)})
  // });
  
  useEffect(()=>{

    if (email !== null)
      verifyAdmin();
    else {setNavbar({bar: (<GuestNavbar/>)})};
    try{
      setPrdID({value: props.location.state.prdID});
    } catch (error) {
      history.push("/");
    }
  },[])

  return (
    <div>
      {navbar.bar}
      {prdID.value !== null &&
        <ProductDetail
          id={prdID.value}
        />
      }
    </div>
  );
}

export default ProductPage;
