import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Search.css";
export default function Search (props) {

    const searchTrigger = (e) => {
        props.parentCallBack(e.target.search.value);   
        e.preventDefault(); 
    }

    return <div className="nav-search">
    <form onSubmit={searchTrigger}>
        <FontAwesomeIcon icon="search"></FontAwesomeIcon>
        <input
        type="text"
        name="search"
        className="nav-search-input"
        placeholder="Tìm kiếm..."
        />
    </form>
    
  </div>
}