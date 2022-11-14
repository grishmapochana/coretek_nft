import React from "react";
import type { NextPage } from "next";
// import {
//   getFormatedMarketplaceNft,
//   nftMarketplaceInstance
// } from "../helper/web3function";
import NftCard from "../components/nftCard";
import { useAppState } from "../helper/AppStateProvider";

declare let window: any;

const Home: NextPage = () => {
  const { getAppState } = useAppState();

  const [nftData, setNftData] = React.useState<{ [key: string]: any }>([]);

  React.useEffect(() => {
    getMyNFTs();
  }, []);

  // const { getContracts, getProviderNSigner } = useAppState();
  // const [nfts, setNfts] = React.useState<{ [key: string]: any }>([]);

  // useEffect(() => {
  //   getMyNFTs();
  // }, []);

  // transferfrom
  // alltokens
  // alltokensBy(address)

  //   const getMintedNFTs = async (address?: string) => {
  //     try {
  //       const [_, nftContract] = getContracts();
  //       if(nftContract) {
  //         let mintedNftIDs: BigNumber[]
  //         if(!address) {
  //           mintedNftIDs = await nftContract.getTokensCreatedByMe();
  //         } else {
  //           mintedNftIDs = await nftContract.latest
  //         }

  //         if(mintedNftIDs && mintedNftIDs.length > 0) {
  //           const nfts = await Promise.all(
  //             mintedNftIDs.map(async (tokenId) => {
  //               let tokenUri = await nftContract.tokenURI(tokenId);
  //               let nftData = await getJSONMetadataBy(tokenUri);
  //               return nftData;
  //             })
  //           )
  //           setNfts(nfts);
  //         } else {
  //           console.log("no minted nfts found", {});
  //         }
  //       } else {
  //         console.log("getMintedNFTs", "nftContract is required")
  //       }
  //     } catch (err: any) {
  //       console.log(err.message, err);
  //     }
  // };

  const getMyNFTs = async () => {
    try {
      const {erc20Contract, nftContract, marketplaceContract, signer} = getAppState();
      console.log({ erc20Contract, nftContract, marketplaceContract, signer });
      
      // const [_, nftContract] = getContracts();
      // console.log("📌 👉 👨‍💻 getMyNFTs 👨‍💻 nftContract", nftContract);
      // const [, signer] = getProviderNSigner();
      // if (nftContract && signer) {
      //   const mintedNftIDs = await nftContract
      //     .connect(signer)
      //     .getTokensCreatedByMe();
      //   const nfts = await Promise.all(
      //     mintedNftIDs.map(async (tokenId) => {
      //       let tokenUri = await nftContract.tokenURI(tokenId);
      //       let nftData = await getJSONMetadataBy(tokenUri);
      //       nftData.token = tokenId;
      //       return nftData;
      //     })
      //   );
      //   console.log(nfts);
      //   setNfts(nfts);
      // } else {
      //   console.log("getMyNFTs", "nftContract && signer are required");
      // }
    } catch (err: any) {
      console.log(err.message, err);
    }
  };

  // const getNFT = async () => {
  //   try {
  //     const [_, nftContract] = getContracts();
  //     console.log({ nftContract });
  //   } catch (error) {
  //     console.log(error);
  //   }
    // if (window.ethereum) {
    //   try {
    //     const marketplaceInstance = await nftMarketplaceInstance(account);
    //     const unSoldNfts =
    //       await marketplaceInstance!.fetchAvailableMarketItems();
    //     const formattedNFTList = await Promise.all(
    //       unSoldNfts.map((nft: any) => {
    //         var res = getFormatedMarketplaceNft(nft, account);
    //         return res;
    //       })
    //     );
    //     setNftData(formattedNFTList);
    //     console.log("📌 👉 👨‍💻 getNFT 👨‍💻 formattedNFTList", formattedNFTList);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  // };

  return (
    <div className="p-20 bg-gray-100 min-h-screen">
      <div className="m-2 text-5xl text-center">Marketplace</div>
      <div className="grid grid-cols-5 gap-6 my-10">
        {nftData.map((item: any, index: number) => (
          <NftCard
            key={index}
            image={item.image}
            name={item.name}
            price={item.price}
            desc={item.desc}
            tokenId={item.token}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
