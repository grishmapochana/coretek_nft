
import { NetworkInfo } from "./types";

const networkInfo: NetworkInfo = {
  name: "bsc_testnet_s1_2",
  chainId: 97,
  url: "https://data-seed-prebsc-2-s1.binance.org:8545/"
};

export function getAddressUrl(address: string): string {
  let { name } = networkInfo;
  if (!name) return "#";
  if (name.includes("localhost")) {
    return "http://127.0.0.1:8545/address/" + address;
  }
  if (name.includes("bsc_testnet")) {
    return "https://testnet.bscscan.com/address/" + address;
  }
  if (name.includes("bsc_mainnet")) {
    return "https://bscscan.com/address/" + address;
  }
  return "#";
}

export function getTxUrl(txHash: string): string {
  let { name } = networkInfo;
  if (!name) return "#";
  if (name.includes("localhost")) {
    return "http://127.0.0.1:8545/address/" + txHash;
  }
  if (name.includes("bsc_testnet")) {
    return "https://testnet.bscscan.com/address/" + txHash;
  }
  if (name.includes("bsc_mainnet")) {
    return "https://bscscan.com/address/" + txHash;
  }
  return "#";
}

export default networkInfo;