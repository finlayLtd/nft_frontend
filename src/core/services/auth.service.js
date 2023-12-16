import http from "@/core/utils/http/http-common";

class AuthService {
  connectWallet(walletAddress) {
    return http
      .post("users/connect-wallet", { walletAddress })
      .then((res) => res.data);
  }

  saveProfile(id, data) {
    return http.patch(`users/${id}`, data);
  }

  findUser(addressOrUsername) {
    return http.get(`users/${addressOrUsername}`);
  }
}

export default new AuthService();
