import React from "react";

function ThongTin({ product }) {
  return (
    <div>
      <div className="product-name">{product.title}</div>
      <div className="product-rate">{product.rating}</div>
      <div className="product-decription">{product.description}</div>
      <div className="product-price-discount">
        {product.discounted + product.currency}
      </div>
      <div className="product-price">{product.price + product.currency}</div>
      <div className="button-group">
        <button className="btn buy-now">Mua ngay</button>
        <button className="btn add-to-cart"> + Giỏ hàng</button>
      </div>
    </div>
  );
}

export default ThongTin;
