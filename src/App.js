// Importing modules
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountsChanged);
      window.ethereum.on("chainChanged", chainChanged);
    }
  }, []);

  const connectHandler = async () => {
    if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await accountsChanged(res[0]);
        setWalletConnected(true);
      } catch (err) {
        console.error(err);
        setErrorMessage("There was a problem connecting to MetaMask");
      }
    } else {
      setErrorMessage("Install MetaMask");
    }
  };

  const accountsChanged = async (newAccount) => {
    setAccount(newAccount);
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [newAccount.toString(), "latest"],
      });
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error(err);
      setErrorMessage("There was a problem connecting to MetaMask");
    }
  };

  const chainChanged = () => {
    connectHandler();
  };

  return (
    <div className="App">
      <strong>Address: </strong>
      {account}
      <br />
      <strong>Balance: </strong>
      {balance} {balance ? "ETH" : null}
      {!walletConnected ? (
        <button onClick={connectHandler} variant="primary">
          Connect to wallet
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
