import React,{useEffect,useState} from 'react'
import {connect} from 'react-redux';
import Sidebar from '../Shared/Sidebar/Sidebar';
import { getUserDetails } from '../../Redux/Actions';
import { Link } from 'react-router-dom';
import Search from '../Shared/Search/Search';

const TransactionNavbar = (props) => {
    const {userDetails} = props;
    const [date,setDate] = useState();

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const formattedDate = `${day} ${month}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    if(!userDetails)props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
  },[])

  return (
    <div>
        <Sidebar/>
        <header className="header">
          <div className="user-info" style={{alignItems:'center'}}>
            <Search />
            <Link to="/home" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Home</Link>
            <Link to="/transactions" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>New Request</Link>
            <Link to="/transactions/post" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Posts</Link>
            <Link to="/transactions/pending" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Pending Transactions</Link>
            <Link to="/transactions/past" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Transactions History</Link>
            <Link to="/dashboard" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Dashboard</Link>
          </div>
          <div className="user-info">
            <Link to='/profile' style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Hello, {localStorage.getItem("userName")?localStorage.getItem("userName"):"User"}</Link>
            <span>{date}</span>
          </div>
        </header>
    </div>
  )
}

const mapStateToProps = (state) => ({
    isLoading: state.isLoading,
    error: state.error,
    data: state.data,
    userDetails: state.userDetails,
})

const mapDispatchToProps =  {
  getUserDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionNavbar)