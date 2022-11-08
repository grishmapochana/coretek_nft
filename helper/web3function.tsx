import { ethers } from "ethers";
import axios from "axios";

import NFTContractAbi from "../artifacts/contracts/NFT.sol/NFT.json";
var nftAddress = process.env.NFT_CONTRACT_ADDRESS;

import NFTMarketplaceContractAbi from "../artifacts/contracts/Marketplace.sol/Marketplace.json";

var mftMarketplaceAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;

declare let window: any;

export const Listing_fee = process.env.LISTING_FEE;

export const etherToWei = (n:any) => {
  const weiBigNumber = ethers.utils.parseEther(n.toString());
  const wei = weiBigNumber.toString();
  return wei;
};

export const getFormatedNft = async (data: any, ) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(
        nftAddress!,
        NFTContractAbi.abi,
        signer
      );
      try {
        let tx = await nftContract.tokenURI(data.token.toNumber());
        if(!tx.match("https")){
          tx = `https://coretek-nft.infura-ipfs.io/ipfs/${tx}`;
        }
        const meta = await axios.get(tx);
        const formatedData = {
          name: meta.data.name,
          image: `https://coretek-nft.infura-ipfs.io/ipfs/${meta.data.image}`,
          desc: meta.data.description,
          price: ethers.utils.formatEther(data.price),
          token: data.token.toNumber(),
          creator: data.creator,
          attributes: meta.data.attributes,
          owner: data.owner
          
        };
        return formatedData;
      } catch (err) {
        console.log(err);
      }
    }
  };

  export const nftMarketplaceInstance = async (account:any) => {
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
        NFTMarketplaceContractAbi.abi,
        signer
      );
      return contract;
    }
  };

  export const nftInstance = async (account:any) => {
    if (window.ethereum) {
      let signer;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      if (account) {
        signer = provider.getSigner();
      } else {
        signer = provider;
      }
      const contract = new ethers.Contract(
        nftAddress!,
        NFTContractAbi.abi,
        signer
      );
      return contract;
    }
  };