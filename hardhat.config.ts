import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

const metaMaskPrivateKey =
  "d815657879410bbbc004d275343d9e1d12b0798682d1f2c7f0f5136f68092d01";
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/6648f6b6ccf04296b0496cac0d1b2a00",
      accounts: [metaMaskPrivateKey],
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [metaMaskPrivateKey],
      // accounts: {mnemonic},
    },
  },
  etherscan: {
    apiKey: "asdadasd",
  },
};

export default config;
