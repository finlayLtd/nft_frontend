import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class NftsService {
  stats() {
    return http.get(`nfts/stats`);
  }

  vote(data) {
    return http.patch(`nfts/vote?${apiQueryBuilder(data)}`);
  }

  checkLiquidity(chain, tokenAddress, tokenId) {
    return http.get(
      `nfts/check-liquidity?chain=${chain}&tokenAddress=${tokenAddress}&tokenId=${tokenId}`
    );
  }

  /**
   * Determines whether the NFT has been starred.
   * @param {nftId: string, userId: string} data
   * @returns {boolean} True if starred, False if not starred
   */
  starNft(data) {
    return http.patch(`nfts/star?${apiQueryBuilder(data)}`);
  }

  searchOfferings(data) {
    return http.post(`nfts/search-offerings`, data);
  }
}

export default new NftsService();
