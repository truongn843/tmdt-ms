import React, {useState, useEffect} from "react";
import "./productCard.css";

function ProductCard (props) {
    const [discount, setDiscount] = useState({status: false, value: null});
    const [price, setPrice] = useState({status: false, value: null});
    useEffect(() => {
        if (props.discountFrom !== ""){
            setDiscount({status: true, value: props.discountFrom})
        }
        if (props.price !== "Hết hàng"){
            setPrice({status: true, value: props.price})
        }
    }, [])
    
        //setDiscount({status: true, value: props.discountedFrom})
    return (
        <div id="product-card">
            <div id="product-front">
                <div className="img-container">
                    <img src={props.imgURL} alt="" 
                        width="90%"
                        height="50%"
                    />
                </div>
                <div className="stats">        	
                    <div className="stats-container">
                        <div className="product_name">{props.title}</div> 
                        { discount.status === true ? (
                            <div className="product_discounted_price">{props.discountFrom}.000₫</div>
                        ):(
                            <br/>
                        )}
                        { price.status === true ? (
                            <div className="product_price">{props.price}.000₫</div>
                        ):(
                            <div className="product_price">Tạm hết</div>
                        )}
                        <div id="add_to_cart">Thêm vào giỏ</div>                     
                    </div>                         
                </div>
            </div>	  
        </div>		
    );
}

export default ProductCard;