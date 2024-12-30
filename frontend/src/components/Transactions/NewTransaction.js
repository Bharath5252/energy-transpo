import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux';
import {toggleSnackbar,getUserDetails} from '../../Redux/Actions';
import TransactionNavbar from '../Transactions/TransactionNavbar'
import * as utils from '../../utils/utils';

const NewTransaction = (props) => {
  const [transactionType, setTransactionType] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [availableEnergy, setAvailableEnergy] = useState("");
  const [biddingAmount, setBiddingAmount] = useState("");
  const [buyContract, setBuyContract] = useState("");
  const [sellContract, setSellContract] = useState("");
  const [requiredEnergy, setRequiredEnergy] = useState("");
  const [maxPrice, setMaxPrice] = useState("")
  const [vehicles,setVehicles] = useState([]);
  const {userDetails} = props;

  useEffect(() => {
    if(!userDetails)props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
    if(userDetails?.user?.vehicles){
      setVehicles(userDetails?.user?.vehicles)
    }
  },[])

  useEffect(() => {
    setVehicles(userDetails?.user?.vehicles)
  },[userDetails])

  const handleEmptyAllFields = () => {
    setAvailableEnergy('');
    setBiddingAmount('');
    setBuyContract('');
    setSellContract('');
    setRequiredEnergy('');
    setMaxPrice('');
  }
  return (
    <div>
        <TransactionNavbar/> 
        <div style={{display:'flex', flexDirection:'column',alignItems:'center',margin:'1rem',width:'100%',height:'100%'}}>
            <h3 style={{fontWeight:'700'}}>New Transaction</h3>
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
              {/* {transactionType!=="" && 
              <div>
                <label htmlFor="Car" style={{fontWeight:'600',marginTop:'1rem'}}>Select Car</label>
                <select style={{width:'100%'}} value={transactionType} onChange={(e)=>{
                  setTransactionType(e.target.value)
                  setTransactionStatus(false)
                  handleEmptyAllFields();
                  }} className="form-control">
                  <option value="">None</option>
                  {utils.arrayLengthChecker(vehicles) && vehicles?.map((vehicle)=>(
                    <option value={vehicle?.id}>`${vehicle?.vehicleName} ${vehicle?.vehicleDomain} ${vehicle?.vehicleModel}`</option>
                  ))}
                </select>
              </div>
              } */}
              {transactionType === 'Buy'&& transactionStatus && <>
                <label htmlFor="rE" style={{fontWeight:'600', marginTop:'2rem', width:'100%'}}>Required Energy:</label>
                <input
                    type="number"
                    id="rE"
                    className="form-control"
                    value={requiredEnergy}
                    onChange={(e) => setRequiredEnergy(e.target.value)}
                    required
                />
                <label htmlFor="mP" style={{fontWeight:'600', marginTop:'1em',width:'100%'}}>Max price per kWh:</label>
                <input
                    type="number"
                    id="bA"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    required
                />
                <label htmlFor="sC" style={{fontWeight:'600', marginTop:'1em', width:'100%'}}>Selected Contract:</label>
                <input
                    type="text"
                    id="sC"
                    className="form-control"
                    value={buyContract}
                    onChange={(e) => setBuyContract(e.target.value)}
                    required
                />
              </>}
              {transactionType === 'Sell' && transactionStatus && <>
                <label htmlFor="aE" style={{fontWeight:'600', marginTop:'2rem', width:'100%'}}>Available Energy:</label>
                <input
                    type="number"
                    id="aE"
                    className="form-control"
                    value={availableEnergy}
                    onChange={(e) => setAvailableEnergy(e.target.value)}
                    required
                />
                <label htmlFor="bA" style={{fontWeight:'600', marginTop:'1em',width:'100%'}}>Bidding Amount per kWh:</label>
                <input
                    type="number"
                    id="bA"
                    className="form-control"
                    value={biddingAmount}
                    onChange={(e) => setBiddingAmount(e.target.value)}
                    required
                />
                <label htmlFor="sC" style={{fontWeight:'600', marginTop:'1em', width:'100%'}}>Selected Contract:</label>
                <input
                    type="text"
                    id="sC"
                    className="form-control"
                    value={sellContract}
                    onChange={(e) => setSellContract(e.target.value)}
                    required
                />
              </>}
              {transactionType!=='' && transactionStatus && <button style={{marginTop:'1rem', width:'100%', background:'teal'}} className="btn btn-primary" onClick={()=>setTransactionStatus(true)}>Submit</button>}
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
};

export default connect(mapStateToProps,mapDispatchToProps)(NewTransaction)