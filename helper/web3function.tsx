import { ethers } from "ethers";
import axios from "axios";

// NFT CONTRACT
import NFTContract from "../artifacts/contracts/NFT.sol/NFT.json";
var nftAddress = process.env.NFT_CONTRACT_ADDRESS;

// Marketplace CONTRACT
import NFTMarketplaceContract from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
var mftMarketplaceAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;

// Token CONTRACT
import TokenContract from "../artifacts/contracts/MAC.sol/MAC.json";
var tokenContractAddress = process.env.TOKEN_ADDRESS;

declare let window: any;

export const Listing_fee = process.env.LISTING_FEE;

export const etherToWei = (n: any) => {
  const weiBigNumber = ethers.utils.parseEther(n.toString());
  const wei = weiBigNumber.toString();
  return wei;
};

export const weiToEther = (n: any) => {
  const ethBigNumber = ethers.utils.formatEther(n.toString());
  const eth = ethBigNumber.toString();
  return eth;
};

export const getTokenBalance = async (account: string) => {
  if (window.ethereum) {
    try {
      const tokenInst = await tokenInstance("");
      const tx = await tokenInst!.balanceOf(account);
      const balance = weiToEther(tx);
      return balance;
    } catch (e) {
      console.log(e);
    }
  }
};

export const marketplaceListingFee = async () => {
  try {
    const marketplace_instance = await nftMarketplaceInstance("");
    console.log("📌 👉 👨‍💻 marketplaceListingFee 👨‍💻 marketplace_instance", marketplace_instance);
    const marketPlaceListingFee = await marketplace_instance!.getListingFee();
    return weiToEther(parseInt(marketPlaceListingFee))
  } catch (e) {
    console.log(e);
  }
};

export const getFormatedMarketplaceNft = async (data: any, account: any) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(
      nftAddress!,
      NFTContract.abi,
      signer
    );
    try {
      let tx = await nftContract.tokenURI(parseInt(data.tokenId));
      let owner_of = await nftContract.ownerOf(parseInt(data.tokenId));
      const meta = await axios.get(tx);
      const formatedData = {
        name: meta.data.name,
        image: `https://coretek-nft.infura-ipfs.io/ipfs/${meta.data.image}`,
        desc: meta.data.description,
        price: data.price ? ethers.utils.formatEther(data.price) : 0,
        token: parseInt(data.tokenId),
        creator: account ? account : data.creator,
        attributes: meta.data.attributes,
        owner: owner_of,
        itemId: data.marketItemId ? parseInt(data.marketItemId) : 0,
      };
      return formatedData;
    } catch (err) {
      console.log(err);
    }
  }
};

export const getFormatedNft = async (data: any, account: any) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(
      nftAddress!,
      NFTContract.abi,
      signer
    );
    const nftMarketContract = new ethers.Contract(
      mftMarketplaceAddress!,
      NFTMarketplaceContract.abi,
      provider
    );
    try {
      let tx = await nftContract.tokenURI(parseInt(data));
      let owner_of = await nftContract.ownerOf(parseInt(data));

      let itemByTokenId = await nftMarketContract.getLatestMarketItemByTokenId(
        parseInt(data)
      );
      console.log({ data, itemByTokenId });
      console.log(itemByTokenId[0].marketItemId);
      const meta = await axios.get(tx);
      const formatedData = {
        name: meta.data.name,
        image: `https://coretek-nft.infura-ipfs.io/ipfs/${meta.data.image}`,
        desc: meta.data.description,
        price: data.price ? ethers.utils.formatEther(data.price) : 0,
        token: parseInt(data),
        creator: account,
        attributes: meta.data.attributes,
        owner: owner_of,
        itemId: parseInt(itemByTokenId[0].marketItemId),
      };
      return formatedData;
    } catch (err) {
      console.log(err);
    }
  }
};

export const increaseAllowance = async (
  account: string,
  spender: string,
  value: string
) => {
  try {
    const token_instance = await tokenInstance(account);
    const tx = await token_instance!.increaseAllowance(spender, value);
    return tx;
  } catch (e) {}
};

export const nftMarketplaceInstance = async (account: any) => {
  if (window.ethereum) {
    let signer;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (account) {
      signer = provider.getSigner();
    } else {
      signer = provider;
    }
    const contract = new ethers.Contract(
      mftMarketplaceAddress!,
      NFTMarketplaceContract.abi,
      signer
    );
    return contract;
  }
};

export const nftInstance = async (account: any) => {
  if (window.ethereum) {
    let signer;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (account) {
      signer = provider.getSigner();
    } else {
      signer = provider;
    }
    const contract = new ethers.Contract(nftAddress!, NFTContract.abi, signer);
    return contract;
  }
};

export const tokenInstance = async (account: any) => {
  if (window.ethereum) {
    let signer;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (account) {
      signer = provider.getSigner();
    } else {
      signer = provider;
    }
    const contract = new ethers.Contract(
      tokenContractAddress!,
      TokenContract.abi,
      signer
    );
    return contract;
  } else {
    return;
  }
};
