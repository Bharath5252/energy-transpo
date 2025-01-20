import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails, setTrade } from "../../Redux/Actions";
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
  // const [typeCharging, setTypeCharging] = useState(0);
  // const [messages, setMessages] = useState([]);
  const history = useNavigate();
  const url = "ws://localhost:8084/mqtt";
  const [tradeId, setTradeId] = useState();

  const {userDetails, tradeRow, setTrade} = props;

  useEffect(() => {
    if (tradeRow && tradeRow._id) {
      setTradeId(tradeRow._id);
      // console.log(tradeRow);
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

      client.on('message', (topic, message) => {
        setMessage(JSON.parse(message.toString()));
        if(message.status==="completed"){
          triggerUpdateTransaction();
          history("/transactions/pending");
        }
        // Update messages in state
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     `Topic: ${topic}, Message: ${message.toString()}`,
      // ]);
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
    if(tradeRow.state!=="inProgress" || !tradeRow.transactionId){
      props.toggleSnackbar({open:true,message:'Invalid transactionId',status:false});
      return;
    }
    props.updateTransactionStats({params:{transactionId:tradeRow?.transactionId,tradeId:tradeRow._id},data:{transactionStatus:"Completed",transferredEnergy:tradeRow?.energy,chargePerUnit:tradeRow?.chargePerUnit}}).then((response)=>{
      if(response.payload.status===200){
        props.toggleSnackbar({open:true,message:'Transaction completed',status:true});
        setTrade({});
      }
    })};

  return (
    <>
      <Navbar />
      <div style={{padding:'2rem',textAlign:'center'}}>{JSON.stringify(message)}</div>
      {console.log(message)}
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Vehicle-to-Home Grid Charge Transfer
        </Typography>
        <Typography
          style={{ margin: "1.5rem 0 3rem" }}
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
        >
          Real-time telemetry of charge transfer between a vehicle and home grid
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
              <img src={CarIllustration} alt="Electric Vehicle" style={{ width: "100%", maxWidth: "300px", marginBottom: '1rem' }} />
              <Typography variant="subtitle1">Sender (Vehicle)</Typography>
              {message && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Charge Level: {message?.sender.charge_percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Energy: {message?.sender.energy.toFixed(2)} kWh
                  </Typography>
                </>
              )}
              <LinearProgress
                variant="determinate"
                value={message ? message.sender.charge_percentage : 0}
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
            </Box>
          </Grid>

          {/* Charging Animation */}
          <Grid item xs={12} sm={2} style={{ textAlign: "center" }}>
            <BoltIcon style={{ fontSize: "40px", color: "#1a73e8" }} />
            <Typography variant="body2" color="textSecondary">
              Charging in progress...
            </Typography>
          </Grid>

          {/* Receiver (Home Grid) */}
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
              <img src={ElectricCarImage} alt="Home Grid" style={{ width: "100%", maxWidth: "300px", marginBottom: '1rem' }} />
              <Typography variant="subtitle1">Receiver (Vehicle)</Typography>
              {message && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Charge Level: {message?.receiver.charge_percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Energy: {message?.receiver.energy.toFixed(2)} kWh
                  </Typography>
                </>
              )}
              <LinearProgress
                variant="determinate"
                value={message ? message.receiver.charge_percentage : 0}
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
            </Box>
          </Grid>
        </Grid>

        {/* {typeCharging===1 &&
          <Grid container spacing={3} justifyContent="center" alignItems="center">
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
              <img src={ElectricCarImage} alt="Electric Vehicle" style={{ width: "100%", maxWidth: "300px", marginBottom: '1rem' }} />
              <Typography variant="subtitle1">Sender (Vehicle)</Typography>
              {message && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Charge Level: {message.sender.charge_percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Energy: {message.sender.energy.toFixed(2)} kWh
                  </Typography>
                </>
              )}
              <LinearProgress
                variant="determinate"
                value={message ? message.sender.charge_percentage : 0}
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
            </Box>
          </Grid>


          <Grid item xs={12} sm={2} style={{ textAlign: "center" }}>
            <BoltIcon style={{ fontSize: "40px", color: "#1a73e8" }} />
            <Typography variant="body2" color="textSecondary">
              Charging in progress...
            </Typography>
          </Grid>


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
              <img src={HomeGridImage} alt="Home Grid" style={{ width: "100%", maxWidth: "300px", marginBottom: '1rem' }} />
              <Typography variant="subtitle1">Receiver (Home Grid)</Typography>
              {message && (
                <>
                  <Typography variant="body2" color="textSecondary">
                    Charge Level: {message.receiver.charge_percentage.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Energy: {message.receiver.energy.toFixed(2)} kWh
                  </Typography>
                </>
              )}
              <LinearProgress
                variant="determinate"
                value={message ? message.receiver.charge_percentage : 0}
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
            </Box>
          </Grid>
        </Grid>
        } */}

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
  setTrade
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleToHomeCharging);
