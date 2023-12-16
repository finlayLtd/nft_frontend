import Web3 from "web3/dist/web3.min.js";
import erc721ABI from "@/core/config/abi/erc721";
import store from "@/store";

export const erc721Contract = (address) => {
  if (!Web3.givenProvider) return "Unable to get provider";
  if (!address) throw new "Provide contract address"();
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(
    erc721ABI,
    web3.utils.toChecksumAddress(address)
  );
};

export const setApprovalForAll = (tokenAddress, operator, _approved) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise(async (resolve, reject) => {
    const extimatedGas = await contract.methods
      .setApprovalForAll(operator, _approved)
      .estimateGas({ from: store.state.wallet.account });
    console.log("estimateGas", extimatedGas);
    const web3 = new Web3(Web3.givenProvider);
    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice", gasPrice);
    contract.methods
      .setApprovalForAll(operator, _approved)
      .send({ from: store.state.wallet.account, gasPrice: gasPrice })
      .then((res) => {
        console.log("dddd", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("dddddddddddddddd", err);
        reject(err);
      });
  });
};

export const isApprovedForAll = (tokenAddress, owner, operator) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .isApprovedForAll(owner, operator)
      .call({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const safeTransferFrom = (tokenAddress, from, to, tokenId) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .safeTransferFrom(from, to, tokenId)
      .send({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const owner = (tokenAddress) => {
  const contract = erc721Contract(tokenAddress);
  return new Promise((resolve, reject) => {
    contract.methods
      .owner()
      .call({ from: store.state.wallet.account })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
