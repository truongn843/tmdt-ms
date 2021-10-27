import React from 'react'
import './ButtonThanhToan.css'
export default function ButtonThanhToan (props) {
        return (
            <div>
                <button className='button-thanh-toan' onClick= {props.handlePayment}>THANH TOÁN</button>
            </div>
        )
}
