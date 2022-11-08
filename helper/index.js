import { getAddress } from "@ethersproject/address";
import { ethers } from "ethers";

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const getETHBalance = async (library, setBalance, account) => {
  try {
    const balance = await library.eth.getBalance(account);
    setBalance(balance / 1e18);
  } catch (err) {}
};

export const switchPolygonNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.utils.hexlify(97) }],
    });
  } catch (e) {
    addPolygonNetwork();
  }
};

export const switchBSCTestNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.utils.hexlify(97) }],
    });
  } catch (e) {
    addBSCTestNetwork();
  }
};

export const addBSCTestNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainName: "Binance Smart Chain Testnet",
          chainId: ethers.utils.hexlify(97),
          nativeCurrency: {
            name: "TBNB",
            decimals: 18,
            symbol: "TBNB",
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
        },
      ],
    });
  } catch (e) {
    return e;
  }
};

export const switchBSCNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  } catch (e) {
    return e;
  }
};

export const addPolygonNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainName: "Polygon Mainnet",
          chainId: ethers.utils.hexlify(137),
          nativeCurrency: {
            name: "MATIC",
            decimals: 18,
            symbol: "MATIC",
          },
          rpcUrls: ["https://polygon-rpc.com/"],
        },
      ],
    });
  } catch (e) {
    return e;
  }
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


