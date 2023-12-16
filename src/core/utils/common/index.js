import { CHAIN_ROUTES } from "@/core/config/constant/chain";

export function keyCodeNumberRange(keyCode) {
  if (
    (keyCode > 95 && keyCode < 106) ||
    (keyCode > 47 && keyCode < 58) ||
    keyCode === 8 ||
    keyCode === 46 ||
    keyCode === 37 ||
    keyCode === 39 ||
    keyCode === 110 ||
    keyCode === 190 ||
    keyCode === 9 ||
    keyCode === 16
  ) {
    return true;
  } else {
    return false;
  }
}

export function roundTo(num, e = 3) {
  if (num < 0.0001) return 0;
  return +(Math.round(num + `e+${e}`) + `e-${e}`);
}

export function formatDate(date) {
  const d = new Date(date);
  const dFormat =
    [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
    ", " +
    formatAMPM(d);
  return dFormat;
}

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function formatOrderStatus(status) {
  let orderStatus;
  switch (status) {
    case "0":
      orderStatus = "Created";
      break;
    case "1":
      orderStatus = "Bidded";
      break;
    case "2":
      orderStatus = "Sold";
      break;
    case "3":
      orderStatus = "Completed";
      break;
    case "4":
      orderStatus = "Canceled";
      break;

    default:
      break;
  }
  return orderStatus;
}

export function emailValidate(email) {
  let regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regex.test(email);
}
export const apiQueryBuilder = (data) => {
  const queryPairs = [];
  for (const [key, value] of Object.entries(data)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      const pairs = [];
      for (let i = 0; i < value.length; i++) {
        pairs.push(`${key}=${value[i]}`);
      }
      queryPairs.push(pairs.join("&"));
    } else {
      queryPairs.push(`${key}=${value}`);
    }
  }
  return queryPairs.join("&");
};

export function findAndRemove(list, item, key) {
  if (Array.isArray(list) && !key) {
    const index = list.indexOf(item);
    if (index < 0) return list;
    list.splice(index, 1);
    return list;
  }
  return "list is not array";
}

export function prefixUrl(url) {
  if (!url) return "";
  if (url.indexOf("http") === 0) {
    return url;
  } else {
    return "https://" + url;
  }
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const getChainKey = (chain) => {
  return getKeyByValue(CHAIN_ROUTES, chain);
};

export const getChainById = (chainId) => {
  switch (chainId) {
    case 1:
      return CHAIN_ROUTES.ETHEREUM;
    case 97:
      return CHAIN_ROUTES.BSC_TESTNET;
    default:
      break;
  }
};

export const getDateAgo = (date) => {
  const localTimestamp = new Date(date).toLocaleString();
  const duration = new Date().getTime() - new Date(localTimestamp).getTime();
  const mins = Math.floor(duration / 60000);
  if (mins < 60) return (mins < 0 ? 0 : mins) + " mins ago";
  const hours = Math.floor(duration / 3600000);
  if (hours < 24) return (hours < 0 ? 0 : hours) + " hours ago";
  const days = Math.floor(hours / 24);
  return days + " days ago";
};

export const getDateLeft = (date) => {
  const duration = new Date(date).getTime() - new Date().getTime();
  const hours = Math.floor(duration / 3600000);
  if (hours < 24) return "in " + hours + " hours";
  const days = Math.floor(hours / 24);
  return "in " + days + " days";
};

export function shortenAddress(address) {
  if (address && address.length > 20) {
    return address.slice(0, 5) + "..." + address.slice(-4);
  } else {
    return "";
  }
}

export function shortenHash(hash) {
  if (hash && hash.length > 20) {
    return hash.slice(0, 6) + "..." + hash.slice(-4);
  } else {
    return "";
  }
}
