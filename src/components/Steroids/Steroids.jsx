import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import 'react-tabs/style/react-tabs.css';
import info from "../../images/info.svg";
import chart from "../../images/chartsoon.PNG"
import sols from "../../images/sols.png";
import Chart from "../Steroids/Chart"

import { ToastContainer, toast } from 'react-toastify';
import { faucetContractAddress, faucetContractAbi, faucetTokenAddress, faucetTokenAbi } from "../utils/Steroids";
import { buddySystemAddress, buddySystemAbi } from "../utils/BuddySystem"
import "./Steroids.css";
import { useTranslation } from "react-i18next";
import { loadWeb3 } from "../api";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import price from 'crypto-price';
import Web3 from "web3";
import Table from 'react-bootstrap/Table'
import { indexOf } from "lodash";
const webSupply = new Web3("https://rpc.ftm.tools");


const Steroids = ({ oneTokenPrice }) => {
  let navigate = useNavigate();
  let buddySearch = useRef()
  let [isChange, setIschange] = useState("Viewer");
  let [availabe, setAvailable] = useState(0);
  let [myDeposited, setMyDeposited] = useState(0);
  let [maxPayout, setMaxPayout] = useState(0);
  let [clamied, setClaimed] = useState(0);
  let [team, setTeam] = useState(0);
  let [rewarded, setRewarded] = useState(0);
  let [directs, setDirects] = useState(0);
  let [inDirects, setInDirects] = useState(0)
  // player
  let [direct, setdirect] = useState(0);
  let [netDepppost, setnetDeposit] = useState(0);
  let [Airdropsent, setAirdropsent] = useState(0);
  let [AirdropLastSent, setAirdroplastsent] = useState(0);
  let [playerTeam, setPlayerteam] = useState(0);
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
  let [inActiveThreshols, setInactivethreshold] = useState(0);

  const { t, i18n } = useTranslation();
  const inputEl = useRef();
  const buddy = useRef();
  let addressInput = useRef();
  let [storeRefarl, setStoreRefral] = useState([])

  // run air drop
  let [checkSplash, setCheckSplash] = useState("1")
  let [checkDirects, setCheckDirects] = useState("0")
  let [checkCompaign, setCheckCompaign] = useState("0")
  let [showCompaign, setShowCompaign] = useState([]);
  let budgetRef = useRef()
  let dividBudgetRef = useRef();
  let [numberOfReciept, setNumberOfReciept] = useState(0);
  let [estimatePerPerson, setEstimatePerPerson] = useState(0)
  let [sendEstimateAmount, setSendEstimateAmount] = useState(0)
  let [sendAddress, setSendAddress] = useState([]);
  let [showTeamData, setShowTeamData] = useState([])
  let [showTeamStatus, setShowTeamStatus] = useState([])
  const getData = async () => {

    let acc = await loadWeb3();
    if (acc == "No Wallet") {
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

        const web3 = window.web3;
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
        let AvmaxPay = maxPay - totalclaimed;
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
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
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
              let ownwerAddrss = await contractOf.methods.dripVaultAddress().call();
              enteredAirVal = web3.utils.toWei(enteredAirVal);
              if (uplineAddress !== "0x0000000000000000000000000000000000000000") {
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
          toast.error("Looks like you forgot to enter SOLS Amount")
        }
      }

    } catch (e) {
      toast.error("Transaction Failed")
      console.log("Error :", e)
    }
  }
  // Custody

  const custody = async () => {
    let acc = await loadWeb3();
    if (acc == "No Wallet") {
      console.log("Not Connected")
    }
    else {
      try {
        let web3 = window.web3;
        let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
        let myCustody = await contractOf.methods.custody(acc).call();
        let myManager = myCustody.manager;
        let myBenificiary = myCustody.beneficiary;
        let myLastCheckIn = myCustody.last_checkin;

        let contractOfBuddy = new web3.eth.Contract(buddySystemAbi, buddySystemAddress);
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


  //Player Info
  const goPlayerinfo = async () => {
    let enteredAddress = addressInput.current.value;

    try {
      let data = {
        referee: enteredAddress
      }
      let res = await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/treeReferral", data);
      let contractOf = new webSupply.eth.Contract(faucetContractAbi, faucetContractAddress);
      let userInfoTotal = await contractOf.methods.userInfoTotals(enteredAddress).call();
      let playeruserInfo = await contractOf.methods.userInfo(enteredAddress).call();
      let totalUsers = await contractOf.methods.total_users().call()
      let myDirect = playeruserInfo.direct_bonus
      myDirect = webSupply.utils.fromWei(myDirect);
      myDirect = parseFloat(myDirect).toFixed(3)
      let nedeposit = userInfoTotal.total_deposits;
      let myrefferals = userInfoTotal.referrals;
      nedeposit = webSupply.utils.fromWei(nedeposit);
      nedeposit = parseFloat(nedeposit).toFixed(3)
      let aidropsent = userInfoTotal.airdrops_received;
      aidropsent = webSupply.utils.fromWei(aidropsent);
      aidropsent = parseFloat(aidropsent).toFixed(3);
      let airlstdrp = userInfoTotal.airdrops_total;
      airlstdrp = webSupply.utils.fromWei(airlstdrp);
      airlstdrp = parseFloat(airlstdrp).toFixed(3);
      setnetDeposit(nedeposit);
      setAirdropsent(aidropsent);
      setAirdroplastsent(airlstdrp);
      setPlayerteam(res.data.length);
      setdirect(myrefferals);
    } catch (e) {
      toast.error("Can't Fetch User's Information at the moment please try again later.")
      console.log("error", e)
    }
  }
  const approveAmount = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No wallet connected")
      } else {
        let acc = await loadWeb3();
        const web3 = window.web3;
        let enteredVal = inputEl.current.value;

        if (enteredVal >= 1) {
          if (parseFloat(userDripBalance) >= parseFloat(enteredVal)) {

            let contractOfBuddy = new web3.eth.Contract(buddySystemAbi, buddySystemAddress);
            let referral = await contractOfBuddy.methods.buddyOf(acc).call();
            let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
            let isWhiteList = await tokenContractOf.methods.whitelist(acc).call()
            let isExcluded = await tokenContractOf.methods.isExcluded(acc).call()
            if (referral.length > 15) {

              let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
              await tokenContractOf.methods.approve(faucetContractAddress, web3.utils.toWei(enteredVal))
                .send({
                  from: acc
                })
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
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet connected")
      } else {
        const web3 = window.web3;
        let enteredVal = inputEl.current.value;
        if (enteredVal >= 1) {
          if (parseFloat(userDripBalance) > parseFloat(enteredVal)) {
            let contractOfBuddy = new web3.eth.Contract(buddySystemAbi, buddySystemAddress);
            let referral = await contractOfBuddy.methods.buddyOf(acc).call();
            let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);

            if (referral != "0x0000000000000000000000000000000000000000") {
              let tokenContractOf = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
              let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);

              let trHash = ""
              let allowance = await tokenContractOf.methods.allowance(acc, faucetContractAddress).call();
              console.log("allowance", allowance);
              if (allowance >= parseFloat(web3.utils.toWei(enteredVal))) {
                await contractOf.methods.deposit(referral, web3.utils.toWei(enteredVal)).send({
                  from: acc
                }).on("transactionHash", async (hash) => {
                  let data = {
                    hash: hash,
                    toAddress: faucetContractAddress,
                    fromAddress: acc,
                    id: acc,
                    amount: enteredVal
                  }
                  await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/postEvents", data);
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
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected");
      } else {

        if (buddy.current.value <= 0) {
          toast.error("Please enter buddy refral")
        } else {
          const web3 = window.web3;
          let enteredVal = buddy.current.value;
          let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
          let userInfoTotal = await contractOf.methods.userInfoTotals(enteredVal).call();
          let nedeposit = userInfoTotal.total_deposits;
          nedeposit = webSupply.utils.fromWei(nedeposit);
          nedeposit = parseFloat(nedeposit)
          if (nedeposit <= 0) {
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
              await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/treeReferral", data);
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
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected!")
      } else {
        if (availabe > 0) {
          const web3 = window.web3;
          let trHash = ""
          let contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
          await contractOf.methods.claim().send({
            from: acc
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
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected");
      }
      else {
        if (availabe > 0) {
          const web3 = window.web3;
          const contractOf = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
          await contractOf.methods.roll().send({
            from: acc
          })
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
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
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
  const getUserAirDropAddress = async () => {
    // airDropPlayerAddress
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected");
      } else {
        airDropPlayerAddress.current.value = acc;
      }

    } catch (e) {
      console.log("error while get user address", e);
    }
  }
  // run team air drop
  const runTeamDrop = async () => {
    
    setNumberOfReciept(0)
    setEstimatePerPerson(0)
    setSendEstimateAmount(0);
    setSendAddress([])
    setShowCompaign([])
    setShowTeamStatus([])
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        if (airDropPlayerAddress.current.value > 0) {
          if (budgetRef.current.value > 0) {

            // userDripBalance
            if (parseFloat(userDripBalance) >= parseFloat(budgetRef.current.value)) {
              let data = {
                referee: airDropPlayerAddress.current.value
              }
              let checkReferal = [];
              let referralData = await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/getTreeRef", data)
              if (referralData.data.length) {
                checkReferal = referralData.data
                const web3 = window.web3;
                const faucetContract = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);

                let mapReferral = checkReferal.map(async (item) => {
                  return await faucetContract.methods.users(item).call();
                })

                mapReferral = await Promise.allSettled(mapReferral)

                let filterReferral = mapReferral.filter((item) => {

                  return (parseFloat(web3.utils.fromWei(item.value.direct_bonus)) >= checkDirects
                    && parseFloat( web3.utils.fromWei(item.value.deposits)) >= checkSplash)
                    && item.value.upline !== "0x0000000000000000000000000000000000000000"
                })

                if (filterReferral.length) {
                  if (checkCompaign == 0) {
                    setNumberOfReciept(filterReferral.length)
                    let dataAdd = []
                    let sAdd = []
                    let amount = budgetRef.current.value / filterReferral.length;
                    setEstimatePerPerson(parseFloat(amount).toFixed(2))
                    setSendEstimateAmount(amount)
                    let checkStatus = filterReferral.map(async (item) => {
                      return await faucetContract.methods.isNetPositive(item.value.entered_address).call();
                    })
                    checkStatus = await Promise.allSettled(checkStatus)
                    setShowTeamStatus(checkStatus)

                    filterReferral.slice(0, filterReferral.length).forEach((item) => {
                      let deposit = window.web3.utils.fromWei(item.value.deposits);
                      deposit = parseFloat(deposit).toFixed(2)
                      sAdd.push(item.value.entered_address)
                      dataAdd.push({

                        address: item.value.entered_address,
                        directs: item.value.referrals,
                        deposits: deposit,
                        amount: amount
                      })
                    })


                    setSendAddress(sAdd)
                    setShowCompaign(dataAdd)
                  } else if (checkCompaign == 1) {
                    let dataAdd = []
                    let sAdd = []
                    let amount = budgetRef.current.value;
                    setEstimatePerPerson(parseFloat(amount).toFixed(2))
                    setSendEstimateAmount(amount)
                    let checkStatus = filterReferral.slice(0, 1).map(async (item) => {
                      return await faucetContract.methods.isNetPositive(item.value.entered_address).call();
                    })
                    checkStatus = await Promise.allSettled(checkStatus)
                    setShowTeamStatus(checkStatus)
                    filterReferral.slice(0, 1).forEach((item) => {
                      let deposit = window.web3.utils.fromWei(item.value.deposits);
                      deposit = parseFloat(deposit).toFixed(2)
                      sAdd.push(item.value.entered_address)
                      dataAdd.push({

                        address: item.value.entered_address,
                        directs: item.value.referrals,
                        deposits: deposit,
                        amount: amount
                      })
                    })
                    setNumberOfReciept(sAdd.length)
                    setSendAddress(sAdd)
                    setShowCompaign(dataAdd)
                  } else if (checkCompaign == 5) {
                    if (filterReferral.length < 5) {
                      toast.error("Your Referrals are less than the selected compaign")
                    } else {
                      let dataAdd = []
                      let sAdd = []
                      let amount = budgetRef.current.value / 5;
                      setEstimatePerPerson(parseFloat(amount).toFixed(2))
                      setSendEstimateAmount(amount)
                      let checkStatus = filterReferral.slice(0, 5).map(async (item) => {
                        return await faucetContract.methods.isNetPositive(item.value.entered_address).call();
                      })
                      checkStatus = await Promise.allSettled(checkStatus)
                      setShowTeamStatus(checkStatus)

                      filterReferral.slice(0, 5).forEach((item) => {
                        let deposit = window.web3.utils.fromWei(item.value.deposits);
                        deposit = parseFloat(deposit).toFixed(2)
                        sAdd.push(item.value.entered_address)
                        dataAdd.push({

                          address: item.value.entered_address,
                          directs: item.value.referrals,
                          deposits: deposit,
                          amount: amount
                        })
                      })
                      setNumberOfReciept(sAdd.length)
                      setSendAddress(sAdd)
                      setShowCompaign(dataAdd)
                    }
                  } else if (checkCompaign == 20) {
                    if (filterReferral.length < 20) {
                      toast.error("Your Referrals are less than the selected compaign")
                    } else {
                      let dataAdd = []
                      let sAdd = []
                      let amount = budgetRef.current.value / 20;
                      setEstimatePerPerson(parseFloat(amount).toFixed(2))
                      setSendEstimateAmount(amount)
                      let checkStatus = filterReferral.slice(0, 20).map(async (item) => {
                        return await faucetContract.methods.isNetPositive(item.value.entered_address).call();
                      })
                      checkStatus = await Promise.allSettled(checkStatus)
                      setShowTeamStatus(checkStatus)

                      filterReferral.slice(0, 20).forEach((item) => {
                        let deposit = window.web3.utils.fromWei(item.value.deposits);
                        deposit = parseFloat(deposit).toFixed(2)
                        sAdd.push(item.value.entered_address)
                        dataAdd.push({

                          address: item.value.entered_address,
                          directs: item.value.referrals,
                          deposits: deposit,
                          amount: amount
                        })
                      })
                      setNumberOfReciept(sAdd.length)
                      setSendAddress(sAdd)
                      setShowCompaign(dataAdd)
                    }
                  } else if (checkCompaign == 50) {
                    if (filterReferral.length < 50) {
                      toast.error("Your Referrals are less than the selected compaign")
                    } else {
                      let dataAdd = []
                      let sAdd = []
                      let amount = budgetRef.current.value / 50;
                      setEstimatePerPerson(parseFloat(amount).toFixed(2))
                      setSendEstimateAmount(amount)
                      let checkStatus = filterReferral.slice(0, 50).map(async (item) => {
                        return await faucetContract.methods.isNetPositive(item.value.entered_address).call();
                      })
                      checkStatus = await Promise.allSettled(checkStatus)
                      setShowTeamStatus(checkStatus)

                      filterReferral.slice(0, 50).forEach((item) => {
                        let deposit = window.web3.utils.fromWei(item.value.deposits);
                        deposit = parseFloat(deposit).toFixed(2)
                        sAdd.push(item.value.entered_address)
                        dataAdd.push({

                          address: item.value.entered_address,
                          directs: item.value.referrals,
                          deposits: deposit,
                          amount: amount
                        })
                      })
                      setNumberOfReciept(sAdd.length)
                      setSendAddress(sAdd)
                      setShowCompaign(dataAdd)
                    }
                  } else {
                    if (filterReferral.length < 100) {
                      toast.error("Your Referrals are less than the selected compaign")
                    } else {
                      let dataAdd = []
                      let sAdd = []
                      let amount = budgetRef.current.value / 100;
                      setEstimatePerPerson(parseFloat(amount).toFixed(2))
                      setSendEstimateAmount(amount)
                      let checkStatus = filterReferral.slice(0, 100).map(async (item) => {
                        return await faucetContract.methods.isNetPositive(item.value.entered_address).call();
                      })
                      checkStatus = await Promise.allSettled(checkStatus)
                      setShowTeamStatus(checkStatus)
                      filterReferral.slice(0, 100).forEach((item) => {
                        let deposit = window.web3.utils.fromWei(item.value.deposits);
                        deposit = parseFloat(deposit).toFixed(2)
                        sAdd.push(item.value.entered_address)
                        dataAdd.push({

                          address: item.value.entered_address,
                          directs: item.value.referrals,
                          deposits: deposit,
                          amount: amount
                        })
                      })
                      setNumberOfReciept(sAdd.length)
                      setSendAddress(sAdd)
                      setShowCompaign(dataAdd)
                    }

                  }
                } else {
                  setNumberOfReciept(0)
                  setEstimatePerPerson(0)
                  setSendEstimateAmount(0)
                  setSendAddress([])
                  setShowCompaign([])
                  setShowTeamStatus([])
                  toast.error("No users found")
                }

              } else {
                toast.error("You have not got any referral")
              }


            } else {
              toast.error("Oops insufficient SOLS balance")
            }
          } else {
            toast.error("Looks like you forgot to enter Budget amount")
          }

        } else {
          toast.error("Please enter address or click use my address")
        }
      }
    } catch (e) {
      console.log("error while run team drop", e);
    }
  }
  // console.log("item", showTeamStatus[0].value);
  const aproveafterRunAmount = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        if (budgetRef.current.value > 0) {
          if (parseFloat(userDripBalance) >= parseFloat(budgetRef.current.value)) {


            if (sendAddress.length) {
              const web3 = window.web3;
              let splashContract = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
              let value = web3.utils.toWei(budgetRef.current.value)
              await splashContract.methods.approve(faucetContractAddress, value).send({ from: acc })
              toast.success("Transaction confirmed")
            } else {
              toast.error("No recipient found")
            }
          } else {
            toast.error("Entered amount is greater than your balance")
          }
        } else {
          toast.error("Looks like you forgot to enter amount")
        }

      }
    } catch (e) {
      toast.error("Transaction failed")
      console.log("error while aprove amount to addresses");
    }
  }
  const changeResAmount = async() => {
    try{
      let bug = budgetRef.current.value;
      let val = dividBudgetRef.current.value
      if(val > 0){
          bug = bug /  val
          bug = parseFloat(bug).toFixed(3)
          setEstimatePerPerson(bug);
          setNumberOfReciept(val)

      }else{
        setEstimatePerPerson(0);
        setNumberOfReciept(0)
      }
    }catch(e){
      console.error("Error while change res amount", e)
    }
  }
  const sendAmount = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected")
      } else {
        if (parseFloat(budgetRef.current.value) > 0) {
          if (sendAddress.length) {
              const web3 = window.web3
            let splashContract = new web3.eth.Contract(faucetTokenAbi, faucetTokenAddress);
            let allowance = await splashContract.methods.allowance(acc, faucetContractAddress).call();

            let all = web3.utils.fromWei(allowance);
            let amount = parseFloat(budgetRef.current.value)
            if (amount <= parseFloat(all)) {
            let budgetVal = dividBudgetRef.current.value
            if( budgetVal > 0){
              if(budgetVal <= sendAddress.length){
                setNumberOfReciept(budgetVal)
              let oldArr =[]
               oldArr = [...sendAddress];
              let newArr = [];
              for(let i = 0; i < budgetVal; i++){
                let arr = oldArr[Math.floor(Math.random() * oldArr.length)];
                let arrIndex = oldArr.indexOf(arr)
               oldArr.splice(arrIndex,1)
                newArr=[...newArr, arr];
              }
              let sAmount =amount/ newArr.length;
              let facutContract = new web3.eth.Contract(faucetContractAbi, faucetContractAddress);
              let tosendEstimateAmount = sAmount.toString()

              tosendEstimateAmount = web3.utils.toWei(amount.toString())
              await facutContract.methods.MultiSendairdrop(newArr, tosendEstimateAmount).send({ from: acc })
              toast.success("Transaction confirmed")
        }else{
          toast.error("Enterd value is larger than compagin viewer")
        }
        }else{
              toast.error("Oops you forgot to enter recipient numbers")
            }
            } else {
              toast.error("The entered amount is greater than your approval amount")
            }
          } else {
            toast.error("No recipient found")
          }
        } else {
          toast.error("Looks like you forgot to enter the fields")
        }
      }
    } catch (e) {
      toast.error("Transaction failed")
      console.log("error while send amount to addresses", e);
    }
  }
  const getUserAddress = async () => {
    try {
      let acc = await loadWeb3();
      if (acc == "No Wallet") {
        toast.error("No Wallet Connected");
      } else {
        buddySearch.current.value = acc;
      }
    } catch (e) {
      console.log("error while get user address", e);
    }
  }

  const getRefrals = async () => {
    try {
      setStoreRefral([])
      if (buddySearch.current.value <= 0) {
        toast.error("Enter Referral Address")
        setStoreRefral([])
      } else {
        let data = {
          referee: buddySearch.current.value
        }
        let res = await axios.post("https://solisium-ser-main-mlinrmya4hqm.herokuapp.com/api/users/getTreeRef", data);
        if (res.data.length) {
          setStoreRefral(res.data);
        } else {
          setStoreRefral([])
          toast.error("No Referral Found")
        }
      }
    } catch (e) {
      console.log("error while get refrals", e);
    }
  }

  const changeViewer = () => {
    setIschange("Viewer");
  };
  const changeAirdrop = () => {
    setIschange("Airdrop");
  };
  const changeDirect = () => {
    setIschange("Direct");
  };
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
                    <div className="swaptitle1">SOLPOUNDING 8% DAILY</div>
                    <div><p className='pmainpage'>SOLPounding is the new Solisium staking contract that will run besides our traditional staking contract. Being a high risk, high return contract, we have implemented some simple steps that anyone needs to take to participate. Staking is done with the same SOLS token that most of you are familiar with.<br/><br/>Rules are simple, calculated and tested out with success:<br/>1. Any staked amounts need to be compounded every day for 9 days straight.<br/>2. Once you compounded the 9 days specified you can claim in the 10th day so once every 10 days you can claim your rewards if you desire to do so.<br/> 3. If you don't claim in the 10th day you will have to wait for another 9 days of compounding to be able to claim again.<br/> 4. If you do not compound in one day, timer will restart and you will have to compound for the next 9 days so you can claim in the 10th.<br/> 5. If you claim before the 9 days of compound, your transaction will go through but your wallet will be blacklisted and all staked funds and ongoing rewards will be lost and re-entered in the staking pool as additional liquidity without the possibility to retrieve your funds back.<br/><br/>These rules are in place to maintain an order in this high yield contract and so everyone has a chance to profit without the liquidity being drained.</p></div>
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
  <p style={{fontWeight: "normal", fontSize: "12px", padding: "20px"}}>The staking contract was designed to offer a 3% daily return (540% maximum payout over 180 days) passively through a well developed contract that is secured against drainage, with the possibility to mint new tokens that cover all user earnings. The tax pool is maintained by the 10% tax on all transactions. Users can participate by purchasing SOLS from our swap page and depositing to the stake contract. <br/> Users can then claim the daily returns or recompound them. Recompounding is the preferred option for many users as it increases their daily returns and value of the SOLS token. <br/><br/>The Transfer section lets you transfer your SOLS deposit from your account to the recipient address of your choice.
There is no transaction fee for transfers. </p>
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
};

export default Steroids;
