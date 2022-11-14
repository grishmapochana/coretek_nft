import React from "react";
import Image from "next/image";

interface NftData {
  image: string;
  name: string;
  price: string;
  desc: string;
  tokenId: number;
  attribute: any;
}

export default function NftCard(nftData: NftData) {
  const { image, name, price, desc, attribute } = nftData;
  return (
    <div className="shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-2xl">
      <div>
        <img
          src={image}
          alt="Picture of the author"
          className="w-96 h-80 object-cover"
        />
      </div>
      <div className="px-4 py-2 flex justify-between">
        <div className="font-semibold">{name}</div>
        <div className="flex gap-2">
          <Image src={"/hardhat.png"} width={28} height={4} />
          <div>{price}</div>
        </div>
      </div>
      <div className="px-4 py-2 text-xs">{desc.substring(0, 100)}</div>
    </div>
  );
}
