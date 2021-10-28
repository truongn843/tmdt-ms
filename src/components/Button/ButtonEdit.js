import React from 'react';
import './ButtonEdit.css';
import { useHistory } from "react-router-dom";

function ButtonEdit(props){
    let history = useHistory();
    const handleClick = e => {
        history.push(props.url);
    }
    return (
        <div>
            <button 
                type="button" 
                className="btn btn-outline-edit"
                onClick={handleClick}
            >Đổi địa chỉ</button>
        </div>
    )
}

export default ButtonEdit;
