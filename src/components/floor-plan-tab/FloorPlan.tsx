import React from 'react'
import './FloorPlan.scss'
const FloorPlan = () => {
    return (
        <div className='floor-plan-cont' >
            <p>Floor Plan</p>
            <div className="floor-plans">
                <div>
                    <img src="/images/floor-plan-1.png" alt="" />
                </div>
                <div>
                    <img src="/images/floor-plan-3.png" alt="" />
                </div>
                <div>
                    <img src="/images/floor-plan-2.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default FloorPlan