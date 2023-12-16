import { MARKET_CHAIN } from "@/core/config/constant";
import http from "@/core/utils/http/http-moralis";

class MoralisService {
  getMyNFTs(address, limit, offset) {
    return http.get(`${address}/nft?chain=${MARKET_CHAIN}&format=decimal`);
  }
  getNft(token_address, token_id, chain) {
    return http.get(
      `nft/${token_address}/${token_id}?chain=${
        chain || MARKET_CHAIN
      }&format=decimal`
    );
  }
  getBalance(address) {
    return http.get(`${address}/balance?chain=${MARKET_CHAIN}`);
  }
  nftTransfers(token_address, token_id, chain) {
    return http.get(
      `nft/${token_address}/${token_id}/transfers?chain=${
        chain || MARKET_CHAIN
      }&format=decimal`
    );
  }
}

export default new MoralisService();
