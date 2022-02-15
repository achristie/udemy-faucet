import React, { useEffect, useState, useCallback } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "/utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    providers: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(balance);
    };

    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      if (provider) {
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error("Please install metamask");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const account = await web3Api.web3.eth.getAccounts();
      setAccount(account[0]);
    };

    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    console.log(account);
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const amount = web3.utils.toWei("0.2", "ether");
    await contract.withdraw(amount, {
      from: account,
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);
  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span className="mr-2">Account: </span>
            <h1>
              {account ? (
                account
              ) : (
                <button
                  className="button is-info is-small"
                  onClick={() =>
                    web3Api.provider.request({ method: "eth_requestAccounts" })
                  }
                >
                  Connect!
                </button>
              )}
            </h1>
          </div>

          <div className="balance-view is-size-2">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button
            className="button is-primary mr-2 is-small"
            onClick={addFunds}
          >
            Donate
          </button>
          <button className="button is-small" onClick={withdraw}>
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
