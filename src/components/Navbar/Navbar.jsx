import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { Navbar, Nav} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {loadWeb3} from '../api'
import logo from "../../images/logo4.png"
import { useMoralis } from "react-moralis";



const Navbarapp = () => {


const handleAuth = async() => {
  authenticate({signingMessage: 'welcome to Solisium', chainId: 'matic'});
}
 
const { account, authenticate } = useMoralis();


  return (
     <div className="fluid-container navbarmain">
      <div className="container">
        <Navbar style={{zIndex: "1000"}} collapseOnSelect expand="lg" className="" variant="dark">
          {/* <Container> */}
            <Link to="/">
              <Navbar.Brand
                href=""
                style={{ color: "white" }}
                className="navbarlogo"
              >
                <img src={logo} width="220px"/>
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto ">              

                <Link to="/swap" style={{ textDecoration: "none" }}>
                  {" "}
                  <Nav.Link href="#swap" className="ml-md-2 mx-1" id="navbartext">
                  Swap
                  </Nav.Link>
                </Link>

                <Link to="/stake" style={{ textDecoration: "none" }}>
                  <Nav.Link href="#stake" className=" mx-1" id="navbartext">
                  Stake
                  </Nav.Link>
                </Link>

                <Link to="/steroids" style={{ textDecoration: "none" }}>
                  <Nav.Link href="#steroids" className=" mx-1" id="navbartext">
                  SOLPounding
                  </Nav.Link>
                </Link>
                
                <Link to="/whitepaper" style={{ textDecoration: "none" }}>
                  <Nav.Link href="" className=" mx-1" id="navbartext">
                  Whitepaper
                  </Nav.Link>
                </Link>

                
                
                  <Nav.Link href="https://t.me/solisium_network" className=" mx-1" id="navbartext">
                  Join Telegram
                  </Nav.Link>
                
                  <Nav.Link href="https://bsc.solisium.network" className=" mx-1" id="navbartext">
                  BSC Mainnet
                  </Nav.Link>
                
                
              </Nav>
              <Nav className="me-3">
                
                {/* <MdLanguage/> */}
                
                
               
                <div className="mx-2 connbtn">
                  <button onClick={handleAuth} className="btn btn-light">
                   
                    {/* Connect Wallet */}
                    {account ? account : "Connect Wallet"}
                  </button>
                </div>
              </Nav>
            </Navbar.Collapse>
          
        </Navbar>
        
        
      </div>
    </div>
  );
};

export default Navbarapp;
