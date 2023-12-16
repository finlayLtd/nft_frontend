import Web3 from "web3/dist/web3.min.js";
import dvcABI from "@/core/config/abi/dvc";
import store from "@/store";

export const dvcContract = (contractAddress) => {
  if (!Web3.givenProvider) return "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    dvcABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const addLiquidity = (contractAddress, value) => {
  const contract = dvcContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .addLiquidity()
      .send({ from: store.state.wallet.account, value })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const withdraw = (contractAddress, lp) => {
  const contract = dvcContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .withdraw(lp)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
