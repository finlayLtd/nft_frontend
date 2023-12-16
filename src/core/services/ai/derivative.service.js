import http from "@/core/utils/http/http-derivative";
import { apiQueryBuilder } from "@/core/utils/common";

class DerivativeService {
  create(url, samples) {
    return http.post(`create?url=${url}&samples=${samples}`);
  }
}

export default new DerivativeService();
