import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import GuestNavbar from "../../components/NavBar/GuestNavbar";
import {app} from "../../firebase";
import {getFirestore, doc, getDoc}from "firebase/firestore"
import UserNavbar from "../../components/NavBar/UserNavbar";
import AdminNavbar from "../../components/NavBar/AdminNavbar";
import ProductDetail from "../../components/ProductDetail/ProductDetail";

function ProductPage(props) {
  const [navbar, setNavbar] = useState({bar: null});
  const [prdID, setPrdID] = useState({value: null});
  const userID = localStorage.getItem('userID');
  let history = useHistory();


  const db = getFirestore(app);
  const verifyAdmin = async () => {
    const userRef = doc(db, 'users', userID);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()){
      if (userSnap.data().type === "admin")
        setNavbar({bar: (<AdminNavbar/>)})
      else 
        setNavbar({bar: (<UserNavbar/>)})
    }
  }
  
  useEffect(()=>{

    if (userID)
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
