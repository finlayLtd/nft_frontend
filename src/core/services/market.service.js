import http from "@/core/utils/http/http-common";
import {
  CRYPTOCOMPARE_API_KEY,
  defaultPagination,
  MainToken,
} from "@/core/config/constant";
import axios from "axios";
import { apiQueryBuilder } from "@/core/utils/common";

class MatketService {
  getOrder(id) {
    return http.get(`orders?id=${id}`);
  }
  getOnSaleOrders(chain, address) {
    return http.get(`orders/sale?chain=${chain}&address=${address}`);
  }

  // ledger
  soldItems(chain, offset, limit) {
    return http.get(
      `orders/sold?chain=${chain}&offset=${offset}&limit=${limit}`
    );
  }

  canceledItems(chain, offset, limit) {
    return http.get(
      `orders/canceled?chain=${chain}&offset=${offset}&limit=${limit}`
    );
  }

  listedItems(chain, offset, limit) {
    return http.get(
      `orders/active?chain=${chain}&offset=${offset}&limit=${limit}`
    );
  }

  // recent order logs
  getOrderLogs() {
    return http.get(`orders/log`);
  }

  getUSDFromToken(token) {
    if (token === MainToken.BSC_TESTNET) {
      return axios
        .get(
          `https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD&api_key=${CRYPTOCOMPARE_API_KEY}`
        )
        .then((res) => res.data.USD)
        .catch((err) => 0);
    } else if (token === MainToken.ETHEREUM) {
      return axios
        .get(
          `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${CRYPTOCOMPARE_API_KEY}`
        )
        .then((res) => res.data.USD)
        .catch((err) => 0);
    } else {
      console.log("MarketService getUSDFromToken: Not implemented yet.");
      return amount;
    }
  }

  createHashTags(chain, hashtagNames, tokenAddress, tokenId) {
    return http.post("hashtags", {
      chain,
      hashtagNames,
      tokenAddress,
      tokenId,
    });
  }

  getHashtagNames(name, limit, tokenAddress, tokenId) {
    return http.get(
      `hashtags/?${apiQueryBuilder({ tokenAddress, tokenId, name, limit })}`
    );
  }

  // fetch orders related to the connected user.
  getMyOrders(userId) {
    return http.get(`orders/mine?userId=${userId}`);
  }

  vote(userId, chain, tokenAddress, tokenId) {
    return http.patch(
      `users/${userId}/token/vote?chain=${chain}&tokenAddress=${tokenAddress}&tokenId=${tokenId}`
    );
  }

  hideToken(userId, chain, tokenAddress, tokenId) {
    return http.patch(
      `users/${userId}/token/hide?chain=${chain}&tokenAddress=${tokenAddress}&tokenId=${tokenId}`
    );
  }

  unHideToken(userId, tokenAddresses, tokenIds) {
    return http.patch(`users/${userId}/token/unhide`, {
      tokenAddresses,
      tokenIds,
    });
  }

  collectedTokens(chain, address) {
    return http.get(`users/tokens/collected?chain=${chain}&address=${address}`);
  }

  onSaleTokens(chain, address) {
    return http.get(`users/tokens/on-sale?chain=${chain}&address=${address}`);
  }

  downsideTokens(chain, address) {
    return http.get(`users/tokens/downside?chain=${chain}&address=${address}`);
  }

  mlrTokens(chain, userId) {
    return http.get(`users/tokens/multilevel?chain=${chain}&userId=${userId}`);
  }

  favoriteTokens(chain, id) {
    return http.get(`users/tokens/favorite?chain=${chain}&id=${id}`);
  }

  hiddenTokens(chain, id) {
    return http.get(`users/tokens/hidden?chain=${chain}&id=${id}`);
  }

  getAsset(chain, tokenAddress, tokenId, userId) {
    return http.get(
      `nfts/${tokenAddress}/${tokenId}?chain=${chain}&userId=${userId}`
    );
  }

  getBundle(chain, packId) {
    return http.get(`packs/${packId}?chain=${chain}`);
  }

  countNfts() {
    return http.get(`nfts/count-all`);
  }

  getContracts(data) {
    return http.post(`contracts/search`, data);
  }

  countContracts() {
    return http.get(`contracts/count`);
  }

  getContract(chain, address, stats) {
    return http.get(`contracts/${chain}/${address}?stats=${stats}`);
  }

  getDownsideProtectionFunds() {
    return http.get(`orders/funds/pending`);
  }

  getTotalSalesFunds() {
    return http.get(`orders/funds/sales`);
  }

  getFavoriteUsers(tokenAddress, tokenId) {
    return http.get(
      `tokens/favorite/users?tokenAddress=${tokenAddress}&tokenId=${tokenId}`
    );
  }
  getTokenHistory(address, id) {
    return http.get(`orders/log/token?address=${address}&id=${id}`);
  }
  tradingHistoryByUser(chain, walletAddress) {
    return http.get(`orders/log/user?chain=${chain}&address=${walletAddress}`);
  }
  getOffers(chain, nftId) {
    return http.get(`orders/offers?chain=${chain}&nftId=${nftId}`);
  }
  getMyOffers(chain, userId) {
    return http.get(`orders/my-offers?chain=${chain}&userId=${userId}`);
  }
  getOffersReceived(chain, userId) {
    return http.get(`orders/offer-received?chain=${chain}&userId=${userId}`);
  }

  saveCollection(chain, id, data) {
    return http.patch(`contracts/${chain}/${id}`, data);
  }

  updateProfilePicture(id, profileImg) {
    return http.patch(`users/${id}/profile-picture`, {
      profile_img: profileImg,
    });
  }

  searchNfts(data) {
    return http.post(`nfts/search`, data);
  }

  getMultilevelNfts(chain, offset, limit) {
    return http.get(
      `nfts/multilevel?chain=${chain}&offset=${offset}&limit=${limit}`
    );
  }

  getMatchGameNfts() {
    return http.get(`nfts/match-game`);
  }

  createDvc(chain, dvc) {
    return http.post(`dvcs/${chain}`, dvc);
  }

  getDvcs(uuid) {
    return http.get(`dvcs?uuid=${uuid}`);
  }

  searchDvcs(option) {
    return http.patch(`dvcs/search`, option);
  }
}

export default new MatketService();
