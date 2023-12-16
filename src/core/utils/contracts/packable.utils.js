import Web3 from "web3/dist/web3.min.js";
import packableABI from "@/core/config/abi/packable";
import { BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS } from "@/core/config/constant";
import store from "@/store";

export const packableContract = () => {
  if (!Web3.givenProvider) return "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    packableABI,
    web3.utils.toChecksumAddress(BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS)
  );
};

export const pack = (
  name,
  description,
  tokenAddresses,
  tokenIds,
  coins,
  amounts
) => {
  const contract = packableContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .mintPack(name, description, tokenAddresses, tokenIds, coins, amounts)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addToPack = async (
  packId,
  tokenAddresses,
  tokenIds,
  coins,
  amounts
) => {
  const contract = packableContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .addToPack(packId, tokenAddresses, tokenIds, coins, amounts)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const unpack = async (packId) => {
  const contract = packableContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .unpack(packId)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
