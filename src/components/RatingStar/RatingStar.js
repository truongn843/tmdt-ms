import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./RatingStar.css";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";

export default function RatingStar (props) {
    const [starDisplay, setSD] = useState({list: []});

    useEffect(()=>{
        let remainingStar = 5;
        let rating = props.rating;
        for (let i = 0; i < Math.floor(rating); i++, remainingStar--)
            setSD(prev=>({
                list: [
                    ...prev.list,
                    (<div className="star"><FontAwesomeIcon icon={faStar}/></div>)
                ]
            }));
        if (5 - Math.floor(rating) - Math.floor(5 - rating) > 0){
            remainingStar--;
            setSD(prev=>({
                list: [
                    ...prev.list,
                    (<div className="star"><FontAwesomeIcon icon={faStarHalfAlt}/></div>)
                ]
            }));
        }
        for(let i = 0; i <  remainingStar; i++)
            setSD(prev=>({
                list: [
                    ...prev.list,
                    (<div className="star"><FontAwesomeIcon icon={faStarReg}/></div>)
                ]
            }));
            
    },[]);

    return (
    <div>
        {starDisplay.list} <span className="rating-value">{props.rating}</span>
    </div>
    )
}