import Web3 from "web3/dist/web3.min.js";
import derivativeABI from "@/core/config/abi/derivative";
import store from "@/store";

export const derivativeContract = (contractAddress) => {
  if (!Web3.givenProvider) return false;
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    derivativeABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const mint = (contractAddress, addresses, uris) => {
  const contract = derivativeContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .mint(addresses, uris)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const withdraw = (contractAddress, lp) => {
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
