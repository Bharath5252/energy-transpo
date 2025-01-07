import React,{useEffect,useState} from 'react'
import {connect} from 'react-redux';
import Sidebar from '../Vehicle Dashboard/Sidebar';
import { getUserDetails } from '../../Redux/Actions';
import { Link } from 'react-router-dom';
import Search from '../Shared/Search/Search';

const HomeNavbar = (props) => {
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
    if(!userDetails.user)props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
  },[])

  return (
    <div>
        <Sidebar/>
        <header className="header">
          <div className="user-info" style={{alignItems:'center'}}>
            <Search />
            <Link to="/home" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Home</Link>
            <Link to="/homeGrid" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>New Home Mangement Request</Link>
            <Link to="/homeGrid/pending" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Pending Home Mangement Requests</Link>
            <Link to="/homeGrid/past" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Home Mangement History</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavbar)