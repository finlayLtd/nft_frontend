import Web3 from "web3/dist/web3.min.js";
import vaultABI from "@/core/config/abi/vault";
import { BSC_TESTNET_VAULT_CONTRACT_ADDRESS } from "@/core/config/constant";
import store from "@/store";

export const vaultContract = () => {
  if (!Web3.givenProvider) return "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    vaultABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_VAULT_CONTRACT_ADDRESS)
  );
};

export const deposit = (value) => {
  console.log(store.state.wallet.account);
  const contract = vaultContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .deposit(store.state.wallet.account, value)
      .send({ from: store.state.wallet.account, value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const withdraw = (lp) => {
  const contract = vaultContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .withdraw(store.state.wallet.account, lp)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const increaseAllowance = (spender, addedValue) => {
  const contract = vaultContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .increaseAllowance(spender, addedValue)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
