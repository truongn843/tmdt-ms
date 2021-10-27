import React, { Component } from 'react'
import './HinhThucGiaoHang.css'
export default class HinhThucGiaoHang extends Component {
    render() {
        return (
            <div className='card'>
                <div className='adjust-margin'>
                <div>
                <div className="card text-left phi-giao-hang">
                    <img className="card-img-top" src="holder.js/100px180/" alt="" />
                    <div className="card-body">
                        Miễn phí
                    </div>
                    </div>
                <input className='radio-fake' type="radio" value="nhanTaiCuaHang" name="hinhThucGiaoHang" /> Nhận tại của hàng
                
                </div>
                
                <div>
                <input className='radio-fake' type="radio" value="grab" name="hinhThucGiaoHang" /> Grab
                
                </div>
                <div>
                <input className='radio-fake' type="radio" value="giaoHangNhanh" name="hinhThucGiaoHang" /> Giao hàng nhanh  
                </div>
                <div>
               
                </div>
                </div>
            </div>
        )
    }
}
