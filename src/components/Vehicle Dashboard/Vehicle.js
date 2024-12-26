import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { toggleSnackbar } from "../../Redux/Actions/index";
import "./Vehicle.css";
import logo from "./Logo.png";
import SEAL from "./BYD_SEAL.png";
import STATION from "./station.png";


const Vehicle = (props) => {
  const [date,setDate] = useState();
  const { userDetails } = props;

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const formattedDate = `${day} ${month}`;
    setDate(formattedDate);
  }, []);
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
            {/* LOGO */}
            <img src={logo} alt="logo" />
        </div>
        <nav>
          <button>🔍</button>
          <button>🎵</button>
          <button>⚙️</button>
          <button>📶</button>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <input type="text" placeholder="Give a voice command" />
          <div className="user-info">
            <span>Hello, {userDetails?.user?.username?userDetails?.user?.username:"User"}</span>
            <span>{date}</span>
          </div>
        </header>

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
                                    <div class="battery-text1">405 km</div>
                                    <div class="battery-text2">Left</div>
                                </div>
                                <div>
                                    <div class="battery-text1">35</div>
                                    <div class="battery-text2">chargings</div>
                                </div>
                                <div>
                                    <div class="battery-text1">5915 km</div>
                                    <div class="battery-text2">Distance travelled</div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
                <div class="battery">
                    <div style={{marginBottom:"-6px"}}><h5>Station</h5></div>
                    <div style={{fontSize: "10px"}}>See location →</div>
                    <div><img src={STATION} alt="Station" style={{paddingLeft:"40px",height:"125px"}}/></div>
                </div>
            </div>
          </div>

          <div className="car-details">
            <h3>Car Details</h3>
            <div class="car-details-content">
                <div>
                    <img src={SEAL} alt="Car" />
                </div>
                <div>
                    <h5><b>BYD SEAL</b></h5>
                </div>
                <div>
                    <h6>83KWH AT Performance Edition</h6>
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
});

const mapDispatchToProps = (dispatch) => ({
  toggleSnackbar: (payload) => dispatch(toggleSnackbar(payload)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Vehicle);
