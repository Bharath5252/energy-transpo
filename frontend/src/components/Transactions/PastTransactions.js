import React, { useEffect, useState } from "react";
import TransactionNavbar from "./TransactionNavbar";
import "./PastTransactions.css";
import {connect} from 'react-redux';
import {toggleSnackbar,getUserDetails, getTransactionHistoryByUser} from '../../Redux/Actions';

const PastTransactions = (props) => {
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [userTransactionHis, setUserTransactionHis] = useState([]);

  const {userTransactionHistory} = props

  useEffect(() => { 
    props.getTransactionHistoryByUser({params:{userId:localStorage.getItem("userId")}})
  },[])

  useEffect(()=>{
    setUserTransactionHis(userTransactionHistory);
  },[userTransactionHistory])

  const rows = [
    {
      transaction: "Buy",
      name: "Inga",
      committedEnergy: 100,
      transactedEnergy: 90,
      status: "Completed",
      date: "2025-01-01",
    },
    {
      transaction: "Sell",
      name: "Helena",
      committedEnergy: 200,
      transactedEnergy: 180,
      status: "Failed",
      date: "2025-01-02",
    },
    {
      transaction: "Buy",
      name: "Hans",
      committedEnergy: 150,
      transactedEnergy: 150,
      status: "Completed",
      date: "2025-01-03",
    },
    {
      transaction: "Sell",
      name: "Anna",
      committedEnergy: 250,
      transactedEnergy: 240,
      status: "Pending",
      date: "2025-01-04",
    },
  ];

  const handleTransactionFilterChange = (event) => {
    setTransactionFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const filteredRows = rows.filter(
    (row) =>
      (transactionFilter === "All" || row.transaction === transactionFilter) &&
      (statusFilter === "All" || row.status === statusFilter) &&
      (dateFilter === "" || row.date === dateFilter)
  );

  return (
    <div>
      <TransactionNavbar />
      <div style={{ margin: "4rem 2rem 4rem 4rem" }}>
        <h2>Past Transactions</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="transactionDropdown">Filter by Transaction Type:</label>
          <select
            id="transactionDropdown"
            onChange={handleTransactionFilterChange}
          >
            <option value="All">All</option>
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>

          <label htmlFor="statusDropdown" style={{ marginLeft: "1rem" }}>
            Filter by Status:
          </label>
          <select id="statusDropdown" onChange={handleStatusFilterChange}>
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>

          <label htmlFor="dateFilter" style={{ marginLeft: "1rem" }}>
            Filter by Date:
          </label>
          <input
            type="date"
            id="dateFilter"
            onChange={handleDateFilterChange}
            value={dateFilter}
          />
        </div>

        <div className="table-container">
          <table className="past-transactions-table">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Name</th>
                <th>Committed Energy</th>
                <th>Transacted Energy</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.transaction}</td>
                  <td>{row.name}</td>
                  <td>{row.committedEnergy} kWh</td>
                  <td>{row.transactedEnergy} kWh</td>
                  <td>{row.status}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
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
  userTransactionHistory: state.userTransactionHistory,
})

const mapDispatchToProps =  {
  toggleSnackbar,
  getUserDetails,
  getTransactionHistoryByUser
}

export default connect(mapStateToProps, mapDispatchToProps)(PastTransactions)