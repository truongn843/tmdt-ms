import React, { useState, useEffect } from "react";
import arrow from "../../assert/arrow.png"
import "../reset.css";
import "./filter-bar.css";
import ProductCard from "../ProductCard/productCard";
import {app} from "../../firebase";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import "./product.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons"


function ProductList(props){
  const [filter, setFilter] = useState({onSale: false});
  const [sort, setSort] = useState({price: null, battery: null, screenWidth: null, rating: null});
  const [displayProduct, setDisplayProduct] = useState({list: []});

  const fetchData = async () => {
    const db = getFirestore(app);
    const queryOptions = [];

    for (let sortField in sort){
      if (sort[sortField])  queryOptions.push(orderBy(sortField, sort[sortField]));
    }
    
    const q = query(collection(db,'products'), ...queryOptions);

    const productCards = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc)=>{
      if (!filter.onSale || doc.data().discountFrom !== '')
      productCards.push(<ProductCard 
        id={doc.id}
        title={doc.data().title}
        price={doc.data().price}
        discountFrom={doc.data().discountFrom}
        imgURL={doc.data().imgURL}
        rating={doc.data().rating === "n/a" ? 0 : doc.data().rating}
      />);
    });

    return productCards;
  }

  useEffect(() => {
    fetchData().then((result)=>{
      setDisplayProduct({list: result})
    });
  }, [])

  useEffect(() => {;
    setDisplayProduct({list: []});
    fetchData().then((result)=>{
      setDisplayProduct({list: result})
    });
  }, [sort])

  useEffect(()=>{
    setDisplayProduct({list: []});
    fetchData().then((result)=>{
      setDisplayProduct({list: result})
    });
  }, [filter])

  const setSortNull = () => {
    let nullsort = sort;
    for (let field in nullsort) nullsort[field] = null;
    setSort(nullsort);
  }

  const sortPrice = (e) => {
    let pricesort = sort.price;
    setSortNull();
    switch(pricesort){
      case null: setSort({...sort, price: 'asc'});break;
      case 'asc': setSort({...sort, price: 'desc'});break;
      case 'desc': setSort({...sort, price: null});break;
      default:;
    }
  }

  const sortBattery = (e) => {
    let batterysort = sort.battery;
    setSortNull();
    switch(batterysort){
      case null: setSort({...sort, battery: 'asc'});break;
      case 'asc': setSort({...sort, battery: 'desc'});break;
      case 'desc': setSort({...sort, battery: null});break;
      default:;
    }
  }

  const sortScreenWidth = (e) => {
    let screenWidthsort = sort.screenWidth;
    setSortNull();
    switch(screenWidthsort){
      case null: setSort({...sort, screenWidth: 'asc'});break;
      case 'asc': setSort({...sort, screenWidth: 'desc'});break;
      case 'desc': setSort({...sort, screenWidth: null});break;
      default:;
    }
  }

  const sortRating = (e) => {
    let ratingsort = sort.rating;
    setSortNull();
    switch(ratingsort){
      case null: setSort({...sort, rating: 'asc'});break;
      case 'asc': setSort({...sort, rating: 'desc'});break;
      case 'desc': setSort({...sort, rating: null});break;
      default:;
    }
  }

  const resetSort = (e) => {
    setSortNull();
    fetchData().then((result)=>{
      setDisplayProduct({list: result})
    });
  }

  return (
    <div>

    <div className="product-container"> 
    <div className="filter-bar">
      <div className="group-select">
        <div className="btn sort-btn active-sort" onClick={resetSort}>Reset bộ lọc</div>
        {/* Giá */}
        <div className={'btn sort-btn sort-option ' + (sort.price ? 'active-sort':'')} onClick={sortPrice}>Giá 
        <div className="sort-arrow">
          { sort.price === "asc" &&
            <FontAwesomeIcon icon={faAngleUp}/>
          }
          { sort.price === "desc" &&
            <FontAwesomeIcon icon={faAngleDown}/>
          }
        </div>
        </div>
        <div className={'btn sort-btn sort-option ' + (sort.battery ? 'active-sort':'')} onClick={sortBattery}>Dung lượng pin 
        <div className="sort-arrow">
          { sort.battery === "asc" &&
            <FontAwesomeIcon icon={faAngleUp}/>
          }
          { sort.battery === "desc" &&
            <FontAwesomeIcon icon={faAngleDown}/>
          }
        </div>
        </div>
        <div className={'btn sort-btn sort-option ' + (sort.screenWidth ? 'active-sort':'')} onClick={sortScreenWidth}>Kích cỡ màn hình 
        <div className="sort-arrow">
          { sort.screenWidth === "asc" &&
            <FontAwesomeIcon icon={faAngleUp}/>
          }
          { sort.screenWidth === "desc" &&
            <FontAwesomeIcon icon={faAngleDown}/>
          }
        </div>
        </div>
        <div className={'btn sort-btn sort-option ' + (sort.rating ? 'active-sort':'')} onClick={sortRating}>Đánh giá 
        <div className="sort-arrow">
          { sort.rating === "asc" &&
            <FontAwesomeIcon icon={faAngleUp}/>
          }
          { sort.rating === "desc" &&
            <FontAwesomeIcon icon={faAngleDown}/>
          }
        </div>
        </div>
      </div>
      <div className="group-result">
        <div className="result">{displayProduct.list.length} sản phẩm</div>
        <div className="form-check check">
            <input
              className="form-check-input "
              type="checkbox"
              id="checkOnSale"
              name="checkOnSale"
              onClick={e=>setFilter({...filter, onSale: !filter.onSale})}
              checked={filter.onSale}
            />
            <label className="form-check-label" for="checkOnSale" >
              Giảm giá
            </label>
        </div>

      </div>
    </div>
      <div className="product-container-label">Điện thoại nổi bật</div>
      {displayProduct.list}
    </div>
    </div>
  );
}
export default ProductList;