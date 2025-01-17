import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Shared/Navbar/Navbar";
import './Admin.css';

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
];

const AdminPage = () => {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [tickets, setTickets] = useState(sampleTickets);
  const [selectedTransactionStatus, setSelectedTransactionStatus] = useState('');
  const [selectedTicketResponse, setSelectedTicketResponse] = useState('');

  // Fetch transactions and tickets on component mount
  useEffect(() => {
    // Fetching sample transactions (replace with actual API call)
    axios.get('/api/transactions')
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });

    // Fetching sample tickets (replace with actual API call)
    axios.get('/api/tickets')
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  const handleTransactionStatusChange = (transactionId) => {
    axios.put(`/api/transactions/${transactionId}`, { status: selectedTransactionStatus })
      .then((response) => {
        // Update the state with the new status
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === transactionId ? response.data : transaction
          )
        );
      })
      .catch((error) => {
        console.error('Error updating transaction status:', error);
      });
  };

  const handleTicketResponseChange = (ticketId) => {
    axios.put(`/api/tickets/${ticketId}`, { response: selectedTicketResponse })
      .then((response) => {
        // Update the state with the new response
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === ticketId ? response.data : ticket
          )
        );
      })
      .catch((error) => {
        console.error('Error updating ticket response:', error);
      });
  };

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
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.senderId.name || 'Sample Sender'}</td>
                <td>{transaction.receiverId.name || 'Sample Receiver'}</td>
                <td>{transaction.transactionStatus}</td>
                <td className="status-action-cell">
                  <select
                    value={selectedTransactionStatus}
                    onChange={(e) => setSelectedTransactionStatus(e.target.value)}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <button onClick={() => handleTransactionStatusChange(transaction._id)}>
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Query</th>
              <th>Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.userId || 'Sample User'}</td>
                <td>{ticket.query || 'Sample query text'}</td>
                <td>{ticket.response || 'No response yet'}</td>
                <td className="ticket-action-cell">
                  <textarea
                    value={selectedTicketResponse}
                    onChange={(e) => setSelectedTicketResponse(e.target.value)}
                    placeholder="Write response..."
                    rows="3"
                  />
                  <button onClick={() => handleTicketResponseChange(ticket._id)}>
                    Respond to Ticket
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPage;
