const hre = require("hardhat");

async function main() {
  // We get the contract to deploy

  const MAC_TOKEN = await hre.ethers.getContractFactory("MAC");
  const MACTokenContract = await MAC_TOKEN.deploy();
  await MACTokenContract.deployed();

  const NFTMarket = await hre.ethers.getContractFactory("Marketplace");
  const NFTMarketContract = await NFTMarket.deploy();
  await NFTMarketContract.deployed();


  const NFT = await hre.ethers.getContractFactory("NFT");
  const NFTContract = await NFT.deploy(NFTMarketContract.address);
  await NFTContract.deployed();

  console.log("MACTokenContract deployed to:", MACTokenContract.address);
  console.log("NFTMarketContract deployed to:", NFTMarketContract.address);
  console.log("NFTContract deployed to:", NFTContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
