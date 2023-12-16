import Web3 from "web3/dist/web3.min.js";
import mlrABI from "@/core/config/abi/mlr";
import mlrOrderABI from "@/core/config/abi/mlr-order";
import mlrOfferABI from "@/core/config/abi/mlr-offer";
import store from "@/store";

export const mlrContract = (address) => {
  if (!Web3.givenProvider) throw "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(mlrABI, web3.utils.toChecksumAddress(address));
};

export const mlrOrderContract = (address) => {
  if (!Web3.givenProvider) throw "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    mlrOrderABI,
    web3.utils.toChecksumAddress(address)
  );
};

export const mlrOfferContract = (address) => {
  if (!Web3.givenProvider) throw "Unable to get provider";
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    mlrOfferABI,
    web3.utils.toChecksumAddress(address)
  );
};

export const createMlrOrder = async (mlrAddress, data) => {
  const contract = mlrOrderContract(mlrAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createOrder(data)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelMlrOrder = async (mlrAddress, orderIds) => {
  const contract = mlrOrderContract(mlrAddress);
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

export const updateRoyaltyInfo = async (contractAddress, royalty, buyout) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .updateRoyaltyInfo(royalty, buyout)
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

export const buyOut = async (contractAddress, owner, vaultAddress, buyout) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .buyOut(owner, vaultAddress)
      .send({ from: store.state.wallet.account, value: buyout })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const withdrawNFT = async (contractAddress) => {
  const contract = mlrContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .withdrawNFT()
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const buyFixedPayOrderInMLR = (
  contractAddress,
  orderId,
  vaultAddress,
  price
) => {
  const contract = mlrOrderContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .buyFixedPayOrder(orderId, vaultAddress)
      .send({ from: store.state.wallet.account, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createBidInMLR = (contractAddress, orderId, price) => {
  const contract = mlrOrderContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createBid(orderId)
      .send({ from: store.state.wallet.account, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createOfferInMLR = (
  contractAddress,
  price,
  rate,
  time,
  expiration
) => {
  const contract = mlrOfferContract(contractAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .createOffer(price, rate, time, expiration)
      .send({ from: store.state.wallet.account, value: price })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const updateBidInMlr = (contractAddress, orderId, dueDate) => {
  const contract = mlrOrderContract(contractAddress);
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
