import React from 'react'
import {Link} from 'react-router-dom';

const TransactionNavbar = () => {
  return (
    <div>
      <div className="menu-bar">
        <div className="menu-l-link">
          {/* <Link to="/admin" className="menu-links">
          </Link> */}

          <Link to="/tranactions" className="menu-links">
            New Transaction
          </Link>
          <Link to="/transactions/current" className="menu-links">
            Current Transactions
          </Link>
          <Link to="/transactions/past" className="menu-links">
            Past Transactions
          </Link>
          <Link to="/dashboard" className="menu-links">
            Dashboard
          </Link>
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

export default TransactionNavbar