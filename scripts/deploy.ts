import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Marketplace, MNFT, MToken } from "../typechain-types";

export const fromWei = (num: BigNumber) => ethers.utils.formatEther(num);
export const toWei = (str: string) => ethers.utils.parseEther(str);

export async function getAccounts() {
  return await ethers.getSigners();
}

export async function deployNGetContract(contractName: string, ...args: any[]) {
  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy(...args);
  await contract.deployed();
  return contract;
}

export async function deployMToken() {
  return (await deployNGetContract("MToken")) as MToken;
}

export async function deployMNFT(marketplaceAddress: string) {
  return (await deployNGetContract("MNFT", marketplaceAddress)) as MNFT;
}

export async function deployMarketplace() {
  return (await deployNGetContract("Marketplace")) as Marketplace;
}

export async function deployContractsAndGetAccounts() {
  const [owner, acc1, acc2] = await getAccounts();

  const erc20Contract = await deployMToken();
  const marketplaceContract = await deployMarketplace();
  const nftContract = await deployMNFT(marketplaceContract.address);

  return { erc20Contract, nftContract, marketplaceContract, owner, acc1, acc2 };
}
