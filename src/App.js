
import './App.css';
import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from "./utils/load-contract";


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null);

  React.useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet", provider)
      debugger
      if(provider){
        // provider.request({method: "eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }else{
        console.error("Please install metamask.")
      }
 
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0])
      debugger
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  // console.log(web3Api.web3);
  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
        <span>
          <strong>Account : </strong>
        </span>
        <h1>{account ? <div>{account}</div> : <button className='button is-info'
        onClick={()=> web3Api.provider.request({method: "eth_requestAccounts"})}
        >Connect Account</button>}</h1>
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>10</strong> ETH
          </div>
          {/* <button className="btn mr-2" onClick={async () => {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
            console.log(accounts)
          }}>Enable Ethereum</button> */}
          <button className='button is-primary mr-2'>Donate</button>
          <button className='button is-link'>Withdrawl</button>
        </div>
      </div>
    </>
  );
}

export default App;
