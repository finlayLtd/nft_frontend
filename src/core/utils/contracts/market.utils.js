import Web3 from "web3/dist/web3.min.js";
import marketOrderABI from "@/core/config/abi/market-order";
import marketOfferABI from "@/core/config/abi/market-offer";
import mlrOrderABI from "@/core/config/abi/mlr-order";
import mlrOfferABI from "@/core/config/abi/mlr-offer";
import store from "@/store";
import {
  NULL_ADDRESS,
  BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS,
  BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS,
} from "@/core/config/constant";

export const marketOrderContract = (contractAddress) => {
  if (!Web3.givenProvider) throw "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    contractAddress === BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
      ? marketOrderABI
      : mlrOrderABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const marketOfferContract = (contractAddress) => {
  if (!Web3.givenProvider) throw "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    contractAddress === BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS
      ? marketOfferABI
      : mlrOfferABI,
    web3.utils.toChecksumAddress(contractAddress)
  );
};

export const createOrder = async (data) => {
  const contract = marketOrderContract(
    BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
  );
  const web3 = new Web3(Web3.givenProvider);
  const gasPrice = await web3.eth.getGasPrice();
  return new Promise((resolve, reject) => {
    contract.methods
      .createOrder(data)
      .send({ from: store.state.wallet.account, gasPrice })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelOrderBySeller = (contractAddress, orderIds) => {
  const contract = marketOrderContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .cancelOrder(orderIds)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const buyFixedPayOrder = (
  contractAddress,
  orderIds,
  vaultAddress,
  price
) => {
  const contract = marketOrderContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .buyFixedPayOrder(orderIds, vaultAddress)
      .send({
        from: store.state.wallet.account,
        value: vaultAddress === NULL_ADDRESS ? price : 0,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log("err:=====", err);
        reject(err);
      });
  });
};

export const createBid = (contractAddress, orderId, vaultAddress, price) => {
  const contract = marketOrderContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createBid(orderId, vaultAddress, price)
      .send({
        from: store.state.wallet.account,
        value: vaultAddress === NULL_ADDRESS ? price : 0,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const claimDownsideProtectionAmount = (contractAddress, orderIds) => {
  const contract = marketOrderContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .claimDownsideProtectionAmount(orderIds)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const claimDownsideProtectionAmountInOffer = (
  contractAddress,
  offerId
) => {
  const contract = marketOfferContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .claimDownsideProtectionAmountInOffer(offerId)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createOffer = (data) => {
  const contract = marketOfferContract(
    BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS
  );
  return new Promise((resolve, reject) => {
    contract.methods
      .createOffer(...data)
      .send({
        from: store.state.wallet.account,
        value: data[2] === NULL_ADDRESS ? data[3] : 0,
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

export const cancelOffer = (offerId) => {
  const contract = marketOfferContract(
    BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS
  );
  return new Promise((resolve, reject) => {
    contract.methods
      .cancelOffer(offerId)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const acceptOffer = (offerId) => {
  const contract = marketOfferContract(
    BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS
  );
  return new Promise((resolve, reject) => {
    contract.methods
      .acceptOffer(offerId)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateBid = (orderId, dueDate) => {
  const contract = marketOrderContract(
    BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
  );
  return new Promise((resolve, reject) => {
    contract.methods
      .updateBid(orderId, dueDate)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
