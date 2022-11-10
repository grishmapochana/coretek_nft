import React from "react";
import type { NextPage } from "next";
import Image from "next/image";

import Hardhat from "../assets/hardhat.png";
import {
  getFormatedMarketplaceNft,
  getFormatedNft,
  nftMarketplaceInstance,
  tokenInstance,
  weiToEther,
} from "../helper/web3function";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";

declare let window: any;

const Home: NextPage = () => {
  const { account } = useWeb3React();
  const [nftData, setNftData] = React.useState<{ [key: string]: any }>([]);

  React.useEffect(() => {
    getNFT();
  }, []);

  const getNFT = async () => {
    if (window.ethereum) {
      try {
        const marketplaceInstance = await nftMarketplaceInstance(account);
        const unSoldNfts =
          await marketplaceInstance!.fetchAvailableMarketItems();
        const formattedNFTList = await Promise.all(
          unSoldNfts.map((nft: any) => {
            var res = getFormatedMarketplaceNft(nft, account);
            return res;
          })
        );
        setNftData(formattedNFTList);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="p-20 bg-gray-100 min-h-screen">
        <div className="m-2 text-5xl text-center">Marketplace</div>
        <div className="grid grid-cols-5 gap-6 my-10">
          {nftData.map((item: any, index: number) => {
            console.log({image: item.image})
            return (
              item && (
                <Link href={`/nft/${item.token}`} key={index}>
                  <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl">
                    <div className="w-96 h-80 overflow-hidden">
                      <img
                        src={item.image}
                        alt="Picture of the author"
                        className="w-96 h-80 object-cover hover:scale-110 ease-in duration-300"
                      />
                    </div>
                    <div className="px-4 py-2 flex flex-row justify-between">
                      <div className="font-semibold">{item.name}</div>
                      <div className="flex gap-2">
                        <Image src={Hardhat} width={28} height={28} />
                        <div className="text-right my-auto">{item.price}</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 text-xs">
                      {item.desc}
                    </div>
                  </div>
                </Link>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
