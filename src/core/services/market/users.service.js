import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class UsersService {
  collectedNfts(data) {
    return http.get(`users/tokens/collected?${apiQueryBuilder(data)}`);
  }

  stats(data) {
    return http.get(`users/tokens/stats?${apiQueryBuilder(data)}`);
  }

  hiddenNfts(data) {
    return http.get(`users/tokens/hidden?${apiQueryBuilder(data)}`);
  }

  favoriteTokens(data) {
    return http.get(`users/tokens/favorite?${apiQueryBuilder(data)}`);
  }

  listingOrders(data) {
    return http.get(`users/tokens/on-sale?${apiQueryBuilder(data)}`);
  }

  sellingOrders(data) {
    return http.get(`users/tokens/selling?${apiQueryBuilder(data)}`);
  }

  buyingOrders(data) {
    return http.get(`users/tokens/buying?${apiQueryBuilder(data)}`);
  }

  mlrTokens(data) {
    return http.get(`users/tokens/multilevel?${apiQueryBuilder(data)}`);
  }

  myOffers(data) {
    return http.get(`users/tokens/my-offers?${apiQueryBuilder(data)}`);
  }

  offersReceived(data) {
    return http.get(`users/tokens/offers-received?${apiQueryBuilder(data)}`);
  }

  cancelOffersReceived(data) {
    return http.delete(`users/tokens/offers-received?${apiQueryBuilder(data)}`);
  }

  follow(address, followingAddress) {
    return http.post(
      `users/follow?address=${address}&followingAddress=${followingAddress}`
    );
  }

  unfollow(address, followingAddress) {
    return http.post(
      `users/unfollow?address=${address}&followingAddress=${followingAddress}`
    );
  }

  followers(address, data) {
    return http.get(`users/${address}/followers?${apiQueryBuilder(data)}`);
  }

  following(address, data) {
    return http.get(`users/${address}/following?${apiQueryBuilder(data)}`);
  }

  checkFollowing(address, followingAddress) {
    return http.get(
      `users/${address}/check-following?followingAddress=${followingAddress}`
    );
  }

  unfavoriteTokens(walletAddress, tokenIds) {
    return http.patch(`users/${walletAddress}/unfavorite-tokens`, { tokenIds });
  }
}

export default new UsersService();
