import React, { useState, useEffect, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import sols from "../../images/sols.png";
import info from "../../images/info.svg";
import chart from "../../images/chartsoon.PNG"
import axios from "axios";
import { loadWeb3 } from "../api";
import Chart from "../Facuet/Chart";
import { fountainContractAbi, fountainContractAddress } from '../utils/Fountain';
import { dripTokenAbi, dripTokenAddress } from '../utils/DripToken';
import { reservoirAbi, reservoirAddress } from '../utils/Reservoir';
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";


import './Reservuior.css'
import Web3 from "web3";
const webSupply = new Web3("https://polygon-rpc.com");

function Reservoir() {
  const { t, i18n } = useTranslation();
  let buyInput = useRef()
  let withdrawInput = useRef();
  let [userBnbBalance, setUserBnbBalance] = useState(0);
  let [userDropBalance, setUserDropBalance] = useState(0);
  let [bnbDripPrice, setBnbDripPrice] = useState(0);
  let [userReward, setUserReward] = useState(0)
  let [totalDrops, setTotalDrops] = useState(0);
  let [stake, setStake] = useState(0);
  let [totalWithDraw, setTotalWithDraw] = useState(0);
  let [compundTotal, setCompoundTotal] = useState(0);
  let [compund, setCompound]=useState(0);
  let [player, setPlayer] = useState(0);
  let [loackedValue, setLoackedValue] = useState(0);
  let [totalTxs, setTotalTxs] = useState(0)
  let [reward, setReward] = useState(0);
  let [dividendPool, setDividendPool] =useState(0);
  let [contractBal, setContractBal]=useState(0)

  
  const getDataWithMetaMask = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        setUserReward(0)
      } else {
        const web3 = window.web3;
        let contractOf = new web3.eth.Contract(reservoirAbi, reservoirAddress);
        let fountainContract = new web3.eth.Contract(fountainContractAbi, fountainContractAddress);
        let bal = await fountainContract.methods.balanceOf(acc).call()
        bal= web3.utils.fromWei(bal);
        bal = parseFloat(bal).toFixed(5)
        let userRew = await contractOf.methods.dividendsOf(acc).call();
        userRew=  await contractOf.methods.calculateLiquidityToBnb(userRew).call()
        let stat = await contractOf.methods.statsOf(acc).call();
        userRew = web3.utils.fromWei(userRew);
        userRew = parseFloat(userRew).toFixed(11);
        let draw = web3.utils.fromWei(stat[1])
         draw = parseFloat(draw).toFixed(3)
         let totalCom = web3.utils.fromWei(stat[13])
         totalCom = parseFloat(totalCom).toFixed(3)
         let stk = web3.utils.fromWei(stat[0]);
         stk = parseFloat(stk).toFixed(3)
        setUserReward(userRew)
        setCompound(stat[14])
        setTotalWithDraw(draw);
        setCompoundTotal(totalCom);
        setStake(stk)
        setTotalDrops(bal)
      }
    } catch (e) {
      console.log("get data in ", e);
    }
  }

  const getDataWithoutMetaMask = async () => {
    try {
      let contract = new webSupply.eth.Contract(reservoirAbi, reservoirAddress);
      let players = await contract.methods.players().call();
      let loackBalance = await contract.methods.lockedTokenBalance().call();
      loackBalance =  webSupply.utils.fromWei(loackBalance);
      loackBalance = parseFloat(loackBalance).toFixed(3);
      let txs = await contract.methods.totalTxs().call();
      let rew = await contract.methods.dividendBalance().call()
      rew = webSupply.utils.fromWei(rew);
      rew = parseFloat(rew).toFixed(3);
      let divdPool = await contract.methods.collateralBalance().call();
      divdPool = webSupply.utils.fromWei(divdPool);
      divdPool = parseFloat(divdPool).toFixed(3);
      let displayDividendPool = divdPool / loackBalance;
      displayDividendPool = parseFloat(displayDividendPool).toFixed(3);

      let conBal =await window.web3.eth.getBalance(reservoirAddress)
      conBal = window.web3.utils.fromWei(conBal);
      conBal = parseFloat(conBal).toFixed(3)

      setContractBal(conBal)
      setPlayer(players);
      setLoackedValue(loackBalance)
      setTotalTxs(txs)
      setReward(rew);
      setDividendPool(displayDividendPool)
    } catch (e) {
      console.log("error while get without metamsk data", e);
    }

  }

  const bnbBalance = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        setUserBnbBalance(0)
      } else {
        const web3 = window.web3;
        let userBnB = await web3.eth.getBalance(acc);
        let convertUserBnB = await web3.utils.fromWei(userBnB);
        convertUserBnB = parseFloat(convertUserBnB).toFixed(3)
        setUserBnbBalance(convertUserBnB)
      }
    } catch (e) {
      console.log("error while get bnb balance", e);
    }
  }
  const dropBalance = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        setUserDropBalance(0);
      } else {
        const web3 = window.web3;
        let fountainContract = new web3.eth.Contract(fountainContractAbi, fountainContractAddress);
        let contract = new web3.eth.Contract(reservoirAbi, reservoirAddress);
        let userDrop = await fountainContract.methods.balanceOf(acc).call();
        let convertuserDrop = await web3.utils.fromWei(userDrop);
        convertuserDrop = parseFloat(convertuserDrop).toFixed(3)
        setUserDropBalance(convertuserDrop)

      }
    } catch (e) {
      console.log("error while get Drop balance", e);
    }
  }

  const getPerBnbDripPrice = async () => {
    try {
      let acc = await loadWeb3()
      if (acc == "No Wallet") {
        setBnbDripPrice(0);
      } else {
        let web3 = window.web3;
        let contract = new web3.eth.Contract(dripTokenAbi, dripTokenAddress);
        let dropBal = await contract.methods.balanceOf(reservoirAddress).call();
        dropBal = await web3.utils.fromWei(dropBal);
        let reservireBnb = await web3.eth.getBalance(reservoirAddress);
        reservireBnb = await web3.utils.fromWei(reservireBnb);
        let price = reservireBnb / dropBal;
        price = parseFloat(price).toFixed(3)
        setBnbDripPrice(price);

      }

    } catch (e) {
      console.log("get Per Bnb Price", e);
    }
  }

  const buy = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        const web3 = window.web3;
        let bal = await web3.eth.getBalance(acc);
        let convertbal = web3.utils.fromWei(bal)
        convertbal = parseFloat(convertbal)
        let userValue = buyInput.current.value;
if(buyInput.current.value != "" && buyInput.current.value != undefined){
  if(buyInput.current.value > 0.01){
    if(userValue <= convertbal){
      let trHash = ""
      let contract = new web3.eth.Contract(reservoirAbi, reservoirAddress);
      await contract.methods.buy().send({
        from: acc,
        value: web3.utils.toWei(buyInput.current.value)
      })
      .on("transactionHash", async(hash)=>{
        let data = {
          hash:hash,
          toAddress :reservoirAddress,
            fromAddress : acc,
            id:acc,
            amount:buyInput.current.value
        }
        await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/postEvents",data);
      })

      toast.success("Transaction confirmed")
    }else{
      toast.error("Insufficient balance");
    }
  }else{
    toast.error("Amount cannot be less than 0.01")

  }
}else{
  toast.error("Looks like you forgot to enter amount")
}
      }

    } catch (e) {
      console.log("error while buy function", e);
      toast.error("Transaction Failed")
    }

  }
  const compound = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        const web3 = window.web3;
        let contract = new web3.eth.Contract(reservoirAbi, reservoirAddress);
        let val = await contract.methods.dividendsOf(acc).call()
        if (val > 0) {

          let comp =await contract.methods.reinvest().send({
            from: acc
          });

          toast.success("Transaction confirmed")

        } else {
          toast.error("Insufficient dividend balance")
        }
      }
    } catch (e) {
      console.log("error while compound", e);
    }
  }
  const claim = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        const web3 = window.web3;
        let reserContract = new web3.eth.Contract(reservoirAbi, reservoirAddress);
        let dividendsOf = await reserContract.methods.dividendsOf(acc).call();
        dividendsOf = web3.utils.fromWei(dividendsOf)

        if (dividendsOf <= 0) {
          toast.error("Dividends cannot be zero")
        } else {

          await reserContract.methods.withdraw().send(
            { from: acc })

          toast.success("Transaction confirmed")}

      }

    } catch (e) {
      toast.error("Transaction failed")
      console.log("error while claim", e);
    }
  }
  const withdraw = async () => {
    try {
      let acc = await loadWeb3();

      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        const web3 = window.web3;

        let reserContract = new web3.eth.Contract(reservoirAbi, reservoirAddress)
        let balance = await reserContract.methods.balanceOf(acc).call();
        balance = web3.utils.fromWei(balance);
        if (withdrawInput.current.value == "") {
          toast.error("Withdrawal amount field cannot be empty");
        }
        else if (withdrawInput.current.value <= 0) {
          toast.error("Withdrawal amount must be greater than 0")
        } else if (balance <= 0) {
          toast.error("Insufficient Balance")
        } else if (withdrawInput.current.value <= balance) {
          let trHash = ""
          let val = web3.utils.toWei(withdrawInput.current.value);
          await reserContract.methods.sell(val).send(
            { from: acc }
            )
            .on("transactionHash",async(hash)=>{
              let data = {
                hash:hash,
                toAddress :reservoirAddress,
              fromAddress : acc,
              id:acc,
              amount:withdrawInput.current.value
            }
            await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/postEvents",data);
          })

          toast.success("Withdraw confirmed")
        } else {
          toast.error("Insufficient balance")
        }


      }

    } catch (e) {
      toast.error("Transaction Failed")
      console.log("error while withdraw", e);
    }
  }


  useEffect(() => {
    window.scrollTo(0, 0);
    setInterval(() => {
      getPerBnbDripPrice();
      bnbBalance();
      dropBalance()
      getDataWithMetaMask();
      getDataWithoutMetaMask();
    }, 1000);
  }, []);

  return (
    <div className="images fbg">
      <div id="reservoir">

        <div className="container">
          <div className="landing-page">

            <div style={{paddingTop: "60px"}} className="row mb-4 mt-2">
              <div className="container col-12 col-xl-6 col-xl-6new col-lg-6 col-md-6 mb-4">
                <div className="card  text-white" style={{ backgroundColor: "#4e2e4b" }}>
                  <div className="card-body">
                    <div className="swaptitle1">Liquidity Farm</div>
                    
                    <div className="row mb-4 mt-2">
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-4 col-lg-4 col-md-4">
                          <label style={{fontSize: "12px", color: "rgb(169, 167, 167)"}}><a className="contraddr1" href="https://polygonscan.com/token/0x3be7fbe56bc94839fb0024237a054e7cb00de053">(0x3bE7fbE56Bc94839FB0024237a054e7cB00DE053)</a></label><br/>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-4 col-lg-4 col-md-4">
                          
                      </div>
                    </div>

                    <div className="row mb-4 mt-2">
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Rewards</label><br/>
                          <span className="notranslate  containertextbig1">{userReward}</span>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Total SLSL balance</label><br/>
                          <span className="notranslate  containertextbig1">{totalDrops}</span>
                      </div>
                    
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Stake</label><br/>
                          <span className="notranslate  containertextbig1">{stake}</span>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Contract balance</label><br/>
                          <span className="notranslate  containertextbig1">{contractBal} {t("MATIC.1")}</span>
                      </div>
                      </div>
                      <div className="row mb-4 mt-2">
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Withdrawn</label><br/>
                          <span className="notranslate  containertextbig1">{totalWithDraw}</span>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Total compounded</label><br/>
                          <span className="notranslate  containertextbig1">{compundTotal}</span>
                      </div>
                      
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Total locked</label><br/>
                          <span className="notranslate  containertextbig1">{loackedValue}</span>
                      </div>
                      <div style={{maxWidth: "50%"}} className="container col-12 col-xl-2 col-lg-4 col-md-4">
                          <label className="labelstats">Dividend pool</label><br/>
                          <span className="notranslate  containertextbig1">{dividendPool}</span>
                      </div>
                      </div>
                      <div className="row mb-4 mt-2">
                      <div className="btncompcontainer">
                        <button
                    
                    type="button"
                    className="btn btn-outline-lightxx btn-block bigbtn btncmp2"
                    onClick={compound}
                  >
                    Compound

                  </button>
                    
                  <button
                    
                    type="button"
                    className="btn btn-outline-lightxx btn-block bigbtn btncmp3"
                    onClick={claim}
                  >
                    Claim
                  </button>
                  </div>
                  </div>
                  <Chart/>
                    </div>
                  </div>
                </div>
              
              <div className="container col-12 col-xl-3 col-lg-6 col-md-6 mb-4">
                <div className="card mb-2 text-white" style={{ backgroundColor: "#4e2e4b", color: "#dacc79", minHeight: "200px" }}>
                  <Tabs>
    <TabList>
      <Tab><div className="tab_btn">Buy</div></Tab>
      <Tab><div style={{marginLeft:""}} className="tab_btn">Withdraw</div></Tab>

    </TabList>

    <TabPanel>
      <div className="card-body">
                    {/* <div className="landing-page"> */}
                    <div className="text-left">
                     
                      {/* <div className="col-6 text-right  "> */}{" "}
                      <p
                        className="d-flex text-left"
                        style={{ lineHeight: "10%" }}
                      >
                        {t("MATICBalance.1")}: {userBnbBalance} ({bnbDripPrice})
                        
                      </p>
                      {/* </div> */}
                    </div>

                    <form>
                      <div className="form-group">
                        
                        <div role="group" className="input-group">
                          <input
                            type="number"
                            placeholder="MATIC"
                            className="form-control"
                            id="__BVID__213"
                            ref={buyInput}
                          />
                        </div>
                          <small class="form-text"><p>Estimated SLSL: 0</p></small>
                      </div>
                      <div className="row justify-content-end">
                        <div className="col-12 text-left">
                          <button
                            type="button"
                            onClick={() => buy()}
                            className="btn btn-outline-lightx btn-block bigbtn"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                      
                    </form>
                    {/* </div> */}
                    <p />
                  </div>
    </TabPanel>
    <TabPanel>
      <div className="card-body">
                    <div className="landing-page">
                      
                      
                      <form>
                        <div className="form-group">
                          <div className="row">
                            
                            <div className="col-12 text-left ">
                              {" "}
                              <p>
                                {t("DropBalance.1")}: {userDropBalance}
                                </p>
                                
                              
                            </div>
                          </div>
                          <div role="group" className="input-group">
                            <input
                              type="number"
                              placeholder="SLSL"
                              className="form-control"
                              id="__BVID__213"
                              ref={withdrawInput}
                            />
                          </div>
                        </div>
                        <div className="row justify-content-end">
                          <div className="col-12 text-left">
                            <button
                              type="button"
                              className="btn btn-outline-lightx btn-block bigbtn"

                              onClick={withdraw}
                            >

                              {t("Withdraw.1")}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <p />
                  </div>
    </TabPanel>

  </Tabs>
                  
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
}

export default Reservoir;
