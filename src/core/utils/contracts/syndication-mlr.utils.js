import Web3 from "web3/dist/web3.min.js";
import syndicationABI from "@/core/config/abi/syndication-mlr";
import store from "@/store";
import { NULL_ADDRESS } from "@/core/config/constant";

export const syndicationContract = (contractAddress) => {
  if (!Web3.givenProvider) return false;
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    syndicationABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const addLiquidityMlr = (contractAddress, vaultAddress, value) => {
  const contract = syndicationContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .addLiquidity(store.state.wallet.account, vaultAddress, value)
      .send({
        from: store.state.wallet.account,
        value: vaultAddress === NULL_ADDRESS ? value : 0,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const withdrawMlr = (contractAddress, lp) => {
  const contract = syndicationContract(contractAddress);
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
