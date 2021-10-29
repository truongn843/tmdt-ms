import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./productCard.css";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import addToCart  from "../../firebase.js";
import RatingStar from "../RatingStar/RatingStar";


function ProductCard (props) {
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
            
    }, [])
    
    const handleDetail = e => {
        history.push({
            pathname: "/product-detail",
            state: {prdID: props.id}
        })
    }

    const handleAddItem = e => {
        if (localStorage.getItem('userID') === null)
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
                        <RatingStar rating={props.rating} />
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
                                (<span><FontAwesomeIcon icon={faCheck}/> Đã thêm</span>)
                            }
                        </div>                     
                    </div>                         
                </div>
            </div>	  
        </div>		
    );
}

export default ProductCard;