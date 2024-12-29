import React from 'react'
import {Link} from 'react-router-dom';

const Buy = () => {
  return (
    <div>
      <div className="menu-bar">
        <div className="menu-l-link">
          {/* <Link to="/admin" className="menu-links">
          </Link> */}

          <Link to="/" className="menu-links">
            Home
          </Link>
          
          <Link to="/transactions" className="menu-links">
            Transactions
          </Link>
          <Link to="/query" className="menu-links">
            Query
          </Link>
          <Link to="/vehicleDashboard" className="menu-links">
            Vehicle Dashboard
          </Link>
          <Link to="/buy" className='menu-links'>
            Buy
          </Link>
          {/* <Link to="/sell" className='menu-links'>
            Sell
          </Link> */}
        </div>
        <div className="menu-r-link">
          <Link to="/login" className="menu-links">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Buy;
