import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux';
import Navbar from '../Shared/Navbar/Navbar';
import {toggleSnackbar, getUserDetails, createHelp} from '../../Redux/Actions';
import { Button, IconButton, InputAdornment, InputBase, TextField, Typography } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const HelpnSupport = (props) => {
  const [searchBarValue,setSearchBarValue] = useState("");
  const {userDetails} = props;

  useEffect(()=>{
    if(!userDetails.user)props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
  },[])

  const handleSubmit = () => {
    if(searchBarValue===""){
        props.toggleSnackbar({open:true, message:'Please enter some query', status:false});
        return;
    }
    const payload = {
        query:searchBarValue,
        userId:localStorage.getItem("userId"),
    }
    props.createHelp({data:payload}).then((response)=>{
        if(response.payload.status===200){
          setSearchBarValue("");
        }
    })
  }

  return (
    <div>
      <Navbar/>
      <div style={{margin:"0", display:"flex", flexDirection:"column", gap:"20px", width:"-webkit-fill-available",justifyContent:'center',alignItems:'center', backgroundColor:'#373a47', minHeight:'20rem'}}>
        <Typography style={{color:'white', fontSize:'44px', fontWeight:'800'}}>How can we help you?</Typography>
        <TextField
            required
            id="outlined-basic"
            placeholder='Search'
            variant="outlined"
            size="small"
            style={{ marginTop: "1rem", width: "40%", backgroundColor:'white'}}
            onChange={(e)=>setSearchBarValue(e.target.value)}
            value={searchBarValue}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon/>
                </InputAdornment>
              ),
            }}
          />
        <Button style={{marginTop:'1rem', width:'20%', backgroundColor:'#0062AF', borderRadius:'10px' }} onClick={handleSubmit} variant="contained">
            Search
        </Button>
      </div>
      <div>

      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
    snackBarStatus: state.snackBarStatus,
    userDetails:state.userDetails,
  });
  
  const mapDispatchToProps = {
    toggleSnackbar,
    getUserDetails,
    createHelp
  };
  
  export default connect(mapStateToProps,mapDispatchToProps)(HelpnSupport)