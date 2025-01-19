import React, { useState, useEffect } from "react";
import { Typography, Button, Grid, Box, LinearProgress } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import Navbar from "../Shared/Navbar/Navbar";

// Import the new images
import ElectricCarImage from "./EVIcon.png";
import HomeGridImage from "./HomeIcon.png";
import CarIllustration from "./CarIllu.png";

const VehicleToHomeCharging = () => {
  const [charging, setCharging] = useState(false);
  const [vehicleCharge, setVehicleCharge] = useState(80);
  const [homeGridCharge, setHomeGridCharge] = useState(50);
  const [typeCharging, setTypeCharging] = useState(1);

  useEffect(() => {
    let interval;
    if (charging && vehicleCharge > 0 && homeGridCharge < 100) {
      interval = setInterval(() => {
        setVehicleCharge((prev) => Math.max(prev - 3, 0));
        setHomeGridCharge((prev) => Math.min(prev + 3, 100));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [charging, vehicleCharge, homeGridCharge]);

  const startCharging = () => {
    setCharging(true);
  };

  const stopCharging = () => {
    setCharging(false);
  };

  return (
    <>
    <Navbar/>
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Vehicle-to-Home Grid Charge Transfer
      </Typography>
      <Typography style={{margin:"1.5rem 0 3rem"}} variant="subtitle1" color="textSecondary" gutterBottom>
        Simulate the transfer of charge from a vehicle to a home energy grid
      </Typography>
      {typeCharging ? 
       <Grid container spacing={3} justifyContent="center" alignItems="center">
       {/* Vehicle */}
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
           <Typography variant="subtitle1">Vehicle</Typography>
           <Typography variant="body2" color="textSecondary">Charge Level: {vehicleCharge}%</Typography>
           <LinearProgress
             variant="determinate"
             value={vehicleCharge}
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
         {charging ? (
           <BoltIcon style={{ fontSize: "40px", color: "#1a73e8" }} />
         ) : (
           <BoltIcon style={{ fontSize: "40px", color: "#555" }} />
         )}
         <Typography variant="body2" color="textSecondary">
           {charging ? "Charging in progress..." : "Not Charging"}
         </Typography>
       </Grid>

       {/* Home Grid */}
       <Grid item xs={12} sm={5}>
         <Box
           sx={{
             p: 2,
             border: '1px solid #e0e0e0',
             borderRadius: '8px',
             padding: '2/Users/jagruthamancha/Downloads/CarIllu.pngrem',
             boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             textAlign: 'center'
           }}
         >
           <img src={HomeGridImage} alt="Home Grid" style={{ width: "100%", maxWidth: "300px", marginBottom: '1rem' }} />
           <Typography variant="subtitle1">Home Grid</Typography>
           <Typography variant="body2" color="textSecondary">Charge Level: {homeGridCharge}%</Typography>
           <LinearProgress
             variant="determinate"
             value={homeGridCharge}
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

       

       {/* Action Buttons */}
       <Grid item xs={12}>
         <Button
           variant="contained"
           color="primary"
           onClick={startCharging}
           disabled={charging || vehicleCharge === 0 || homeGridCharge === 100}
           sx={{ mr: 1 }}
         >
           Start Charging
         </Button>
         <Button
           variant="outlined"
           color="secondary"
           onClick={stopCharging}
           disabled={!charging}
         >
           Stop Charging
         </Button>
       </Grid>
     </Grid>
      :
      <Grid container spacing={3} justifyContent="center" alignItems="center">
      {/* Vehicle */}
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
          <Typography variant="subtitle1">Vehicle</Typography>
          <Typography variant="body2" color="textSecondary">Charge Level: {vehicleCharge}%</Typography>
          <LinearProgress
            variant="determinate"
            value={vehicleCharge}
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
        {charging ? (
          <BoltIcon style={{ fontSize: "40px", color: "#1a73e8" }} />
        ) : (
          <BoltIcon style={{ fontSize: "40px", color: "#555" }} />
        )}
        <Typography variant="body2" color="textSecondary">
          {charging ? "Charging in progress..." : "Not Charging"}
        </Typography>
      </Grid>

      {/* Home Grid */}
      <Grid item xs={12} sm={5}>
        <Box
          sx={{
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '2/Users/jagruthamancha/Downloads/CarIllu.pngrem',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <img src={ElectricCarImage} alt="Home Grid" style={{ width: "100%", maxWidth: "300px", marginBottom: '1rem' }} />
          <Typography variant="subtitle1">Vehicle</Typography>
          <Typography variant="body2" color="textSecondary">Charge Level: {homeGridCharge}%</Typography>
          <LinearProgress
            variant="determinate"
            value={homeGridCharge}
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

      

      {/* Action Buttons */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={startCharging}
          disabled={charging || vehicleCharge === 0 || homeGridCharge === 100}
          sx={{ mr: 1 }}
        >
          Start Charging
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={stopCharging}
          disabled={!charging}
        >
          Stop Charging
        </Button>
      </Grid>
    </Grid>
    }
      
      
    </div>
    </>
  );
};

export default VehicleToHomeCharging;