import React, { useState } from "react";
import {Link, withRouter} from 'react-router-dom';
import TransactionNavbar from "./TransactionNavbar";
import "./PastTransactions.css";
import car from "./charging.jpeg" 
import { set } from "firebase/database";

const CurrentTransactions = () => {
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(0);

  const handleButtonClick = (row) => {
    setSelectedRow(row);
    setLoading(true); 
    setAnimate(true);  

    setTimeout(() => {
      setLoading(false);  
      setSuccess(1);
      // setAnimate(false);  
    }, 3000);  
  };
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

  const filteredRows = rows.filter(
    (row) =>
      (transactionFilter === "All" || row.transaction === transactionFilter) &&
      (statusFilter === "All" || row.status === statusFilter) &&
      (dateFilter === "" || row.date === dateFilter)
  );



  return (
    <div>
      <TransactionNavbar />

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
            Your <span style={{color: "green"}}>{selectedRow.transaction}</span> transaction has been completed successfully.
        </p>
      <p>{selectedRow.committedEnergy} kWh of energy transferred at {selectedRow.price} rupees/kWh.</p>
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
                <th>Name</th>
                <th>Committed Energy</th>
                <th>Status</th>
                <th>Date</th>
                <th>Initiate</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.transaction}</td>
                  <td>{row.name}</td>
                  <td>{row.committedEnergy} kWh</td>
                  <td>{row.price} rupees/kWh</td>
                  <td>{row.date}</td>
                  <td><button onClick={() => handleButtonClick(row)}>
        Initiate
      </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurrentTransactions;