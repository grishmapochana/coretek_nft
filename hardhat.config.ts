import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { mnemonic } from "./secrets";

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      // chainId: 1337,
    },
    hardhat: {},
    bsc_testnet_s1_1: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
    bsc_testnet_s1_2: {
      url: "https://data-seed-prebsc-2-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
    bsc_testnet_s2_2: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic },
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      // accounts: {mnemonic: mnemonic}
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: "./sols",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  gasReporter: {
    enabled: true,
    // outputFile: 'gas-report.txt',
    // noColors: true
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;
