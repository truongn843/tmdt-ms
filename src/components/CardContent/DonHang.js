import React, { Component } from 'react'
import './DonHang.css'
export default function DonHang (props) {
    return (
        <div className='card'>
            <div className='adjust-margin'>
            <div className='dh-adjust'>
            <div className='dh-column-left'>
            <span id="dh-title">Giá trị đơn hàng</span>
            </div>
            </div>
            <hr />

            <table className="table">
                <tbody>
                <tr>
                    <td>Tạm tính</td>
                    <td className='canh-le-phai-so-tien'>
                    {Number(props.estimated).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                    </td>
                </tr>
                <tr>
                    <td>Phí vận chuyển</td>
                    <td className='canh-le-phai-so-tien'>
                        {   props.deliveryFee === 0 ? ("Miễn phí") :
                            (<span>
                                {Number(props.deliveryFee).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>)
                        }
                    </td>
                </tr>
                <tr>
                    <td>Khuyến mãi</td>
                    <td className='canh-le-phai-so-tien'>
                        - {Number(props.voucherDiscount).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </td>
                </tr>
                <tr>
                    <td className='thanh-tien-thanh-toan'>Thành tiền</td>
                    <td className='canh-le-phai-so-tien gia-tien-thanh-toan'>
                        {Number(props.total).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    )
}
