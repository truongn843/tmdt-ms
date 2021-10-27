import React from "react";

function ThongSo({ product }) {
  return (
    <div className="thongso">
      <div className="row">
        <div className="col">Tên sản phẩm</div>
        <div className="col">{product.title}</div>
      </div>
      <div className="row">
        <div className="col">Thương hiệu</div>
        <div className="col">{product.brand}</div>
      </div>
      <div className="row">
        <div className="col">Dung lượng pin</div>
        <div className="col">{product.battery}</div>
      </div>
      <div className="row">
        <div className="col">Chipset</div>
        <div className="col">{product.chipset}</div>
      </div>
      <div className="row">
        <div className="col">Camera sau</div>
        <div className="col">{product.rearCamera}</div>
      </div>
      <div className="row">
        <div className="col">Camera trước</div>
        <div className="col">{product.frontCamera}</div>
      </div>
      <div className="row">
        <div className="col">Bluetooth</div>
        <div className="col">{product.bluetooth}</div>
      </div>
      <div className="row">
        <div className="col">Chip đồ họa (GPU)</div>
        <div className="col">{product.gpu ? product.gpu : "No data"}</div>
      </div>
      <div className="row">
        <div className="col">Màn hinh</div>
        <div className="col">{product.screen ? product.screen : "No data"}</div>
      </div>
    </div>
  );
}

export default ThongSo;
