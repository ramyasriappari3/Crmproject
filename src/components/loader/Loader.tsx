import React from 'react'
import "./Loader.scss"

const mindlerIcon = `https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/myHomes_icon.png`;

const Loader = () => {
    return (
        <div className="spinner">
            <div className="spinner-icon">
                <img src={mindlerIcon} alt="loader" />
            </div>
        </div>
    )
}

export default Loader