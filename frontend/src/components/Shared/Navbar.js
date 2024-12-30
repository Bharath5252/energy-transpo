import React from 'react'
import {Link} from 'react-router-dom';
import Sidebar from '../Vehicle Dashboard/Sidebar';

const Navbar = () => {
  return (
    <div>
      <Sidebar/>
      <header className="header">
          <div className="user-info" style={{alignItems:'center'}}>
            <input style={{ marginLeft: "60px", height:'2rem'}} type="text" placeholder="Give a voice command" />
            <Link to="/home" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Home</Link>
            <Link to="/viewTxn" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Transactions</Link>
            <Link to="/vehicleDashboard/add" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Add Vehicle</Link>
          </div>
          <div className="user-info">
            <span>Hello, {userDetails?.user?.username?userDetails?.user?.username:"User"}</span>
            <span>{date}</span>
          </div>
        </header>
      <div className="menu-bar">
        <div className="menu-l-link">
          {/* <Link to="/admin" className="menu-links">
          </Link> */}

          <Link to="/home" className="menu-links">
            Home
          </Link>
          
          <Link to="/viewTxn" className="menu-links">
            Transactions
          </Link>

          <Link to="/userTxn" className="menu-links">
            User Transactions
          </Link>

          <Link to="/query" className="menu-links">
            Query
          </Link>
          <Link to="/vehicleDashboard" className="menu-links">
            Vehicle Dashboard
          </Link>
          
        </div>
        <div className="menu-r-link">
          <Link to="/profile" className="menu-links">
            Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar