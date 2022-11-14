import { ethers } from "ethers";
import fs from "fs";
import { fromWei, deployNGetContract, getAccounts } from "./deploy";
import { getHABIfromContract, getJABIfromContract } from "./abi";
import hardhatconfig from "../hardhat.config";

interface NetworkInfo {
  name?: string | undefined | null;
  chainId?: number | undefined;
  url?: string | null | undefined;
}

function formatContractInfo(
  name: string,
  address: string,
  habi: string | string[]
): string {
  return `
import { ContractInfo } from "./types";
import networkInfo from "./network";  

const contractInfo: ContractInfo = {
  name: "${name}",
  address: "${address}",
  habi: ${JSON.stringify(habi, null, 4)},
  network: networkInfo
}

export default contractInfo;
`;
}

function getDeployedNetworkInfo(): NetworkInfo {
  const networkInfo: NetworkInfo = {};
  const networkName = process.env.HH_NTWK;
  networkInfo.name = networkName;
  if (networkName && hardhatconfig && hardhatconfig.networks) {
    const info = hardhatconfig.networks[networkName];
    networkInfo.chainId = info?.chainId;
    networkInfo.url = (info as any)?.url;
  }
  return networkInfo;
}

function writeTypesinfo() {
  const fmtString = `
export interface NetworkInfo {
  name?: string | undefined | null,
  chainId?: number | undefined,
  url?: string | null | undefined
}

export interface ContractInfo {
    name: string,
    address: string,
    habi: string | string[],
    network: NetworkInfo
}
`;
  fs.writeFileSync(`contracts/types.ts`, fmtString);
}

function writeNetworkInfo(networkInfo: NetworkInfo) {
  const fmtString = `
import { NetworkInfo } from "./types";

const networkInfo: NetworkInfo = {
  name: ${networkInfo?.name ? `"${networkInfo?.name}"` : null},
  chainId: ${networkInfo?.chainId ? `"${networkInfo?.chainId}"` : undefined},
  url: ${networkInfo?.url ? `"${networkInfo?.url}"` : null}
};

export default networkInfo;`;

  fs.writeFileSync(`contracts/network.ts`, fmtString);
}

function writeAbis(contract: ethers.Contract, contractName: string) {
  const address = contract.address;
  const habi = getHABIfromContract(contract);
  fs.writeFileSync(
    `contracts/${contractName.toLowerCase()}.ts`,
    formatContractInfo(contractName, address, habi)
  );
  const jabi = getJABIfromContract(contract);
  fs.writeFileSync(`contracts/abis/${contractName}.json`, `${jabi}`);
}

async function main() {
  const [owner] = await getAccounts();

  const MTOKEN = "MToken";
  const MARKETPLACE = "Marketplace";
  const MNFT = "MNFT";

  const erc20Contract = await deployNGetContract(MTOKEN);
  const marketplaceContract = await deployNGetContract(MARKETPLACE);
  const nftContract = await deployNGetContract(
    MNFT,
    marketplaceContract.address
  );

  writeTypesinfo();

  const network = getDeployedNetworkInfo();
  writeNetworkInfo(network);

  writeAbis(erc20Contract, MTOKEN);
  writeAbis(marketplaceContract, MARKETPLACE);
  writeAbis(nftContract, MNFT);

  const mtk = fromWei(await erc20Contract.balanceOf(owner.address));
  const eth = fromWei(await owner.getBalance());

  const mtkOwner = await erc20Contract.owner();

  const dt = new Date();

  const deployInfo = {
    datetime: dt.toLocaleString(),
    network,
    erc20ContractAddr: erc20Contract.address,
    nftContractAddr: nftContract.address,
    marketplaceContractAddr: marketplaceContract.address,
    owner: {
      mtkOwner,
      address: owner.address,
      balance: {
        mtk,
        eth,
      },
    },
  };

  fs.writeFileSync(
    `contracts/deployment-info.txt`,
    "\n\n" + JSON.stringify(deployInfo, null, 2) + "\n\n"
  );
  fs.writeFileSync(
    `deployment-info.txt`,
    JSON.stringify(deployInfo, null, 2) +
      "\n\n======================================\n\n",
    { flag: "a" }
  );
  console.log(deployInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
