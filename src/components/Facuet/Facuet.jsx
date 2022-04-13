import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import 'react-tabs/style/react-tabs.css';
import info from "../../images/info.svg";

import Chart from "../Facuet/Chart"

import { toast } from 'react-toastify';
import { faucetContractAddress, faucetContractAbi, faucetTokenAddress, faucetTokenAbi } from "../utils/Faucet";
import { buddySystemAddress, buddySystemAbi } from "../utils/BuddySystem"
import "./Facuet.css";
import { useTranslation } from "react-i18next";
import { loadWeb3 } from "../api";
import axios from 'axios'
import { useMoralis } from 'react-moralis';

import Web3 from "web3";

const webSupply = new Web3("https://polygon-rpc.com");


const Facuet = ({ oneTokenPrice }) => {


  const {account, Moralis} = useMoralis();

  let buddySearch = useRef()
  let [availabe, setAvailable] = useState(0);
  let [myDeposited, setMyDeposited] = useState(0);
  let [maxPayout, setMaxPayout] = useState(0);
  let [clamied, setClaimed] = useState(0);
  let [team, setTeam] = useState(0);
  let [directs, setDirects] = useState(0);
  let [inDirects, setInDirects] = useState(0)
  // player
 
  let [showPlayer, setShowPlayer] = useState(0)
  let [showTotalUser, setShowTotalUser] = useState(0)
  let airDropPlayerAddress = useRef()

  let [avalibleUSDT, setAvaliableUSDT] = useState(0)
  let [depositUSDT, setDepositUSDT] = useState(0)

  // users balance

  let [userDripBalance, setuserDripBalance] = useState(0);
  let [usersBalance, setUsersBalance] = useState(0);
  let [myCal, setMycal] = useState(0);

  // for direct air drop

  let airAddress = useRef();
  let airAmount = useRef();
  //for Current Wave Starter
  let [currentWaveStarter, setCurrentWaveSarter] = useState(0);
  let [manager, setManger] = useState(0);
  let [benificiary, setBenificiary] = useState(0);
  let [lastCheckin, setLastCheckin] = useState(0);
  
  
  const { t, i18n } = useTranslation();
  const inputEl = useRef();
  const buddy = useRef();
 
  let [storeRefarl, setStoreRefral] = useState([])
  const [myBud, setMyBud] = useState('');


  const handleBud = (e) =>{
    setMyBud(e.target.value);
  }

  const getData = async () => {

    let acc = account;
    if (!account) {
      try {

        // let contractOf = new webSupply.eth.Contract(faucetContractAbi, faucetContractAddress);
        // let tokenContractOf = new webSupply.eth.Contract(faucetTokenAbi, faucetTokenAddress);
        // let contractInfo = await contractOf.methods.contractInfo().call();
        // let myTeam = contractInfo._total_users;
        // setTeam(myTeam);

      } catch (e) {
        console.log("Error while getting data with out meta mask in faucet");
      }

    } else {
      try {

        const web3 = new Web3(webSupply);
        let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
        let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);

        let contractInfo = await contractOf.methods.contractInfo().call();
        let myTeam = contractInfo._total_users;
        setTeam(myTeam);
        let userInfoTotal = await contractOf.methods.userInfoTotals(acc).call();
        let totalDeposits = userInfoTotal.total_deposits;
        let team = userInfoTotal.referrals
        if(team > 0){
          let totalUsers = await contractOf.methods.total_users().call()
          setShowTotalUser(totalUsers)
        }
        let Uinfo = await contractOf.methods.userInfo(acc).call();
        let totalclaimed = Uinfo.payouts;
        let payOutOf = await contractOf.methods.payoutOf(acc).call();

        let myclaimsAvailable = await contractOf.methods.claimsAvailable(acc).call();
        myclaimsAvailable = web3.utils.fromWei(myclaimsAvailable);
        myclaimsAvailable = parseFloat(myclaimsAvailable).toFixed(3);
        let netPay = payOutOf.net_payout;
        let maxPay = payOutOf.max_payout;
        let dripBalance = await tokenContractOf.methods.balanceOf(acc).call();
        dripBalance = web3.utils.fromWei(dripBalance);
        dripBalance = parseFloat(dripBalance).toFixed(3);

        let balance = await web3.eth.getBalance(acc);
        balance = web3.utils.fromWei(balance);
        balance = parseFloat(balance).toFixed(3);

        let calculated = balance / dripBalance;
        calculated = parseFloat(calculated).toFixed(6);

        


        // set directs and indirects

        let users = await contractOf.methods.users(acc).call();
        let dir = users.direct_bonus
        dir = web3.utils.fromWei(dir);
        dir = parseFloat(dir).toFixed(1);
        setDirects(dir)

        let inDir = users.match_bonus;
        inDir = web3.utils.fromWei(inDir);
        inDir = parseFloat(inDir).toFixed(3);
        setInDirects(inDir);

        setUsersBalance(balance);
        setuserDripBalance(dripBalance);
        setMycal(calculated);

        totalclaimed = web3.utils.fromWei(totalclaimed);
        totalclaimed = parseFloat(totalclaimed).toFixed(3);
        totalDeposits = web3.utils.fromWei(totalDeposits);
        totalDeposits = parseFloat(totalDeposits).toFixed(3);
        maxPay = web3.utils.fromWei(maxPay);
        maxPay = parseFloat(maxPay).toFixed(3);
        
        
        netPay = web3.utils.fromWei(netPay);
        netPay = parseFloat(netPay).toFixed(6)
        setShowPlayer(team)
        setMyDeposited(totalDeposits);
        let depoUsdt = totalDeposits * oneTokenPrice;
        depoUsdt = parseFloat(depoUsdt).toFixed(3)
        setDepositUSDT(depoUsdt)
        setMaxPayout(maxPay);
        setAvailable(myclaimsAvailable);
        let avalUsdt = myclaimsAvailable * oneTokenPrice;

        avalUsdt = parseFloat(avalUsdt).toFixed(3)

        setAvaliableUSDT(avalUsdt)
        setClaimed(totalclaimed);
      } catch (e) {
        console.log("error while getting data in faucet", e);
      }
    }
  }

  //Direct AirDrop
  const directAirDrop = async () => {
    try {
      let acc = account;
      if (!account) {
        toast.error("No Wallet Connected")
      }
      else {

        let enteredAirVal = airAmount.current.value;
        let enteredAddrs = airAddress.current.value;
        if (parseFloat(enteredAirVal) > 0) {
          if (enteredAddrs.length > 10) {
            if (parseFloat(userDripBalance) > parseFloat(enteredAirVal)) {



              const web3 = window.web3;
              let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
              let usersinf = await contractOf.methods.users(enteredAddrs).call();
              let uplineAddress = usersinf.upline;
              let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);

              enteredAirVal = web3.utils.toWei(enteredAirVal);
              if (uplineAddress == "0x0000000000000000000000000000000000000000") {
                toast.error("No Refferral ")
              } else {


                await tokenContractOf.methods.approve(faucetContractAddress, enteredAirVal).send({
                  from: acc
                });
                toast.success("Transaction confirmed")

                await contractOf.methods.airdrop(enteredAddrs, enteredAirVal).send({
                  from: acc
                })
                toast.success("Transaction confirmed")
              }
            } else {
              toast.error("Insufficient Balance Please Recharge!")
            }
          } else {
            toast.error("Incorrrect palyer's Address")
          }
        } else {
          toast.error("Looks like you forgot to enter Splash Amount")
        }
      }

    } catch (e) {
      toast.error("Transaction Failed")
      console.log("Error :", e)
    }
  }
  // Custody

  const custody = async () => {
    let acc = account;
    if (!account) {
      console.log("Not Connected")
    }
    else {
      try {
        
        let contractOf = new webSupply.eth.Contract(faucetContractAbi, faucetContractAddress);
        let myCustody = await contractOf.methods.custody(acc).call();
        let myManager = myCustody.manager;
        let myBenificiary = myCustody.beneficiary;
        let myLastCheckIn = myCustody.last_checkin;

        let contractOfBuddy = new webSupply.eth.Contract(buddySystemAbi, buddySystemAddress);
        let referral = await contractOfBuddy.methods.buddyOf(acc).call();
        setLastCheckin(myLastCheckIn);
        setManger(myManager);
        setBenificiary(myBenificiary);
        setCurrentWaveSarter(referral);

      } catch (e) {
        console.log("Error while getting custody data")
      }
    }

  }


    async function getReferral(account){
      const referralReadOptions = {
        contractAddress: buddySystemAddress,
        functionName: "buddyOf",
        abi: buddySystemAbi,
        params: {
          buddy: account
        }
  };
    const referral = await Moralis.executeFunction(referralReadOptions);
    return referral;
      }


    async function getAllownace(account){
      const referralReadOptions = {
        contractAddress: faucetTokenAddress,
        functionName: "allownace",
        abi: faucetTokenAbi,
        params: {
          _owner: account,
          _spender: faucetContractAddress      }
   };
    const allowance = await Moralis.executeFunction(referralReadOptions);
    return allowance;
      }

  
  const approveAmount = async () => {
    try {
   
      if (!account) {
        toast.error("No wallet connected")
      } else {        
        
        let enteredVal = inputEl.current.value;

        if (enteredVal >= 1) {
          if (parseFloat(userDripBalance) >= parseFloat(enteredVal)) {   
            
            const referralReadOptions = {
              contractAddress: buddySystemAddress,
              functionName: "buddyOf",
              abi: buddySystemAbi,
              params: {
                player: account
              }
        };
          const referral = await Moralis.executeFunction(referralReadOptions);
             
            console.log(referral + 'ref')

            const approveOptions = {
                    contractAddress: faucetTokenAddress,
                    functionName: "approve",
                    abi: faucetTokenAbi,
                    params: {
                      _spender: faucetContractAddress,
                      _value: Moralis.Units.ETH(enteredVal)
                    }
            };        

          
           
            if (referral.length > 15) {

              const transaction = await Moralis.executeFunction(approveOptions);
              await transaction.wait();
              toast.success("Transaction confirmed")

            } else {
              toast.error("You have no Buddy.");

            }
          } else {
            toast.error("Entered value is greater than your balance")
          }
        } else {
          toast.error("Deposit amount should be greater than 1")
        }
      }
    } catch (e) {
      toast.error("Transaction failed")
      console.log("error while approve amount", e);
    }
  }
  const depositAmount = async () => {
    
    try {
      
      if (!account) {
        toast.error("No Wallet connected")
      } else {
       
        let enteredVal = inputEl.current.value;
        if (enteredVal >= 1) {
          if (parseFloat(userDripBalance) > parseFloat(enteredVal)) {
            
            const referralReadOptions = {
              contractAddress: buddySystemAddress,
              functionName: "buddyOf",
              abi: buddySystemAbi,
              params: {
                player: account
              }
        };
          const referral = await Moralis.executeFunction(referralReadOptions);
            if (referral) {       

              const referralReadOptions = {
                contractAddress: faucetTokenAddress,
                functionName: "allowance",
                abi: faucetTokenAbi,
                params: {
                  _owner: account,
                  _spender: faucetContractAddress      }
           };
            const allowance = await Moralis.executeFunction(referralReadOptions);
                          
              console.log("allowance: " + allowance);
              if (allowance >= parseFloat(Moralis.Units.ETH(enteredVal))) {

                const sendOptions = {
                  contractAddress: faucetContractAddress,
                  functionName: "deposit",
                  abi: faucetContractAbi,
                  params: {
                    _upline: '0x4775Caf1aA4f80F183eE7e4b5E3ccc22dA23F56A',
                    _amount: Moralis.Units.ETH((enteredVal))
                  },
                  
                  
                  }
                  const transaction = await Moralis.executeFunction(sendOptions);
                  console.log(transaction.hash)      
                  await transaction.wait()
                 .on("transactionHash", async (hash) => {
                  let data = {
                    hash: hash,
                    toAddress: faucetContractAddress,
                    fromAddress: account,
                    id: account,
                    amount: enteredVal
                  }
                  await axios.post("https://splash-test-app.herokuapp.com/api/users/postEvents", data);
                })
                toast.success("Transaction confirmed");
              } else {
                toast.error("Entered value is greater than your approval amount ")
              }

            } else {
              toast.error("You have no Buddy.");

            }
          } else {
            toast.error("Entered value is greater than your balance")
          }
        } else {
          toast.error("Deposit amount should be greater than 1 ")
        }
      }
    } catch (e) {
      toast.error("Transaction Failed ")
      console.log("Transaction Failed", e)
    }
  }

  const updatemyBuddy = async () => {
    try {
      let acc = account
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected");
      } else {

        if (buddy.current.value < 0) {
          toast.error("Please enter buddy refral")
        } else {
          const web3 = window.web3;
          let enteredVal = buddy.current.value;
          let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
          let userInfoTotal = await contractOf.methods.userInfoTotals(enteredVal).call();
          let nedeposit = userInfoTotal.total_deposits;
          nedeposit = webSupply.utils.fromWei(nedeposit);
          nedeposit = parseFloat(nedeposit)
          if (nedeposit < 0) {
            toast.error("No Directs avaliable")
          } else {
            if (enteredVal == acc) {
              toast.error("Same address not accepted")
            } else {
              let contractOfBuddy = new web3.eth.Contract(buddySystemAbi, buddySystemAddress);
              await contractOfBuddy.methods.updateBuddy(enteredVal).send({
                from: acc
              })
              let data = {
                referee: acc
              }
              await axios.post("https://splash-test-app.herokuapp.com/api/users/treeReferral", data);
              toast.success("Buddy updated")
            }
          }
        }
      }
    } catch (e) {
      toast.error("Buddy rejected")
      console.log("error while update buddy", e);
    }
  }
  const myClaim = async () => {

    try {
      
      if (!account) {
        toast.error("No Wallet Connected!")
      } else {
        if (availabe > 0) {
          const sendOptions = {
            contractAddress: faucetContractAddress,
            functionName: "claim",
            abi: faucetContractAbi,           
            
            }
            const transaction = await Moralis.executeFunction(sendOptions);
            console.log(transaction.hash)      
            await transaction.wait()
           .on("transactionHash", async (hash) => {
            let data = {
              hash: hash,
              toAddress: account,
              fromAddress: faucetContractAddress,
              id: account,
              amount: availabe
            }
            await axios.post("https://splash-test-app.herokuapp.com/api/users/postEvents", data);
          })

          toast.success("Transaction confirmed")
        } else {
          toast.error("No Claims Available")
        }
      }

    } catch (e) {
      toast.error("Transaction Failed")
    }

  }
  const getOwnerReferral = async () => {
    try {
      let contractOf = new webSupply.eth.Contract(faucetContractAbi, faucetContractAddress);
      let ownwerAddrss = await contractOf.methods.dripVaultAddress().call();
      buddy.current.value = ownwerAddrss;
    } catch (e) {
      console.log("Error :", e)
    }

  }

  const hydarated = async () => {
    try {
      
      if (!account) {
        toast.error("No Wallet Connected");
      }
      else {
        if (availabe > 0) {
          const sendOptions = {
            contractAddress: faucetContractAddress,
            functionName: "roll",
            abi: faucetContractAbi,           
            
            }
            const transaction = await Moralis.executeFunction(sendOptions);
            console.log(transaction.hash)      
            await transaction.wait()
          
          toast.success("Transaction confirmed")
        } else {
          toast.error("No Availabe Claims you need to deposit first")
        }
      }

    } catch (e) {
      toast.error("Transaction Failed")
      console.log("Error while calling hydrated function");
    }

  }
  const getMaxBal = async () => {
    try {
      let acc = account
      if (!account) {
        toast.error("No wallet Connected")
      } else {
        const web3 = window.web3;
        let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
        let bal = await tokenContractOf.methods.balanceOf(acc).call();
        bal = await web3.utils.fromWei(bal);
        // bal = parseFloat(bal).toFixed(3)
        inputEl.current.value = bal;

      }
    } catch (e) {
      console.log("error while get max balance", e);
    }
  }
  

  useEffect(() => {
    window.scrollTo(0, 0);
    setInterval(() => {
      getData();
      custody();
    }, 1000);
  }, []);
  return (
    <div className="images fbg">
      <div id="faucet">

        <div className="container">
          <div className="landing-page">

            <div style={{paddingTop: "60px"}} className="row mb-4 mt-2">
              <div className="container col-12 col-xl-6 col-xl-6new col-lg-6 col-md-6 mb-4">
                <div className="card  text-white" style={{ backgroundColor: "#4e2e4b" }}>
                  <div className="card-body">
                    <div className="swaptitle1">STAKE SOLS 3% DAILY</div>
                    <div><p className='pmainpage'>Stake is the main Solisium staking contract that will give 3% daily returns on investment. Being a low risk, high return contract, we do not need to implement special rules for this. Staking is done with the same SOLS token that most of you are familiar with.<br/><br/>Rules are simple:<br/>1. You can stake your SOLS and get 3% daily returns on initial and compounded investments.<br/>2. You can compound at your desire without special rules in place.<br/> 3. You can claim at your desire as many times you like but we recommend compound regularly to increase your staked amount and therefore your daily returns.<br/> 4. Have fun and be calculated when it comes to investments as your choices and contributions impact the price of SOLS and will determine your future returns.<br/><br/>The staking contract is backed by our insurance vault that will level out any possible drainage possibilities. This vault is constantly supplied with 1% of all taxes and with 20% of the initial presale funding.</p></div>
                    
                    <div className="row mb-4 mt-2">
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-4 col-lg-4 col-md-4">
                      <label style={{fontSize: "12px", color: "rgb(169, 167, 167)"}}><a className="contraddr1" href="">(SOON)</a></label><br/>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-4 col-lg-4 col-md-4">
                          
                      </div>
                    </div>

                    <div className="row mb-4 mt-2">
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Earned SOLS</label><br/>
                          <span className="notranslate  containertextbig1">{availabe}</span>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Deposited SOLS</label><br/>
                          <span className="notranslate  containertextbig1">{myDeposited}</span>
                      </div>

                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Claimed</label><br/>
                          <span className="notranslate  containertextbig1">{clamied} SOLS</span>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">My balance</label><br/>
                          <span className="notranslate  containertextbig1">{userDripBalance} SOLS</span>
                      </div>
                      </div>
                      <div className="row mb-4 mt-2">
                      <div className="">
                  <button
                    onClick={() => hydarated()}
                    
                    type="button"
                    className="btn btn-outline-lightxx btn-block bigbtn btncmp2"
                  >
                    Recompound
                  </button>
                    
                  <button
                    
                    onClick={() => myClaim()}
                    type="button"
                    className="btn btn-outline-lightxx btn-block bigbtn btncmp3"
                  >
                    Claim
                  </button>
                      </div>
                    </div>
                    <Chart/>
                    </div>
                  </div>
                </div>

  




              
              
                  
           
              <div className="container col-12 col-xl-3 col-lg-4 col-md-4">
                
                <div className="card text-white" style={{ backgroundColor: "#4e2e4b", color: "#dacc79", minHeight: "200px"}}>
                <Tabs>
    <TabList>
      <Tab><div className="tab_btn">Deposit</div></Tab>
      <Tab><div style={{marginLeft:""}} className="tab_btn">Transfer</div></Tab>
      <Tab><div style={{marginLeft:""}} className="tab_btn"><img style={{width: "14px", marginTop: "-5px", marginLeft: "-10px"}} src={info}/></div></Tab>
    </TabList>
<TabPanel>
                  <div className="card-body" >
                   
                    <div className="landing-page">
                      


                      <form>
                        <div className="form-group">
                          <div className="row">
                            
                            
                            <div className="col-12 text-left ">
                              {" "}
                              <p>
                                
                                
                              </p>
                            </div>
                          </div>
                          <div role="group" className="input-group">
                            <input
                              ref={inputEl}
                              type="number"
                              placeholder="SOLS"
                              className="form-control"
                              id="__BVID__213"
                            />
                            <button
                              type="button"
                              className="btn btn-info"
                              onClick={getMaxBal}
                              style={{
                                backgroundColor: "#7c625a",
                                border: "1px solid #7c625a",
                                fontSize: "16px"
                              }}
                            >
                              {t("Max.1")}
                            </button>
                          </div>
                          
                        </div>
                        <div className="row mb-4 mt-2">
                          <div className="">
                            <button 
                              onClick={() => approveAmount()}
                              type="button"
                              className="btn btn-outline-lightx btn-block bigbtn btncmp1"
                            >
                              {t("Approve.1")}
                            </button>
                            <button
                              onClick={() => depositAmount()}
                              type="button"
                              className="btn btn-outline-lightx btn-block bigbtn btncmp"
                            >
                              {t("Deposit.1")}

                            </button>
                          </div>

                        </div>
                      </form>
                      
                      
                    </div>
                   
                  </div>



</TabPanel>
<TabPanel>
    <div className="card-body" id="Airdroppart">
                              
                              <div id="referral-input">
                                <form className>
                                  <div id="referral-input">
                                    <fieldset
                                      className="form-group"
                                      id="__BVID__216"
                                    >
                                      <h3>
                                        <legend
                                          tabIndex={-1}
                                          className="bv-no-focus-ring col-form-label pt-1 "
                                          id="__BVID__216__BV_label_"
                                        >
                                          <p style={{ lineHeight: "40%" }}>
                                            Recipient
                                          </p>
                                        </legend>
                                      </h3>
                                      <div>
                                        <input

                                          type="text"
                                          placeholder="Address"
                                          ref={airAddress}
                                          className="form-control"
                                          id="__BVID__217"
                                        />
                                      </div>
                                    </fieldset>
                                  </div>
                                </form>
                              </div>
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-6 text-left">
                                    <label className="text-white ">
                                      <p style={{ lineHHeight: "30%" }}>
                                        {t("Amount.1")}
                                      </p>
                                    </label>
                                  </div>
                                  <div className="col-6 text-right ">
                                    {" "}
                                    <p style={{ lineHHeight: "30%" }}>
                                      SOLS:{" "}
                                      <label className="user-balance text-white ">
                                        {userDripBalance}
                                      </label>
                                    </p>
                                  </div>
                                </div>
                                <div
                                  role="group"
                                  className="input-group"
                                  style={{ lineHHeight: "30%" }}
                                >
                                  <input
                                    type="number"
                                    placeholder="SOLS"
                                    ref={airAmount}
                                    className="form-control"
                                    id="__BVID__213"
                                  />
                                </div>
                              </div>
                              <div>
                                <button

                                  onClick={() => directAirDrop()}
                                  
                                  type="button"
                                  className="btn btn-outline-lightx btn-block bigbtn"
                                >
                                  {t("SEND.1")}
                                </button>
                              </div>
                            </div>             
</TabPanel>
<TabPanel>
  <p style={{fontWeight: "normal", fontSize: "12px", padding: "20px"}}>The staking contract was designed to offer a 3% daily return (540% maximum payout over 180 days) passively through a well developed contract that is secured against drainage, with the possibility to mint new tokens that cover all user earnings. The tax pool is maintained by the 10% tax on all transactions. Users can participate by purchasing SOLS from our swap page and depositing to the stake contract. <br/> Users can then claim the daily returns or recompound them. Recompounding is the preferred option for many users as it increases their daily returns and value of the SOLS token. <br/><br/>The Transfer section lets you transfer your SOLS deposit from your account to the recipient address of your choice.
There is no transaction fee for transfers. </p>
</TabPanel>
</Tabs>
</div>
                
              
                <div className="card text-white" style={{ backgroundColor: "#4e2e4b", color: "#dacc79", minHeight: "200px", marginTop: "30px"}}>
                  <div className="card-body">

                    <p className=" fst-italic" style={{ fontSize: "14px", textTransform: "uppercase" }}>
                      Current Referral
                    </p>
                    <span
                      className=" fst-italic"
                      style={{
                        color: "#b8b6b6",
                        fontSize: "12px",
                        lineHeight: "30%",
                      }}
                    >
                      <b>{currentWaveStarter}</b>
                    </span>


                    <p className=" fst-italic" style={{ fontSize: "14px", textTransform: "uppercase"  }}>
                      {t("LastCheckin.1")}
                    </p>
                    <span
                      className=" fst-italic"
                      style={{
                        color: "#b8b6b6",
                        fontSize: "12px",
                        lineHeight: "30%",
                      }}
                    >
                      <b>{lastCheckin}</b>
                    </span>


                    <form className>
                      <div id="buddy-input">
                        <fieldset className="form-group" id="__BVID__216">
                          <h3>
                            <legend
                              tabIndex={-1}
                              className="bv-no-focus-ring col-form-label pt-1 fst-italic"
                              id="__BVID__216__BV_label_"
                            >
                              <p style={{ lineHeight: "40%" , textTransform: "uppercase" }}>
                                Referral Address
                              </p>
                            </legend>
                          </h3>
                          <div>
                            <input
                              ref={buddy}
                              type="text"
                              placeholder="Address"
                              className="form-control"
                              id="__BVID__217"
                            />
                          </div>
                        </fieldset>
                        <div>
                          <button
                            onClick={() => updatemyBuddy()}
                            type="button"
                            className="btn btn-outline-lightx"
                          >
                            {t("Update.1")}
                          </button>
                        </div>
                        <div>
                          <br />
                          <button
                            onClick={() => getOwnerReferral()}
                            type="button"
                            className="btn btn-outline-lightx"
                          >
                            Support Solisium
                          </button>
                        </div>
                      </div>
                    </form>
                    <p />
                  </div>
                </div>
              </div>  
            </div>
            
            
          </div>
        </div>
      </div>
      
      <div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Facuet;
