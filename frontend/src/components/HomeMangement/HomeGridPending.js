import React, {useEffect, useState } from "react";
import {connect} from 'react-redux';
import {Link,} from 'react-router-dom';
import {Tooltip} from '@mui/material';
import {getAcceptedTrades, getUserDetails, toggleSnackbar, cancelAcceptedTrade, preCheckTransaction, initiateTransaction, updateTransactionStats} from '../../Redux/Actions/index'
import "../Transactions/PastTransactions.css";
import car from "../Transactions/charging.jpeg";
import * as utils from '../../utils/utils';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import HomeManagementNavbar from "./HomeManagementNavbar";

const HomePendingRequest = (props) => {
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(0);
  const userId = localStorage.getItem("userId");
  const [acceptedTrades, setAcceptedTrades] = useState([]);

  const {userDetails, acceptTrades} = props

  useEffect(() => {
    if(!userDetails.user)props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
    props.getAcceptedTrades({params:{userId:localStorage.getItem("userId")}})
  },[])

  useEffect(()=>{
    if(utils.arrayLengthChecker(acceptTrades)){
        setAcceptedTrades(acceptTrades.filter((item)=>item?.typeOfPost===2));
    }
  },[acceptTrades])

  const handleButtonClick = (row) => {
    const preCheckPayload = {
      senderId : row.typeOfOrder==="Sell"?row.userId:row.acceptedUserId,
      receiverId : row.typeOfOrder==="Sell"?row.acceptedUserId:row.userId,
      senderVehicle : row.typeOfOrder==="Sell"?row.vehicleId:row.acceptantVehicleId,
      receiverVehicle : row.typeOfOrder==="Sell"?row.acceptantVehicleId:row.vehicleId,
      committedEnergy : row.energy,
      chargePerUnit : row.chargePerUnit,
    }
    props.preCheckTransaction({data:preCheckPayload}).then((response)=>{
      if(response.payload.status===200){
        preCheckPayload.typeOfTransaction = row.typeOfPost;
        preCheckPayload.credits = row.energy*row.chargePerUnit;
        props.initiateTransaction({data:preCheckPayload}).then((response)=>{
          if(response.payload.status===200){
            const trnsId = response.payload?.data?.transactionId
            setSelectedRow(row);
            setLoading(true);
            setAnimate(true);
            setTimeout(() => {
              props.updateTransactionStats({params:{transactionId:trnsId},data:{transactionId:trnsId,transactionStatus:"Completed",transferredEnergy:row.energy,chargePerUnit:row.chargePerUnit}})
            }, 9000);
            setTimeout(() => {
              setLoading(false);
              setSuccess(1);
              // setAnimate(false);  
            }, 10000); 
          }
        })
      }
    })
  };

  const handleDeleteClick = (row) => {
    props.cancelAcceptedTrade({params:{tradeId:row._id}}).then((response)=>{
      if(response.payload.status===200){
        props.getAcceptedTrades({params:{userId:localStorage.getItem("userId")}})
      }
    })
  }
  const rows = [
    {
      transaction: "Buy",
      name: "Inga",
      price: 90,
      committedEnergy: 100,
      date: "2025-01-01",
    },
    {
      transaction: "Sell",
      name: "Helena",
      committedEnergy: 200,
      price: 180,
      date: "2025-01-02",
    },
    {
      transaction: "Buy",
      name: "Hans",
      price: 150,
      committedEnergy: 150,
      date: "2025-01-03",
    },
    {
      transaction: "Sell",
      name: "Anna",
      price: 250,
      committedEnergy: 250,
      date: "2025-01-04",
    },
  ];

  const filteredRows = acceptedTrades.filter(
    (row) =>
      (transactionFilter === "All" || (row.userId===userId?row.typeOfOrder:row.typeOfOrder==="Buy"?"Sell":"Buy") === transactionFilter) &&
      (statusFilter === "All" || row.status === statusFilter) &&
      (dateFilter === "" || row.date === dateFilter)
  );



  return (
    <div>
      <HomeManagementNavbar />
      {loading && (
        <div className="loading-screen">
          <img style={{width:'300px'}} src={car} alt="Loading..." />
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}

      { success===1 &&
        <div className="loading-screen">
        <h4>Transaction Complete</h4>
        <p>
            Your <span style={{color: "green"}}>{selectedRow.userId===userId?selectedRow.typeOfOrder:selectedRow.typeOfOrder==="Buy"?"Sell":"Buy"}</span> transaction has been completed successfully.
        </p>
      <p>{selectedRow.energy} kWh of energy transferred at {selectedRow.chargePerUnit} rupees/kWh.</p>
        <button><Link to="/transactions/past">Close</Link></button>

      </div>
      }
      

      <div className={animate ? 'fade-out' : ''} style={{ margin: "4rem 2rem 4rem 4rem" }}>
        <h2>Pending Transactions</h2>
        <div className="table-container">
          <table className="past-transactions-table">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Vehicle Name</th>
                <th>Committed Energy</th>
                <th>Execution Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {utils.arrayLengthChecker(filteredRows) ? filteredRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.userId===userId?row.typeOfOrder:row.typeOfOrder==="Buy"?"Sell":"Buy"}</td>
                  <td>{row?.vehicleName}</td>
                  <td>{row?.energy} kWh</td>
                  <td>{utils.dateFormat2(row?.executionTime)}</td>
                  <td style={{display:'flex'}}>
                    <button style={{flexGrow:1}} onClick={() => handleButtonClick(row)}>Edit</button>
                    {row.state==="accepted" && <div style={{flexGrow:1}}>
                      <Tooltip title="backoff trade">
                        <DeleteForeverOutlinedIcon style={{color:'red', cursor:'pointer'}} onClick={() => handleDeleteClick(row)}/>
                      </Tooltip>
                    </div>}
                  </td>
                </tr>
              ))
              :
              <tr>
                <td colSpan="6">No Active Accepted Trades</td>
              </tr>
            
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  userDetails: state.userDetails,
  allTrades:state.allTrades,
  acceptTrades:state.acceptTrades,
})

const mapDispatchToProps =  {
  toggleSnackbar,
  getUserDetails,
  getAcceptedTrades,
  cancelAcceptedTrade,
  preCheckTransaction,
  initiateTransaction,
  updateTransactionStats,
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePendingRequest)