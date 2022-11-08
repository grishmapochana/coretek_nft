import React from "react";
import { useWeb3React } from "@web3-react/core";
import { getFormatedNft, nftMarketplaceInstance } from "../helper/web3function";
import Hardhat from "../assets/hardhat.png";
import Image from "next/image";
import Link from "next/link";

declare let window: any;

export default function Collected() {
  const { account } = useWeb3React();
  const [nftData, setNftData] = React.useState<{ [key: string]: any }>([]);

  React.useEffect(() => {
    if(account) getNFT();
  }, [account]);

  const getNFT = async () => {
    if (window.ethereum) {
      const nftInstance = await nftMarketplaceInstance(account);
      try {
        const mintedNft = await nftInstance!.fetchOwnerItemsListed({
          from: account,
        });
        const formattedNFTList = await Promise.all(
          mintedNft.map((nft: any) => {
            var res = getFormatedNft(nft);
            return res;
          })
        );
        setNftData(formattedNFTList);
      } catch (err) {
        console.log(err);
      }
    }
  };

  console.log({nftData})
  return (
    <div className="p-20 bg-gray-100 min-h-screen">
      <div className="m-2 text-5xl text-center">NFT Collected</div>
      <div className="grid grid-cols-5 gap-6 my-10">
        {nftData.map((item: any, index: number) => {
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
                  <div className="flex gap-2">
                    <Image src={Hardhat} width={28} height={4} />
                    <div>{item.price}</div>
                  </div>
                </div>
                <div className="px-4 py-2 text-xs">
                  {item.desc.substring(0, 100)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
