import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class SyndicationsService {
  getHistory(data) {
    return http.get(`syndications/history?${apiQueryBuilder(data)}`);
  }

  find() {
    return http.get(`syndications`);
  }
}

export default new SyndicationsService();
