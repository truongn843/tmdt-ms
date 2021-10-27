import React, { Component } from 'react'
import './HinhThucThanhToan.css'
import cod from './img/icon-payment-method-cod.jpg'
import momo from './img/icon-payment-method-mo-mo.jpg'
import atm from './img/icon-payment-method-atm.jpg'

export default class HinhThucThanhToan extends Component {
    render() {
        return (
            <div className='card'>
                <div className='adjust-margin'>
                <div>
                    <input className='radio-fake' type="radio" value="nhanTaiCuaHang" name="hinhThucThanhToan" /> 
                    <img className='icon-payment' src={cod} alt='cod-payment'/>
                    <div className='khoang-cach'></div>Thanh toán khi nhận hàng
                </div>
                <div>
                    <input className='radio-fake' type="radio" value="grab" name="hinhThucThanhToan" /> 
                    <img src={momo} alt='momo-payment'/>
                    <div className='khoang-cach'></div>Thanh toán bằng ví Momo
                </div>
                <div>
                    <input className='radio-fake' type="radio" value="giaoHangNhanh" name="hinhThucThanhToan" />
                    <img src={atm} alt='atm-payment'/>
                    <div className='khoang-cach'></div>Thanh toán bằng thẻ nội địa / ATM
                </div>
                </div>
            </div>
        )
    }
}
