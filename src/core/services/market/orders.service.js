import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class OrdersService {
  getCoinPrice() {
    return http.get(`orders/get-coin-price`);
  }

  getNftOffers(data) {
    return http.get(`orders/nft-offers?${apiQueryBuilder(data)}`);
  }

  offerReceivedCount(data) {
    return http.get(`orders/offer-received-count?${apiQueryBuilder(data)}`);
  }

  getMyOffer(data) {
    return http.get(`orders/my-offer?${apiQueryBuilder(data)}`);
  }

  getLedgerOrders(data) {
    return http.get(`orders/ledger?${apiQueryBuilder(data)}`);
  }

  getSaleOrders(data) {
    return http.get(`orders/sales?${apiQueryBuilder(data)}`);
  }
}

export default new OrdersService();
