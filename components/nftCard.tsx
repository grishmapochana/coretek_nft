import React, {FC} from "react";
import Image from "next/image";
import Hardhat from "../assets/hardhat.png";
import { NftData } from "./interface";
import Link from "next/link";
import Button from "./button";

const NftCard: FC<NftData> = (nftData) => {
  const { image, name, price, desc, tokenId } = nftData;

  return (
    <Link href={`/nft/${tokenId}`}>
      <div className="shadow-lg rounded-lg overflow-hidden hover:shadow-2xl">
        <div className="w-96 h-80 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-96 h-80 object-cover hover:scale-110 ease-in duration-300"
          />
        </div>
        <div className="px-4 py-2 flex justify-between">
          <div className="font-semibold">{name}</div>
          <div className="flex gap-2">
            <Image src={Hardhat} width={28} height={28} />
            <div>{price}</div>
          </div>
        </div>
        <div className="px-4 py-2 text-xs">{desc}</div>
        {/* <div className="grid grid-cols-2 gap-4 p-2">
          <Button>Buy</Button>
          <Button>Sale</Button>
        </div> */}
      </div>
    </Link>
  );
}

export default NftCard;