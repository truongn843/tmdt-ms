import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./productCard.css";
import { faCheck, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from "react-router";
import addToCart  from "../../firebase.js";


function ProductCard (props) {
    let rating = props.rating;
    const [starDisplay, setSD] = useState({list: []});
    const [discount, setDiscount] = useState({status: false, value: null});
    const [price, setPrice] = useState({status: false, value: null});
    const [addSuccess, setAdd] = useState({status: false});
    let history = useHistory();


    useEffect(() => {
        if (props.discountFrom !== ""){
            setDiscount({status: true, value: props.discountFrom})
        }
        if (props.price !== "Hết hàng"){
            setPrice({status: true, value: props.price})
        }
        let remainingStar = 5;
        for (let i = 0; i < Math.floor(rating); i++, remainingStar--)
            setSD(prev=>({
                list: [
                    ...prev.list,
                    (<div className="star"><FontAwesomeIcon icon={faStar}/></div>)
                ]
           }));
        if ((Math.ceil(rating) !== Math.floor(rating)) && (Math.round(5 - rating) === Math.floor(5 - rating))){
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
            
    }, [])
    
    const handleDetail = e => {
        console.log("ngu");
    }

    const handleAddItem = e => {
        if (localStorage.getItem('email') === null)
            history.push({
                pathname: "/login",
                state: {msg: "Trước hết bạn cần đăng nhập."}
            });
        else {
            setAdd({status: true});
            setTimeout(()=>setAdd({status: false}),1500);
            addToCart(props.id, props.title, props.price, props.imgURL);
        }
        
        
    }

    return (
        <div id="product-card">
            <div id="product-front">
                <div className="img-container" onClick={handleDetail}>
                    <img src={props.imgURL} alt="" 
                        width="90%"
                        height="50%"
                    />
                </div>
                <div className="stats">        	
                    <div className="stats-container">
                        <div className="product_name">{props.title}</div> 
                        <div className="stars">
                            {starDisplay.list}
                        </div>
                        { discount.status === true ? (
                            <div className="product_discounted_price">
                                {Number(props.discountFrom).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </div>
                        ):(
                            <br/>
                        )}
                        { price.status === true ? (
                            <div className="product_price">
                                {Number(props.price).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </div>
                        ):(
                            <div className="product_price">Tạm hết hàng</div>
                        )}
                        <div id="add_to_cart" onClick={handleAddItem}>
                            {
                                addSuccess.status === false ?
                                (<span>Thêm vào giỏ</span>):
                                (<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>)
                            }
                        </div>                     
                    </div>                         
                </div>
            </div>	  
        </div>		
    );
}

export default ProductCard;