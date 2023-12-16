import { INFURA_ID } from "./env";
import {
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
} from "vue-dapp";

export const connectors = [
  new MetaMaskConnector({
    appUrl: window.location.origin,
  }),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      4: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: "Vue Dapp",
    jsonRpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  }),
];
