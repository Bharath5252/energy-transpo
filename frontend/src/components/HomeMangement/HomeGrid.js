import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux';
import {toggleSnackbar,getUserDetails, createPost} from '../../Redux/Actions';
import HomeManagementNavbar from './HomeManagementNavbar';
import * as utils from '../../utils/utils';

const HomeGrid = (props) => {
  const [transactionType, setTransactionType] = useState("");
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
  const [time, setTime] = useState("");
  const [vehicleCap,setVehicleCap] = useState(0);
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

  function getFutureTariffData(dateTime) {
    /**
     * Mock function to simulate electricity tariff prediction for a given date and time.
     * Replace this with a real predictive model or API call.
     */
    const hour = dateTime.getHours();
    const weekday = dateTime.getDay(); // 0 = Sunday, 6 = Saturday

    // Example tariff logic
    if (weekday === 0 || weekday === 6) { // Weekend (Saturday/Sunday)
        if (hour >= 2 && hour <= 5) { // Early morning
            return Math.random() * (3.0 - 2.0) + 2.0; // Low tariff
        } else if (hour >= 18 && hour <= 21) { // Evening peak
            return Math.random() * (10.0 - 8.0) + 8.0; // High tariff
        } else {
            return Math.random() * (6.0 - 4.0) + 4.0; // Moderate tariff
        }
    } else { // Weekday
        if (hour >= 2 && hour <= 5) { // Early morning
            return Math.random() * (2.5 - 1.5) + 1.5; // Low tariff
        } else if (hour >= 18 && hour <= 21) { // Evening peak
            return Math.random() * (12.0 - 9.0) + 9.0; // High tariff
        } else {
            return Math.random() * (7.0 - 3.0) + 3.0; // Moderate tariff
        }
    }
}

function findExtremeTariffDateTime(startDate, endDate, extremeType = "low") {
    /**
     * Find the date and time with the lowest or highest tariff within a given date range.
     * 
     * Parameters:
     * - startDate (Date): Start date and time for the search.
     * - endDate (Date): End date and time for the search.
     * - extremeType (string): "low" to find the lowest tariff, "high" to find the highest tariff.
     * 
     * Returns:
     * - Object: An object with the optimal date, time, and tariff.
     */
    let currentDate = new Date(startDate);
    let optimalTariff = null;
    let optimalDateTime = null;

    while (currentDate <= endDate) {
        const currentTariff = getFutureTariffData(currentDate);

        if (
            optimalTariff === null ||
            (extremeType === "low" && currentTariff < optimalTariff) ||
            (extremeType === "high" && currentTariff > optimalTariff)
        ) {
            optimalTariff = currentTariff;
            optimalDateTime = new Date(currentDate);
        }

        // Increment by 1 hour
        currentDate.setHours(currentDate.getHours() + 1);
    }

    return {
        dateTime: optimalDateTime,
        tariff: optimalTariff,
        extremeType: extremeType
    };
}

// Example usage
const start = new Date();
const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000); // 7 days from now

// Find the lowest tariff
const lowestTariff = findExtremeTariffDateTime(start, end, "low");

// Find the highest tariff
const highestTariff = findExtremeTariffDateTime(start, end, "high");


  const energyBool = (value) => {
    if(value<0){
      props.toggleSnackbar({open:'true',message:'Please Enter a Valid Energy',status:false});
      return false;
    }
    if(value>vehicleCap){
      props.toggleSnackbar({open:'true',message:`Vehicle Capacity is ${vehicleCap} kWh`,status:false});
      return false;
    }
    return true;
  }

//   const priceBool = (value) => {
//     if(value<0){
//       props.toggleSnackbar({open:'true',message:'Please Enter a Valid Price',status:false});
//       return false;
//     }
//     return true;
//   }

  const handleVehicleChange = (value) => {
    setVehicle(value);
    setVehicleCap(vehicles.find((item)=>item?._id===value)?.batteryCapacity);
    setAvailableEnergy("");
    setRequiredEnergy("");
  }

  const handleEmptyAllFields = () => {
    setAvailableEnergy('');
    setBiddingAmount('');
    setBuyContract('');
    setSellContract('');
    setRequiredEnergy('');
    setMaxPrice('');
    setTime('');
  }

  const handleTimeChange = (e) => {
      const selectedTime = new Date(e.target.value);
      const currentTime = new Date();

      if (selectedTime > currentTime) {
        setTime(e.target.value);
      } else {
        props.toggleSnackbar({open:'true',message:"Please select a date and time in the future.",status:false});
      }
  }
 
  const handleSubmit = () => {
    if(!transactionStatus){
      setTransactionStatus(true);
      return
    }
    else if(vehicleSelected===""){
        props.toggleSnackbar({open:'true',message:'Please Select the Vehicle, if not present add one',status:false});
        return;
    }
    else if(transactionType === 'Buy' && (requiredEnergy==='' ||  buyContract === '')){
        props.toggleSnackbar({open:'true',message:'Please Enter the Required Fields',status:false});
        return;
    }
    else if(transactionType === 'Sell' && (availableEnergy==='' || sellContract === '')){
        props.toggleSnackbar({open:'true',message:'Please Enter the Required Fields',status:false});
        return;
    }else if(buyContract==='Manual' || sellContract==='Manual'){
        if(time===''){
            props.toggleSnackbar({open:'true',message:'Please Enter the Time of execution',status:false});
            return;
        }
    }
    
    
    const payload = {
      userId:localStorage.getItem("userId"),
      typeOfPost:2,
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
    if(payload.selectedContract==="Manual")payload.executionTime=time;
    if(payload.selectedContract==="Automatic" && transactionType==="Buy")payload.executionTime=findExtremeTariffDateTime(start, end, "low").dateTime;
    if(payload.selectedContract==="Automatic" && transactionType==="Sell")payload.executionTime=findExtremeTariffDateTime(start, end, "high").dateTime;
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
        <HomeManagementNavbar/> 
        <div style={{display:'flex', flexDirection:'column',alignItems:'center',margin:'2rem',width:'-webkit-fill-available',height:'100%'}}>
            <h3 style={{fontWeight:'700'}}>Home Transfer Request</h3>
            <div style={{width:'40%'}} className="form-group">
              <label htmlFor="transactionType" style={{fontWeight:'600',marginTop:'1rem'}}>Buy or Sell?</label>
              <select style={{width:'100%'}} value={transactionType} onChange={(e)=>{
                setTransactionType(e.target.value)
                setTransactionStatus(false)
                handleEmptyAllFields();
                }} className="form-control">
                <option value="">None</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
              {!transactionStatus && transactionType!=="" && <button style={{marginTop:'1rem', width:'100%', background:'teal'}} className="btn btn-primary" onClick={()=>setTransactionStatus(true)}>Submit</button>}
              {transactionType!=="" && transactionStatus &&
              <>
                <div>
                <label htmlFor="Car" style={{fontWeight:'600',marginTop:'1rem'}}>Select Car</label>
                <select style={{width:'100%'}} value={vehicleSelected} onChange={(e)=>handleVehicleChange(e.target.value)} className="form-control">
                  <option value="">None</option>
                  {utils.arrayLengthChecker(vehicles) && vehicles?.map((vehicle)=>(
                    <option key={vehicle?._id} value={vehicle?._id}>{vehicle?.vehicleName} {vehicle?.vehicleDomain} {vehicle?.vehicleModel} - {vehicle?.nickName}</option>
                  ))}
                </select>
              </div>
              </>}
              {transactionType === 'Buy'&& transactionStatus &&  vehicleSelected!=="" && <>
                <label htmlFor="rE" style={{fontWeight:'600', marginTop:'2rem', width:'100%'}}>Required Energy*:</label>
                <input
                    type="number"
                    id="rE"
                    className="form-control"
                    value={requiredEnergy}
                    onChange={(e) => energyBool(e.target.value)?setRequiredEnergy(e.target.value):{}}
                    required
                />
                {/* <label htmlFor="mP" style={{fontWeight:'600', marginTop:'1em',width:'100%'}}>Max price per kWh*:</label>
                <input
                    type="number"
                    id="bA"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => priceBool(e.target.value)?setMaxPrice(e.target.value):{}}
                    required
                /> */}
                <label htmlFor="sC" style={{fontWeight:'600', marginTop:'1em', width:'100%'}}>Selected Contract*:</label>
                <select style={{width:'100%'}} value={buyContract} onChange={(e)=>{setBuyContract(e.target.value)}} className="form-control">
                  <option value="">None</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </>}
              {transactionType === 'Sell' && transactionStatus &&  vehicleSelected!=="" && <>
                <label htmlFor="aE" style={{fontWeight:'600', marginTop:'2rem', width:'100%'}}>Available Energy*:</label>
                <input
                    type="number"
                    id="aE"
                    className="form-control"
                    value={availableEnergy}
                    onChange={(e) => energyBool(e.target.value)?setAvailableEnergy(e.target.value):{}}
                    required
                />
                {/* <label htmlFor="bA" style={{fontWeight:'600', marginTop:'1em',width:'100%'}}>Bidding Amount per kWh*:</label>
                <input
                    type="number"
                    id="bA"
                    className="form-control"
                    value={biddingAmount}
                    onChange={(e) => priceBool(e.target.value)?setBiddingAmount(e.target.value):{}}
                    required
                /> */}
                <label htmlFor="sC" style={{fontWeight:'600', marginTop:'1em', width:'100%'}}>Selected Contract*:</label>
                <select style={{width:'100%'}} value={sellContract} onChange={(e)=>{setSellContract(e.target.value)}} className="form-control">
                  <option value="">None</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </>}
              {transactionType!=='' && transactionStatus && (sellContract==='Manual' || buyContract==='Manual') &&
              <div style={{display:'flex',alignItems:'center', marginTop:'1.5em', width:'100%'}}>
                <label htmlFor="sC" style={{fontWeight:'600'}}>Time of execution*:</label>
                <input
                  size='large'
                  type="datetime-local"
                  id="time"
                  name="time"
                  value={time}
                  style={{width:'35%', marginLeft:'1rem'}}
                  onChange={(e)=>{handleTimeChange(e)}}
                  required
                />
              </div>
              }
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

export default connect(mapStateToProps,mapDispatchToProps)(HomeGrid)