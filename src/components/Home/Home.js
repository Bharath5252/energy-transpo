import React,{useEffect,useState} from 'react'
import {connect} from 'react-redux';
import Navbar from "../Shared/Navbar/Navbar";
import {getUserDetails} from '../../Redux/Actions';

const Home = (props) => {
  const {userDetails} = props;
  useEffect(()=>{
    props.getUserDetails({params:{userId:localStorage.getItem("userid")}})
  },[])
  return (
    <div>
      <Navbar />
      <div>Welcome to Home</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)