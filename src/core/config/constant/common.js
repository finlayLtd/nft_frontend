export const themeConfig = {
  xl3: 1920,
  xl2: 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
};

export const walletList = [
  {
    id: "metamask",
    name: "MetaMask",
    imgUrl: "/images/wallet_logo/metamask.png",
    s_imgUrl: "/images/wallet_logo/small/metamask.png",
    connectorId: 0,
  },
  {
    id: "connect-wallet",
    name: "WalletConnect",
    imgUrl: "/images/wallet_logo/connect-wallet.png",
    s_imgUrl: "/images/wallet_logo/small/connect-wallet.png",
    connectorId: 1,
  },
  {
    id: "rainbow",
    name: "Rainbow",
    imgUrl: "/images/wallet_logo/rainbow.png",
    s_imgUrl: "/images/wallet_logo/small/rainbow.png",
  },
  {
    id: "trust",
    name: "Trust",
    imgUrl: "/images/wallet_logo/trust.png",
    s_imgUrl: "/images/wallet_logo/small/trust.png",
  },
  {
    id: "argent",
    name: "Argent",
    imgUrl: "/images/wallet_logo/argent.png",
    s_imgUrl: "/images/wallet_logo/small/argent.png",
  },
  {
    id: "gnosis",
    name: "Gnosis Safe Multisig",
    imgUrl: "/images/wallet_logo/gnosis.png",
    s_imgUrl: "/images/wallet_logo/small/gnosis.png",
  },
];

export const defaultUser = {
  bio: "",
  email: "",
  instagram: "",
  name: "Unnamed",
  profile_banner: "/images/creators/profile-banner-1920.png",
  profile_img: "/images/logo/logo.png",
  twitter: "",
  website: "",
};

export const saleType = {
  FIX_SALE: "FIX-SALE",
  AUCTION: "AUCTION",
};

export const networks = [
  {
    name: "Binance",
    icon: "/images/currencies/curr-3.png",
  },
];

export const currencies = [
  {
    name: "BNB",
    icon: "/images/currencies/curr-3.png",
  },
];

export const defaultPagination = {
  page: 1,
  limit: 20,
};

export const filterStatus = {
  BUY_NOW: "Buy Now",
  ON_AUCTION: "On Auction",
  HAS_OFFERS: "Has Offers",
  HAS_NO_OFFERS: "Has No Offers",
  RECENTLY_SOLD: "Recently Sold",
  RECENTLY_CANCELED: "Recently Canceled",
  ENDING_SOON: "Ending Soon",
};

export const categories = {
  TRENDING: "Trending",
  TOP: "Top",
  ART: "Art",
  COLLECTIBLES: "Collectibles",
  DOMAIN_NAMES: "Domain Names",
  MUSIC: "Music",
  PHOTOGRAPHY: "Photography",
  SPORTS: "Sports",
};

export const sortBy = {
  HIGH_TO_LOW: "Most value",
  NEW: "Most new",
  ACTIVITY: "Most activity",
  VIEW: "Most view",
  LIKED: "Most liked",
};

export const defaultImg = "/images/nfts/placeholder.webp";
