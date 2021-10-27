import React, { Component } from 'react'
import ButtonEdit from '../Button/ButtonEdit'
import './DonHang.css'
export default class DonHang extends Component {
    render() {
        return (
            <div className='card'>
                <div className='adjust-margin'>
                <div className='dh-adjust'>
                <div className='dh-column-left'>
                Đơn hàng
                <div>1 sản phẩm</div> 
                </div>
                <div className='dh-column-right'>
                <ButtonEdit/>
                </div>
               
                </div>
                <hr />

                <table className="table">
                    <tbody>
                    <tr>
                        <td>Tạm tính</td>
                        <td className='canh-le-phai-so-tien'>100.000đ</td>
                    </tr>
                    <tr>
                        <td>Phí vận chuyển</td>
                        <td className='canh-le-phai-so-tien'>0đ</td>
                    </tr>
                    <tr>
                        <td>Khuyến mãi</td>
                        <td className='canh-le-phai-so-tien'>0đ</td>
                    </tr>
                    <tr>
                        <td className='thanh-tien-thanh-toan'>Thành tiền</td>
                        <td className='canh-le-phai-so-tien gia-tien-thanh-toan'>100.000đ</td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
        )
    }
}
