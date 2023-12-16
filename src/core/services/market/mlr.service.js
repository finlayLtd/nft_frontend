import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class MlrService {
  getNftMlrOwners(data) {
    return http.get(`mlr/nft-owners?${apiQueryBuilder(data)}`);
  }
}

export default new MlrService();
