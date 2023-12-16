import { apiQueryBuilder } from "@/core/utils/common";
import http from "@/core/utils/http/http-opensea";

class OpenseaService {
  retrieveAssets(data) {
    return http.get(`/assets?${apiQueryBuilder(data)}`);
  }
  retrieveCollections(data) {
    return http.get(`/collections?${apiQueryBuilder(data)}`);
  }
  retrieveContract(address) {
    return http.get(`/asset_contract/${address}`);
  }
  retrieveCollectionStats(slug) {
    return http.get(`/collection/${slug}/stats`);
  }
}

export default new OpenseaService();
