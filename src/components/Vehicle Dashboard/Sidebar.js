import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import logo from "./BYD_SEAL.png";
import './Sidebar.css';

// const CustomBurgerIcon = () => <img style={{width:"50px"}} src={logo} alt="logo" />;

const Sidebar = () => {
  return (
    <Menu>
      {/* <img style={{width:"50px"}} src={logo} alt="logo" /> */}
            <Link to="/" className="menu-links">
            Home
          </Link>
          
          <Link to="/tranactions" className="menu-links">
            Transactions
          </Link>
          <Link to="/query" className="menu-links">
            Query
          </Link>
          <Link to="/dashboard" className="menu-links">
            Dashboard
          </Link>
          <Link to="/vehicle" className="menu-links">
            Vehicle
          </Link>
          <Link to="/buy" className='menu-links'>
            Buy
          </Link>
    </Menu>
  );
};

export default Sidebar;
