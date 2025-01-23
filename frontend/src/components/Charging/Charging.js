import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails, setTrade, updateTransactionStats, toggleSnackbar } from "../../Redux/Actions";
import { Typography, Grid, Box, LinearProgress } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import Navbar from "../Shared/Navbar/Navbar";
import mqtt from 'mqtt';
import './Charging.css';

import ElectricCarImage from "./EVIcon.png";
import HomeGridImage from "./HomeIcon.png";
import CarIllustration from "./CarIllu.png";

const VehicleToHomeCharging = (props) => {
  const [message, setMessage] = useState("");
  const history = useNavigate();
  const url = "ws://localhost:8084/mqtt";
  const [tradeId, setTradeId] = useState();

  const { userDetails, tradeRow, setTrade } = props;

  useEffect(() => {
    if (tradeRow && tradeRow._id) {
      setTradeId(tradeRow._id);
    }
  }, [tradeRow]);

  useEffect(() => {
    if (!url || !tradeId) {
      console.log("Waiting for URL and tradeId...");
      return;
    }

    console.log("Connecting to MQTT broker...");
    let client;
    try {
      client = mqtt.connect(url);

      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(`telemetry/${localStorage.getItem("tradeId")}/`, (err) => {
          if (!err) {
            console.log(`Subscribed to telemetry/${tradeId}/`);
          } else {
            console.error('Subscription error:', err);
          }
        });
      });

      client.on('message', (topic, msg) => {
        setMessage(JSON.parse(msg.toString()));
        const msgObj = JSON.parse(msg.toString());
        console.log(msgObj);
        if (msgObj.status === "completed") {
          triggerUpdateTransaction();
          history("/transactions/pending");
        }
      });

      client.on('error', (err) => {
        console.error('MQTT error:', err);
      });
    } catch (error) {
      console.error('Error connecting to MQTT broker:', error);
    }

    return () => {
      if (client) {
        console.log("Disconnecting from MQTT broker...");
        client.end();
      }
    };
  }, [url, tradeId]);

  const triggerUpdateTransaction = () => {
    if (tradeRow.state !== "inProgress" || !tradeRow.transactionId) {
      props.toggleSnackbar({ open: true, message: 'Invalid transactionId', status: false });
      return;
    }
    props.updateTransactionStats({ params: { transactionId: tradeRow?.transactionId, tradeId: tradeRow._id }, data: { transactionStatus: "Completed", transferredEnergy: tradeRow?.energy, chargePerUnit: tradeRow?.chargePerUnit } }).then((response) => {
      if (response.payload.status === 200) {
        props.toggleSnackbar({ open: true, message: 'Transaction completed', status: true });
        setTrade({});
      }
    })
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Vehicle-to-Vehicle Charge Transfer
        </Typography>

        {message.progress_percent !== undefined && (
          <Box sx={{ mt: 2, mb: 3, width: '100%' }}>
            <Typography variant="body2" color="textSecondary">
              Transaction Progress: {message.progress_percent.toFixed(2)}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={message.progress_percent}
              sx={{
                height: '10px',
                borderRadius: '5px',
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#1a73e8'
                }
              }}
            />
          </Box>
        )}

        <Typography variant="body2" style={{ margin: "0.3rem" }}>
          Transfer Status: {message.status}
        </Typography>
        <Typography variant="body2" style={{ margin: "0.3rem 0.3rem 1.5rem" }}>
          Timestamp: {new Date(message.timestamp * 1000).toLocaleString()}
        </Typography>

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Sender (Vehicle) */}
          <Grid item xs={12} sm={5}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <img src={CarIllustration} alt="Electric Vehicle" style={{ height: "200px", marginBottom: '1rem' }} />
              <Typography variant="subtitle1">Sender (Vehicle)</Typography>
              {message && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Charge Level: {message?.sender?.charge_percentage?.toFixed(2)}%
                  </Typography>

                </>
              )}
              <LinearProgress
                variant="determinate"
                value={message ? message?.sender?.charge_percentage : 0}
                sx={{
                  width: '100%',
                  mt: 1,
                  height: '8px',
                  borderRadius: '4px',
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#1a73e8'
                  }
                }}
              />
              {/* Telemetry Box */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  width: '100%'
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Energy: {message?.sender?.energy?.toFixed(2)} kWh
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Power: {message?.sender?.power?.toFixed(2)} kWh
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Voltage: {message?.sender?.voltage || 'N/A'} V
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current: {message?.sender?.current || 'N/A'} A
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Temperature: {message?.sender?.battery_temp || 'N/A'} °C
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={2} style={{ textAlign: "center" }}>
            <BoltIcon style={{ fontSize: "40px", color: "#1a73e8" }} />
            <Typography variant="body2" color="textSecondary">
              Charging in progress...
            </Typography>
          </Grid>

          {/* Receiver (Vehicle) */}
          <Grid item xs={12} sm={5}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <img src={ElectricCarImage} alt="Home Grid" style={{ height: "200px", marginBottom: '1rem' }} />
              <Typography variant="subtitle1">Receiver (Vehicle)</Typography>
              {message && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Charge Level: {message?.receiver?.charge_percentage?.toFixed(2)}%
                  </Typography>
                </>
              )}
              <LinearProgress
                variant="determinate"
                value={message ? message?.receiver?.charge_percentage : 0}
                sx={{
                  width: '100%',
                  mt: 1,
                  height: '8px',
                  borderRadius: '4px',
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#1a73e8'
                  }
                }}
              />
              {/* Telemetry Box */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  width: '100%'
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Energy: {message?.receiver?.energy?.toFixed(2)} kWh
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Power: {message?.receiver?.power?.toFixed(2)} kWh
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Voltage: {message?.receiver?.voltage || 'N/A'} V
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current: {message?.receiver?.current || 'N/A'} A
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Temperature: {message?.receiver?.battery_temp || 'N/A'} °C
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  error: state.error,
  data: state.data,
  userDetails: state.userDetails,
  tradeRow: state.tradeRow,
});

const mapDispatchToProps = {
  getUserDetails,
  setTrade,
  updateTransactionStats,
  toggleSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleToHomeCharging);
