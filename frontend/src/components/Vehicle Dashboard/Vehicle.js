import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toggleSnackbar, getUserDetails } from "../../Redux/Actions";
import "./Vehicle.css";
import VehicleNavbar from "./VehicleNavbar";
import * as utils from '../../utils/utils';
import vehiclesData from '../../MOCK_DATA.json';
// import { convertLength } from "@mui/material/styles/cssUtils";


const Vehicle = (props) => {
  const [date,setDate] = useState();
  const { userDetails, vehicleSelected } = props;
  const [userVehicles, setUserVehicles] = useState({});

  useEffect(() => {
        if(Object.keys(vehicleSelected).length===0){
            props.getUserDetails({params:{userId:localStorage.getItem("userId")}})
        }
    },[])
    useEffect(() => { 
        const user = userDetails?.user?.vehicles? userDetails?.user?.vehicles:[];
        if(utils.arrayLengthChecker(user) && Object.keys(vehicleSelected).length===0){
            setUserVehicles(user[0]);
        }
    },[userDetails])

    useEffect(() => {
        setUserVehicles(vehicleSelected);
    },[vehicleSelected])

    // const vehicle = props.location.state?.vehicle;

    // console.log(vehicle);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const formattedDate = `${day} ${month}`;
    setDate(formattedDate);
  }, []);

  const [matchedVehicle, setMatchedVehicle] = useState(null);

  useEffect(() => {
    console.log(userVehicles);
    const match = vehiclesData.find(
        (data) =>
          data.car === userVehicles?.vehicleDomain &&
          data.car_model === userVehicles?.vehicleName
      );
      setMatchedVehicle(match);
    // console.log(match);
  }, [userVehicles]);


  return (
    <div className="dashboard">
      {/* <aside className=""> */}
      {/* </aside>x */}

      <main className="main">
        <VehicleNavbar/>
        <div style={{margin:"20px 0px -20px 40px"}}><h3>Car Details</h3></div>
        <section className="content">

          <div className="location">
            <div class="box1">
                <div class="battery">
                    <h5>Battery</h5>
                    <div class="battery-inner">
                        <div class="battery-container">
                            <div class="battery-bump"></div>
                            <div class="battery-outer"><div class="battery-level"><div>50%</div></div></div>
                        </div>
                        <div>
                            <div class="battery-text-container">
                                <div>
                                    <div class="battery-text1">{matchedVehicle?.battery_percent}%</div>
                                    <div class="battery-text2">Charge Left</div>
                                </div>
                                <div>
                                    <div class="battery-text1">{matchedVehicle?.car_current_battery} Wh</div>
                                    <div class="battery-text2">Energy Left</div>
                                </div>
                                <div>
                                    <div class="battery-text1">{matchedVehicle?.car_battery} Wh</div>
                                    <div class="battery-text2">Battery capacity</div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
                <div class="battery">
                    <div style={{marginBottom:"-6px"}}><h5>Station</h5></div>
                    <div style={{fontSize: "10px"}}>See location →</div>
                    <div><img src="/images/station.png" alt="Station" style={{paddingLeft:"40px",height:"125px"}}/></div>
                </div>
            </div>
            <div class="box2">
                <div><h5>Transactions</h5></div>
                <div>
                    <table class="scrolldown">
                        <thead>
                            <tr class="trbody">
                                <th class="thtd">Energy Transfered (Wh)</th>
                                <th class="thtd">Price/kwh (Rupees)</th>
                                <th class="thtd">Type</th>
                            </tr>
                        </thead>
                        <tbody class="tbody">
                            <tr class="trbody">
                                <td class="thtd">Buy</td>
                                <td class="thtd">45</td>
                                <td class="thtd">0.5</td>
                            </tr>
                            <tr class="trbody">
                                <td class="thtd">Sell</td>
                                <td class="thtd">63</td>
                                <td class="thtd">0.5</td>
                            </tr>
                            <tr class="trbody">
                                <td class="thtd">Sell</td>
                                <td class="thtd">63</td>
                                <td class="thtd">0.5</td>
                            </tr>
                            <tr class="trbody">
                                <td class="thtd">Sell</td>
                                <td class="thtd">63</td>
                                <td class="thtd">0.5</td>
                            </tr>
                            <tr class="trbody">
                                <td class="thtd">Sell</td>
                                <td class="thtd">63</td>
                                <td class="thtd">0.5</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          <div className="car-details">
            
            <div class="car-details-content">
                <div>
                    <img src={`/images/cars/${userVehicles?.vehicleDomain}_${userVehicles?.vehicleName}.png`} alt="Car" />
                    {/* <img src={VehicleImg} alt="Car" /> */}
                </div>
                <div>
                    <h5>{userVehicles?.vehicleDomain}</h5>
                </div>
                <div>
                    <h6>{userVehicles?.vehicleName}</h6>
                </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  vehicleSelected: state.vehicleSelected,
});

const mapDispatchToProps = {
  toggleSnackbar,
  getUserDetails,
};

export default connect(mapStateToProps,mapDispatchToProps)(Vehicle);
