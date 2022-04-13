import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { PreSallAddress, PresallAbi } from '../utils/preSall';
import b1 from "../../images/b1.png"
import b2 from "../../images/b2.png"
import { faucetContractAddress, faucetContractAbi, faucetTokenAddress, faucetTokenAbi } from "../utils/Faucet";
import { loadWeb3 } from "../api";
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import bigInt from "big-integer";
import ReactDOM from 'react-dom';

const webSupply = new Web3("https://bsc-dataseed.binance.org/");

const Governance = () => {

    let [calsplash, setcalSplash] = useState(0)
    let [balanceOf, setbalanceOf] = useState(0)
    let [CheckWhiteList, setCheckWhiteList] = useState([])
    let [OnChangeValue, setOnChangeValue] = useState(0)
    let [hardcap, sethardcap] = useState('Checking...')
    let [softcap, setsoftcap] = useState('Checking...')






    let getdata = useRef()
    let withDrawValue = useRef()

    let AddAdress_Value = useRef()
    let RemoveAdress_Value = useRef()



    const Buy = async () => {
        try {
            const web3 = window.web3;

            let inputvalue = getdata.current.value;

if(inputvalue>0)
{



    console.log("input_value_here",typeof(inputvalue));
            let input_value_here =web3.utils.toWei(inputvalue)
                        let acc = await loadWeb3()
            let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);
            let return_Value = await preSall.methods.whitelist(acc).call();

            if (return_Value == true) {

                let limit_here = await preSall.methods.limit(acc).call();
                let limit_parWallet_here = await preSall.methods.limitperwallet().call();
                limit_here = parseFloat(web3.utils.fromWei(limit_here))
                limit_parWallet_here =parseFloat(web3.utils.fromWei(limit_parWallet_here) );
                let LimitPlusInput=(limit_here + +inputvalue);
                console.log("Chek_here",LimitPlusInput)
                if (LimitPlusInput <= limit_parWallet_here) {
                    // let b = bigInt(inputvalue)
                    let calSp = await preSall.methods.calculateSOLSforWT(input_value_here).call();
                    calSp= web3.utils.fromWei(calSp)
                    // calSp= web3.utils.fromWei(calSp)
                    console.log("caassadasd",calSp);
                    await preSall.methods.Buy(input_value_here).send({
                        from: acc,
                        value: calSp

                    })
                } else {
                    console.log("True_heeee", return_Value);
                    toast.error("MAX Limit Exceed")

                }

            }
            else {
                toast.error("You are not WhiteListed")

            }
}else{
    toast.error("Entered Value Must be greater than 0")
}
            

        }
        catch (e) {

            console.log("error while Buying", e);
            toast.error("Transaction Falied")        }

    }

    const Onchange_here = async () => {
        const web3 = window.web3;

        let inputvalue = getdata.current.value;
       
   
        let acc = await loadWeb3()

        let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);
        
        if(inputvalue>0){
            // let myVal=bigInt(parseFloat(inputvalue))
            // myVal= myVal.toString()
            inputvalue = web3.utils.toWei(inputvalue)
            inputvalue=parseFloat(inputvalue);
            let CalSp = await preSall.methods.calculateSOLSforWT(inputvalue.toString()).call();
            let calsplash_fromwei = web3.utils.fromWei(CalSp);
            calsplash_fromwei =web3.utils.fromWei(calsplash_fromwei)
            setOnChangeValue(calsplash_fromwei)
    
        }
        else{
            setOnChangeValue(0)

        }

      



    }


    let balace_here

    const contractBalance = async () => {

        console.log("Balace here");

        try {


            const web3 = window.web3;
            let preSall = new webSupply.eth.Contract(PresallAbi, PreSallAddress);
            balace_here = await preSall.methods.checkContractBalance().call();
            balace_here = webSupply.utils.fromWei(balace_here)
            setbalanceOf(balace_here)


            if (balace_here >= 490) {
                sethardcap('Reached')


            }
            else {
                sethardcap('Not Reached')

            }

            if (balace_here >= 250) {
                setsoftcap('Reached')


            }
            else {
                setsoftcap('Not Reached')

            }

        }
        catch (e) {

            console.log("Error While Fetching Balance", e);
        }




    }


    const WithdrawAVAX = async () => {
        const web3 = window.web3;

        let withDraw_valu_here = withDrawValue.current.value;
        console.log("Balanc here", balanceOf)
        console.log("Value here", withDraw_valu_here)



        try {
            if (withDraw_valu_here <= balanceOf && withDraw_valu_here > 0) {

                let acc = await loadWeb3()
                let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);

                await preSall.methods.WithdrawAVAX(web3.utils.toWei(withDraw_valu_here)).send({
                    from: acc

                })

            }
            else {
                toast.error("Insufficient Balance")

            }

        }
        catch (e) {

            console.log("error while claim", e);
        }

    }


    const addAdress_here = async () => {

        try {
            let acc = await loadWeb3()
            const web3 = window.web3;

            let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);

            let listingPrice = await preSall.methods.ListingPrice().call();
            console.log("error while claim", listingPrice);


            await preSall.methods.addaddressWhitelist().send({
                from: acc,
                value: listingPrice

            })

        }
        catch (e) {

            console.log("error while claim", e);
        }

    }

    const addAddressesToWhitelist = async () => {

        try {
            let acc = await loadWeb3()
            const web3 = window.web3;
            let AddAdressValu_add = AddAdress_Value.current.value;


            console.log("acc", acc)
            let preSall = new web3.eth.Contract(PresallAbi, PreSallAddress);

            await preSall.methods.addAddressToWhitelist(AddAdressValu_add).send({
                from: acc

            })

        }
        catch (e) {

            console.log("error while claim", e);
        }

    }



    useEffect(() => {

        setInterval(() => {
            // check_whiteList();
            contractBalance();



        }, 1000);
    }, []);



    const { t, i18n } = useTranslation();

  const particlesInit = (main) => {


    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  };

  const particlesLoaded = (container) => {

  };
    return (
         
        <div className="images">
            <div className="router-view">
                <div className="container landing-page">

                <div className="row mb-4 mt-2">
                    <div className="container col-12 col-xl-4 col-lg-4 col-md-4">
                        <div className='softhard'>SOFTCAP : {softcap} (250BNB)</div>
                    </div>
                    <div className="container col-12 col-xl-4 col-lg-4 col-md-4">
                        <div className='softhard'>HARDCAP: {hardcap} (500BNB)</div>
                    </div>
                </div>


                <div className="row mb-4 mt-2">
                    <div className="container col-12 col-xl-4 col-lg-4 col-md-4">
                    <img style={{width: "570px"}} src='https://raw.githubusercontent.com/solisiumnetwork/assets/main/giveaway.png'/>
                    </div>
                  <div className="container col-12 col-xl-4 col-lg-4 col-md-4">
                            <div className='row'>
                                <div className='col' >
                                    <div className="cardx  text-white"
                                        style={{ backgroundColor: "#4e2e4b" }}>
                                        <div className="card-body">
                                            <div className="landing-pagex">
                                                <div className="text-left">
                                                    <h3>
                                                        <p className="notrans.late fst-italic text-center" style={{ fontSize: "30px" }}>Solisium Token Presale</p>
                                                    </h3>
                                                </div>
                                                <form className="mt-5">
                                                    <div id="buddy-input">
                                                        <fieldset className="form-group" id="__BVID__216">
                                                            <h3>
                                                                <legend
                                                                    tabIndex={-1}
                                                                    className="bv-no-focus-ring col-form-label pt-1 fst-italic"
                                                                    id="__BVID__216__BV_label_"
                                                                >
                                                                    <p style={{ lineHeight: "40%" }}>
                                                                        SOLS (0.01 BNB) - MAX 5 BNB / WALLET

                                                                    </p>
                                                                </legend>
                                                            </h3>
                                                            <div>
                                                                <input
                                                                    maxLength="3"
                                                                    ref={getdata}


                                                                    type="Number"
                                                                    placeholder="0"
                                                                    className="form-controlx"
                                                                    id="__BVID__217"
                                                                    
                                                                    onChange={() => Onchange_here()}
                                                                />
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                </form>



                                                <form className="mt-5">
                                                    <div id="buddy-input">
                                                        <fieldset className="form-group" id="__BVID__216">
                                                            <h3>
                                                                <legend
                                                                    tabIndex={-1}
                                                                    className="bv-no-focus-ring col-form-label pt-1 fst-italic"
                                                                    id="__BVID__216__BV_label_"
                                                                >
                                                                    <p style={{ lineHeight: "40%" }}>
                                                                        BNB Paid
                                                                    </p>
                                                                </legend>
                                                            </h3>
                                                            <div>
                                                                <input

                                                                    type="Number"
                                                                    value={OnChangeValue}

                                                                    className="form-controlx"
                                                                    id="__BVID__217"
                                                                    
                                                                />
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                </form>
                                                <div className='row d-flex justify-content-center mt-5'>
                                                    <div className='col-md-12 col-11' >
                                                        <div className="d-grid gap-2">
                                                            <button className='btn btn-outline-lightx'  size="lg" onClick={() => Buy()} >
                                                                Buy Tokens
                                                            </button> 
                                                           
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
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
        
    )
}

export default Governance