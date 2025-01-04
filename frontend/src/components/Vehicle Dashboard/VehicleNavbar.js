import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Sidebar from './Sidebar';
import {getUserDetails} from '../../Redux/Actions';

const VehicleNavbar = (props) => {
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
            <input style={{ marginLeft: "60px", height:'2rem'}} type="text" placeholder="Give a voice command" />
            <Link to="/vehicleDashboard" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Vehicle Dashboard</Link>
            <Link to="/vehicleDashboard/inventory" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Vehicle Inventory</Link>
            <Link to="/vehicleDashboard/add" style={{color:'black', textDecoration:'none', marginLeft:'1rem'}}>Add Vehicle</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(VehicleNavbar)