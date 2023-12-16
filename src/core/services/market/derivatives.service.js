import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class DerivativesService {
  createImages(data) {
    return http.post(`derivatives/create-images`, data);
  }

  createTokenUris(data) {
    return http.post(`derivatives/create-uris`, data);
  }
}

export default new DerivativesService();
