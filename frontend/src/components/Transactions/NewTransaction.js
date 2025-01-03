import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux';
import {toggleSnackbar,getUserDetails, createPost} from '../../Redux/Actions';
import TransactionNavbar from '../Transactions/TransactionNavbar'
import * as utils from '../../utils/utils';

const NewTransaction = (props) => {
  const [transactionType, setTransactionType] = useState("");
  const [boolvehicle, setBoolVehicle] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [availableEnergy, setAvailableEnergy] = useState("");
  const [biddingAmount, setBiddingAmount] = useState("");
  const [buyContract, setBuyContract] = useState("");
  const [sellContract, setSellContract] = useState("");
  const [requiredEnergy, setRequiredEnergy] = useState("");
  const [maxPrice, setMaxPrice] = useState("")
  const [vehicles,setVehicles] = useState([]);
  const [vehicleSelected,setVehicle] = useState("");
  const [location, setLocation] = useState({latitude:"",longitude:""})
  const {userDetails} = props;

  useEffect(() => {
    if(!userDetails)props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
    if(userDetails?.user?.vehicles){
      setVehicles(userDetails?.user?.vehicles)
    }
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        })
    }
  },[])

  useEffect(() => {
    setVehicles(userDetails?.user?.vehicles)
  },[userDetails])

  const handleDropdownChange = (event) => {
    setBoolVehicle(Number(event.target.value));
  };

  const handleEmptyAllFields = () => {
    setBoolVehicle(0)
    setAvailableEnergy('');
    setBiddingAmount('');
    setBuyContract('');
    setSellContract('');
    setRequiredEnergy('');
    setMaxPrice('');
  }

  const handleSubmit = () => {
    if(!transactionStatus){
      setTransactionStatus(true);
      return
    }
    if(boolvehicle===0)props.toggleSnackbar({open:'true',message:'Select Source Type',status:false})
    else if(boolvehicle===1 && vehicleSelected==="")props.toggleSnackbar({open:'true',message:'Please Select the Vehicle, if not present add one',status:false})
    else if(transactionType === 'Buy' && (requiredEnergy==='' || maxPrice === '' || buyContract === ''))props.toggleSnackbar({open:'true',message:'Please Enter the Required Fields',status:false})
    else if(transactionType === 'Sell' && (availableEnergy==='' || biddingAmount === '' || sellContract === ''))props.toggleSnackbar({open:'true',message:'Please Enter the Required Fields',status:false})
    
    const payload = {
      userId:localStorage.getItem("userId"),
      typeOfPost:boolvehicle,
      vehicleId:vehicleSelected,
      typeOfOrder:transactionType,
      energy:transactionType==="Buy"?requiredEnergy:availableEnergy,
      chargePerUnit:transactionType==="Buy"?maxPrice:biddingAmount,
      selectedContract:transactionType==="Buy"?buyContract:sellContract,
      location:{
        type:'Point',
        coordinates:[location?.latitude,location?.longitude]
      }
    }
    props.createPost({data:payload}).then((response)=>{
      if(response.payload.status===200 || response.payload.status===201){
        setTransactionType("")
        setTransactionStatus(false)
        handleEmptyAllFields();
      }
    })
  }

  return (
    <div>
      {console.log(vehicleSelected,"vehicleSelected")}
        <TransactionNavbar/> 
        <div style={{display:'flex', flexDirection:'column',alignItems:'center',margin:'2rem',width:'100%',height:'100%'}}>
            <h3 style={{fontWeight:'700'}}>New Request</h3>
            <div style={{width:'40%'}} className="form-group">
              <label htmlFor="transactionType" style={{fontWeight:'600',marginTop:'1rem'}}>Buy or Sell?</label>
              <select style={{width:'100%'}} value={transactionType} onChange={(e)=>{
                setTransactionType(e.target.value)
                setTransactionStatus(false)
                handleEmptyAllFields();
                setVehicle("")
                }} className="form-control">
                <option value="">None</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
              {!transactionStatus && transactionType!=="" && <button style={{marginTop:'1rem', width:'100%', background:'teal'}} className="btn btn-primary" onClick={()=>setTransactionStatus(true)}>Submit</button>}
              {transactionType!=="" && transactionStatus && 
              <div>
                <label htmlFor="vehicle-grid-selector" style={{fontWeight:'600',marginTop:'1rem'}}>
                  Select Source:
                </label>
                <select
                  id="vehicle-grid-selector"
                  value={boolvehicle}
                  onChange={handleDropdownChange}
                  style={{ width:'100%' }}
                  className="form-control"
                >
                  <option value="0" disabled>
                    Select
                  </option>
                  <option value="1">Vehicle</option>
                  <option value="2">Grid</option>
                </select>
                
              </div>
              }
              {transactionType!=="" && transactionStatus && boolvehicle===1 &&
              <>
                <div>
                <label htmlFor="Car" style={{fontWeight:'600',marginTop:'1rem'}}>Select Car</label>
                <select style={{width:'100%'}} value={vehicleSelected} onChange={(e)=>setVehicle(e.target.value)} className="form-control">
                  <option value="">None</option>
                  {utils.arrayLengthChecker(vehicles) && vehicles?.map((vehicle)=>(
                    <option key={vehicle?._id} value={vehicle?._id}>{vehicle?.vehicleName} {vehicle?.vehicleDomain} {vehicle?.vehicleModel} - {vehicle?.nickName}</option>
                  ))}
                </select>
              </div>
              </>}
              {transactionType === 'Buy'&& transactionStatus && <>
                <label htmlFor="rE" style={{fontWeight:'600', marginTop:'2rem', width:'100%'}}>Required Energy*:</label>
                <input
                    type="number"
                    id="rE"
                    className="form-control"
                    value={requiredEnergy}
                    onChange={(e) => setRequiredEnergy(e.target.value)}
                    required
                />
                <label htmlFor="mP" style={{fontWeight:'600', marginTop:'1em',width:'100%'}}>Max price per kWh*:</label>
                <input
                    type="number"
                    id="bA"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    required
                />
                <label htmlFor="sC" style={{fontWeight:'600', marginTop:'1em', width:'100%'}}>Selected Contract*:</label>
                <select style={{width:'100%'}} value={buyContract} onChange={(e)=>{setBuyContract(e.target.value)}} className="form-control">
                  <option value="">None</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </>}
              {transactionType === 'Sell' && transactionStatus && <>
                <label htmlFor="aE" style={{fontWeight:'600', marginTop:'2rem', width:'100%'}}>Available Energy*:</label>
                <input
                    type="number"
                    id="aE"
                    className="form-control"
                    value={availableEnergy}
                    onChange={(e) => setAvailableEnergy(e.target.value)}
                    required
                />
                <label htmlFor="bA" style={{fontWeight:'600', marginTop:'1em',width:'100%'}}>Bidding Amount per kWh*:</label>
                <input
                    type="number"
                    id="bA"
                    className="form-control"
                    value={biddingAmount}
                    onChange={(e) => setBiddingAmount(e.target.value)}
                    required
                />
                <label htmlFor="sC" style={{fontWeight:'600', marginTop:'1em', width:'100%'}}>Selected Contract*:</label>
                <select style={{width:'100%'}} value={sellContract} onChange={(e)=>{setSellContract(e.target.value)}} className="form-control">
                  <option value="">None</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </>}
              {transactionType!=='' && transactionStatus && <button style={{marginTop:'1rem', width:'100%', background:'teal'}} className="btn btn-primary" onClick={()=>handleSubmit()}>Submit</button>}
            </div>
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
  createPost
};

export default connect(mapStateToProps,mapDispatchToProps)(NewTransaction)