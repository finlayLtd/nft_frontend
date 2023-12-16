import http from "@/core/utils/http/http-common";
import { apiQueryBuilder } from "@/core/utils/common";

class CollectionsService {
  checkAuthentic(data) {
    return http.get(`contracts/check-authentic?${apiQueryBuilder(data)}`);
  }

  /**
   * Determines whether the contract has been starred.
   * @param {object} data
   * @param {string} data.contractId ID of the contract that the user wishes to star/unstar
   * @param {string} data.userId ID of the User who wants to star/unstar the contract.
   * @returns {boolean} True if starred, False if not starred
   */
  starContract(data) {
    return http.patch(`contracts/star?${apiQueryBuilder(data)}`);
  }

  /**
   * Returns the number of NFTs listed in a collection
   * @param {string} address The address of the contract you want to get the number of listed NFTs from.
   * @returns {number}
   */
  listingStats(address) {
    return http.get(`contracts/listing-stats?address=${address}`);
  }
}

export default new CollectionsService();
