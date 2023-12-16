import Web3 from "web3/dist/web3.min.js";
import mlrFactoryABI from "@/core/config/abi/mlr-factory";
import mlrManageABI from "@/core/config/abi/mlr-manage";
import {
  BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
  BSC_TESTNET_MLR_MANAGE_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import store from "@/store";

export const mlrFactoryContract = () => {
  if (!Web3.givenProvider) return "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    mlrFactoryABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS)
  );
};

export const mlrManageContract = () => {
  if (!Web3.givenProvider) return "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    mlrManageABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_MLR_MANAGE_CONTRACT_ADDRESS)
  );
};

export const createMLR = async (data) => {
  const web3 = new Web3(Web3.givenProvider);
  const gasPrice = await web3.eth.getGasPrice();
  const contract = mlrManageContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .createMultilevelOwnership(data)
      .send({ from: store.state.wallet.account, gasPrice })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
