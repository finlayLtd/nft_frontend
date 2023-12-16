import Web3 from "web3/dist/web3.min.js";
import derivativeFactoryABI from "@/core/config/abi/derivative-factory";
import { BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS } from "../../../core/config/constant";
import store from "@/store";

export const derivativeFactoryContract = () => {
  if (!Web3.givenProvider) return false;
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    derivativeFactoryABI,
    web3.utils.toChecksumAddress(
      BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS
    )
  );
};

export const createDerivative = (tokenAddress, tokenId, ownershipPrice) => {
  const contract = derivativeFactoryContract();
  if (!contract) throw "Unable to get provider";

  return new Promise((resolve, reject) => {
    contract.methods
      .createDerivative(tokenAddress, tokenId, ownershipPrice)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
