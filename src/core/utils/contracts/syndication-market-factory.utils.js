import Web3 from "web3/dist/web3.min.js";
import syndicationFactoryABI from "@/core/config/abi/syndication-market-factory";
import {
  BSC_TESTNET_SYNDICATION_MARKET_FACTORY_CONTRACT_ADDRESS,
  NULL_ADDRESS,
} from "@/core/config/constant";
import store from "@/store";

export const syndicationFactoryContract = () => {
  if (!Web3.givenProvider) return "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    syndicationFactoryABI,
    web3.utils.toChecksumAddress(
      BSC_TESTNET_SYNDICATION_MARKET_FACTORY_CONTRACT_ADDRESS
    )
  );
};

export const createSyndicationMarket = async (
  data,
  vaultAddress,
  initAmount
) => {
  const contract = syndicationFactoryContract();
  return new Promise((resolve, reject) => {
    contract.methods
      .createSyndication(data, vaultAddress, initAmount)
      .send({
        from: store.state.wallet.account,
        value: vaultAddress === NULL_ADDRESS ? initAmount : 0,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("err: ", err);
        reject(err);
      });
  });
};
