import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

function shortenAddress(address: string, chars = 4) {
  if (!address) return "-";
  return `${address.substring(0, chars + 2)}...${address.substring(
    42 - chars
  )}`;
}

export default function Header({
  state: { balances, address },
  connect,
}: {
  state: {
    balances?: { name: string; symbol: string; value: string }[];
    address?: string;
  };
  connect?: () => Promise<void>;
  reconnect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}) {
  return (
    <div className="shadow-lg p-4 px-20 absolute w-full bg-white top-0">
      <div className="grid grid-cols-9 gap-4">
        <Link href="/">
          <div className="my-auto cursor-pointer">
            <Image src={"/logo.png"} width={200} height={40} />
          </div>
        </Link>

        <div className="col-span-8 flex flex-row-reverse gap-10">
          {address ? (
            <>
              <div className="bg-gray-200 p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer">
                {shortenAddress(address)}
              </div>
              <div className="bg-gray-200 p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer flex gap-2">
                {/* <IoWallet className="my-auto" /> */}
                {/* {state.balance || "-"} */}
              </div>
              <Link href="/my-nfts">
                <div className="my-auto cursor-pointer">My NFTs</div>
              </Link>
              <Link href="/mint">
                <div className="my-auto cursor-pointer">Create</div>
              </Link>
              <Link href="/">
                <div className="my-auto cursor-pointer">Marketplace</div>
              </Link>
            </>
          ) : (
            <div
              className="bg-gray-200 p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer"
              onClick={connect}
            >
              Connect Wallet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
