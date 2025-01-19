import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Navbar from "../Shared/Navbar/Navbar";
import './Admin.css';
import { getUserDetails, getTransactionHistoryAdmin, toggleSnackbar, getAllHelp, updateHelp, updateTransactionAdmin} from '../../Redux/Actions';
import * as utils from '../../utils/utils';

const sampleTransactions = [
  {
    _id: '1',
    senderId: { name: 'John Doe' },
    receiverId: { name: 'Jane Smith' },
    transactionStatus: 'InProgress',
  },
  {
    _id: '2',
    senderId: { name: 'Alice Johnson' },
    receiverId: { name: 'Bob Brown' },
    transactionStatus: 'Completed',
  },
];

const sampleTickets = [
  {
    _id: '1',
    userId: 'John Doe',
    query: 'I am unable to complete my transaction.',
    response: 'Our team is looking into it.',
  },
  {
    _id: '2',
    userId: 'Jane Smith',
    query: 'The charge per unit is incorrect.',
    response: 'We are investigating the issue.',
  },
  {
    _id: '1',
    userId: 'John Doe',
    query: 'I am unable to complete my transaction.',
    response: 'Our team is looking into it.',
  },
  {
    _id: '2',
    userId: 'Jane Smith',
    query: 'The charge per unit is incorrect.',
    response: 'We are investigating the issue.',
  },
];

const AdminPage = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState('');
  const [selectedTicketResponse, setSelectedTicketResponse] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const {userDetails, adminTransactionHistory, allTickets} = props;

  // Fetch transactions and tickets on component mount
  useEffect(() => {
    // Fetching sample transactions (replace with actual API call)
    props.getTransactionHistoryAdmin()

    // Fetching sample tickets (replace with actual API call)
    props.getAllHelp();
  }, []);

  useEffect(()=>{
    if(utils.arrayChecker(allTickets)){
      setTickets(allTickets);
    }
  },[allTickets])

  useEffect(()=>{
    console.log(adminTransactionHistory,"adminTransactionHistory")
    if(utils.arrayChecker(adminTransactionHistory)){
      setTransactions(adminTransactionHistory);
    }
  },[adminTransactionHistory])

  // const handleTransactionStatusChange = (transactionId) => {
  //   axios.put(`/api/transactions/${transactionId}`, { status: selectedTransactionStatus })
  //     .then((response) => {
  //       // Update the state with the new status
  //       setTransactions((prevTransactions) =>
  //         prevTransactions.map((transaction) =>
  //           transaction._id === transactionId ? response.data : transaction
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       console.error('Error updating transaction status:', error);
  //     });
  // };

  const handleTransactionClick = (transaction) => {
    if(selectedTransactionId!==transaction._id){
      setSelectedTransactionStatus("");
      setSelectedTransactionId(transaction._id)
      return;
    }
    if(selectedTransactionStatus===transaction.transactionStatus){
      props.toggleSnackbar({open:true,message:'Please select a different status to edit',status:false});
      return;
    }
    props.updateTransactionAdmin({params:{transactionId:transaction._id},data:{transactionStatus:selectedTransactionStatus}}).then((response)=>{
      if(response.payload.status===200){
        setSelectedTransactionStatus("");
        setSelectedTransactionId("");
        props.getTransactionHistoryAdmin();
      }
    })

  }

  const handleTicketClick = (ticketId) =>{
    if(selectedTicketId!==ticketId){
      setSelectedTicketResponse("");
      setSelectedTicketId(ticketId)
      return;
    }
    if(selectedTicketResponse===""){
      props.toggleSnackbar({open:true,message:'Please enter a response',status:false});
      return;
    }
    props.updateHelp({params:{ticketId:selectedTicketId},data:{response:selectedTicketResponse}}).then((response)=>{
      if(response.payload.status===200){
        setSelectedTicketResponse("");
        setSelectedTicketId("");
        props.getAllHelp();
      }
    })
  }

  // const handleTicketResponseChange = (ticketId) => {
  //   axios.put(`/api/tickets/${ticketId}`, { response: selectedTicketResponse })
  //     .then((response) => {
  //       // Update the state with the new response
  //       setTickets((prevTickets) =>
  //         prevTickets.map((ticket) =>
  //           ticket._id === ticketId ? response.data : ticket
  //         )
  //       );
  //     })
  //     .catch((error) => {
  //       console.error('Error updating ticket response:', error);
  //     });
  // };

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <h1>Admin Dashboard</h1>

        <h2>Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {utils.arrayLengthChecker(transactions) ? transactions?.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.senderId?.username || 'Sample Sender'}</td>
                <td>{transaction.receiverId?.username || 'Sample Receiver'}</td>
                <td>{transaction.transactionStatus}</td>
                <td className="status-action-cell">
                  {selectedTransactionId===transaction._id && <select
                    value={selectedTransactionStatus}
                    onChange={(e) => setSelectedTransactionStatus(e.target.value)}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Failed">Failed</option>
                  </select>}
                  <button onClick={() => handleTransactionClick(transaction)}>
                    Update Status
                  </button>
                </td>
              </tr>
            ))
            :
            <tr> 
              <td colSpan="3" align='center'>No Transactions Found</td> 
            </tr>
          }
          </tbody>
        </table>

        <h2>Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Query</th>
              <th>Previous Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {utils.arrayLengthChecker(tickets) ? tickets?.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.userId || 'Sample User'}</td>
                <td>{ticket.query || 'Sample query text'}</td>
                <td>{ticket.response || 'No response yet'}</td>
                <td className="ticket-action-cell">
                  { selectedTicketId===ticket._id &&
                    <textarea
                    value={selectedTicketResponse}
                    onChange={(e) => setSelectedTicketResponse(e.target.value)}
                    placeholder="Write response..."
                    rows="3"
                  />}
                  <button onClick={() => handleTicketClick(ticket._id)}>
                    Respond to Ticket
                  </button>
                </td>
              </tr>
            ))
            :
            <tr> 
              <td colSpan="4" align='center'>No Tickets Found</td>
            </tr>
          }
          </tbody>
        </table>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  userDetails: state.userDetails,
  adminTransactionHistory: state.adminTransactionHistory,
  allTickets: state.allTickets,
})

const mapDispatchToProps =  {
  toggleSnackbar,
  getUserDetails,
  getTransactionHistoryAdmin,
  getAllHelp,
  updateHelp,
  updateTransactionAdmin
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)