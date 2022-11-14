import React, { useEffect } from "react";
import Link from "next/link";
import { useAppState } from "../../provider/AppStateProvider";
import { getJSONMetadataBy } from "../../helper/file";
import Router from "next/router";
// import { BigNumber } from "ethers";

export default function MintedNFTs({ address }: { address?: string }) {
  const { getContracts, getProviderNSigner } = useAppState();
  const [nfts, setNfts] = React.useState<{ [key: string]: any }>([]);

  useEffect(() => {
    getMyNFTs();
  }, []);
 
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
      const [_, nftContract] = getContracts();
      console.log("📌 👉 👨‍💻 getMyNFTs 👨‍💻 nftContract", nftContract);
      const [, signer] = getProviderNSigner();
      if (nftContract && signer) {
        const mintedNftIDs = await nftContract
          .connect(signer)
          .getTokensCreatedByMe();
        const nfts = await Promise.all(
          mintedNftIDs.map(async (tokenId) => {
            let tokenUri = await nftContract.tokenURI(tokenId);
            let nftData = await getJSONMetadataBy(tokenUri);
            nftData.token = tokenId;
            return nftData;
          })
        );
        console.log(nfts);
        setNfts(nfts);
      } else {
        console.log("getMyNFTs", "nftContract && signer are required");
      }
    } catch (err: any) {
      console.log(err.message, err);
    }
  };

  return (
    <div className="p-20 bg-gray-100 min-h-screen">
      <div className="m-2 text-5xl text-center">My Minted NFTS</div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => Router.replace("/nft/mint")}
          className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
        >
          mint
        </button>
        {/* <button onClick={() => Router.replace("/nft/list")} className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white">list</button> */}
        <button
          onClick={getMyNFTs}
          className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
        >
          refresh
        </button>
      </div>
      <div className="grid grid-cols-5 gap-6 my-10">
        {nfts.map((item: any, index: number) => {
          return (
            <Link href={`/nft/${item.token}`} key={index}>
              <div
                className="shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl"
                key={index}
              >
                <div className="w-96 h-80 overflow-hidden">
                  <img
                    src={item.image}
                    alt="Picture of the author"
                    className="w-96 h-80 object-cover hover:scale-110 ease-in duration-300"
                  />
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <div className="font-semibold">{item.name}</div>
                  {/* <div className="flex gap-2">
                    <Image src={Hardhat} width={28} height={4} />
                    <div>{item.price}</div>
                  </div> */}
                </div>
                <div className="px-4 py-2 text-xs">
                  {item.description?.substring(0, 100) || "-"}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
