import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class HistoryService {
  getNftHistory(data) {
    return http.get(`history/nft?${apiQueryBuilder(data)}`);
  }

  getCollectionHistory(data) {
    return http.get(`history/collection?${apiQueryBuilder(data)}`);
  }

  getCollectionVolumeHistory(data) {
    return http.get(`history/volume/collection?${apiQueryBuilder(data)}`);
  }

  getUserHistory(data) {
    return http.get(`history/user?${apiQueryBuilder(data)}`);
  }
}

export default new HistoryService();
