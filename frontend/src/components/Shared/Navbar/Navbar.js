import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../../Vehicle Dashboard/Sidebar';
import { getUserDetails } from '../../../Redux/Actions';
import Search from '../Search/Search';

const Navbar = (props) => {
  const { userDetails } = props;
  const [date, setDate] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState([]);

  const prompts = [
    { name: "Home", link: "/home" },
    { name: "Transactions", link: "/transactions" },
    { name: "Vehicle Dashboard", link: "/vehicleDashboard" },
    { name: "Vehicle Inventory", link: "/vehicleDashboard/inventory" },
    { name: "Profile", link: "/profile" },
    { name: "Wallet", link: "/home" },
    { name: "Add a vehicle", link: "/vehicleDashboard/add"},
    { name: "Posts", link: "/transactions/post"},
    { name: "Pending Transactions", link: "/transactions/pending"},
    { name: "Transactions History", link: "/transactions/past"},
    { name: "Past Transactions", link: "/transactions/past"},
  ];

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const formattedDate = `${day} ${month}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    if (!userDetails) props.getUserDetails({ params: { userId: localStorage.getItem("userId") } });
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input === "") {
      setFilteredPrompts([]);
    } else {
      const matches = prompts.filter((prompt) =>
        prompt.name.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredPrompts(matches);
    }
  };

  return (
    <div>
      <Sidebar />
      <header className="header">
        <div className="user-info" style={{ alignItems: 'center' }}>
          <Search />
          <Link to="/home" style={{ color: 'black', textDecoration: 'none', marginLeft: '1rem' }}>Home</Link>
          <Link to="/transactions" style={{ color: 'black', textDecoration: 'none', marginLeft: '1rem' }}>Transactions</Link>
          {/* <Link to="/query" style={{ color: 'black', textDecoration: 'none', marginLeft: '1rem' }}>Query</Link> */}
          <Link to="/vehicleDashboard/inventory" style={{ color: 'black', textDecoration: 'none', marginLeft: '1rem' }}>Vehicle Inventory</Link>
          {/* <Link to="/wallet" style={{ color: 'black', textDecoration: 'none', marginLeft: '1rem' }}>Wallet</Link> */}
        </div>
        <div className="user-info">
          <Link to='/profile' style={{ color: 'black', textDecoration: 'none', marginLeft: '1rem' }}>Hello, {localStorage.getItem("userName") ? localStorage.getItem("userName") : "User"}</Link>
          <span>{date}</span>
        </div>
      </header>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  error: state.error,
  data: state.data,
  userDetails: state.userDetails,
});

const mapDispatchToProps = {
  getUserDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
