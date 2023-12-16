import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class DvcsService {
  find() {
    return http.get(`dvcs`);
  }
}

export default new DvcsService();
