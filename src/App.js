
import './App.css';
import React, {useState, useEffect, useCallback} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from "./utils/load-contract";


function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,
  })

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false)

  const reloadEffect = useCallback(() => reload(!shouldReload),[shouldReload])

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => window.location.reload())
  }

  React.useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      debugger
      if(provider){
        const contract = await loadContract("Faucet", provider)
        // provider.request({method: "eth_requestAccounts"})
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      }else{
        console.error("Please install metamask.")
        setWeb3Api({
        ...web3Api, isProviderLoaded:true})
      }
 
    }
    loadProvider()
  }, [])

  useEffect(()=> {
    const loadBalance = async () => {
      const {contract, web3} = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.contract && loadBalance()
  },[web3Api, shouldReload])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0])
      debugger
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  const addFunds = useCallback( async () => {
    const {contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })
    reloadEffect()

  }, [web3Api, account, reloadEffect])


  const withdrawl = async () => {
    const {contract, web3} = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdrawl(withdrawAmount,{
      from: account,
    })
    reloadEffect()
  }
  // console.log(web3Api.web3);
  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
        { web3Api.isProviderLoaded ? 
        <div>
        <span>
          <strong>Account : </strong>
        </span>
        <h1>{account ? <div>{account}</div> :
        !web3Api.provider ?
        <>
          <div className="notification is-warning is-size-5 is-rounded">
            Wallet not detected!
            <a target="_blank" href='https://docs.metamask.io'>Install Metamask</a>
          </div>
        </> :
         <button className='button is-info'
        onClick={()=> web3Api.provider.request({method: "eth_requestAccounts"})}
        >Connect Account</button>}</h1>
        </div> : <span>Looking for web3...</span>
        }
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {/* <button className="btn mr-2" onClick={async () => {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
            console.log(accounts)
          }}>Enable Ethereum</button> */}
          <button disabled={!account} className='button is-primary mr-2'onClick={addFunds}>Donate 1 Eth</button>
          <button disabled={!account} className='button is-link' onClick={withdrawl}>Withdrawl some ETH!</button>
        </div>
      </div>
    </>
  );
}

export default App;
