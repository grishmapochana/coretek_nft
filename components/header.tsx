import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import marketplaceInfo from "../contracts/marketplace";

function shortenAddress(address: string, chars = 4) {
  if (!address) return "-";
  return `${address.substring(0, chars + 2)}...${address.substring(
    42 - chars
  )}`;
}

function formatBalances(
  balances: { name: string; symbol: string; value: string }[]
) {
  let str = "";
  balances.forEach((bal) => (str += `${bal.value} ${bal.symbol}`));
  return str;
}

export default function Header({
  state: { balances, address },
  connect,
  disconnect,
}: {
  state: {
    balances?: { name: string; symbol: string; value: string }[];
    address?: string;
  };
  connect?: () => Promise<void>;
  reconnect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}) {
  const hhAddrs = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  ];

  return (
    <div className="shadow-lg p-4 px-20 absolute w-full bg-gray-900 top-0 text-white">
      <div className="grid grid-cols-9 gap-4">
        <Link href="/">
          <div className="my-auto cursor-pointer text-white">
            <Image
              src={"/logo.png"}
              className="bg-white"
              width={200}
              height={40}
            />
          </div>
        </Link>
        <div className="col-span-8 flex flex-row-reverse gap-10">
          {address ? (
            <>
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg text-black"
                onClick={disconnect}
              >
                disconnect metamask
              </button>
              <div className="bg-gray-50 text-black p-2 rounded shadow-lg transition ease-in-out cursor-pointer">
                {shortenAddress(address)}
              </div>
              {balances && balances.length > 0 && (
                <div className="bg-gray-50 text-black p-2 rounded shadow-lg transition ease-in-out cursor-pointer flex gap-2">
                  {/* <IoWallet className="my-auto" /> */}
                  {/* {state.balance || "-"} */}
                  {formatBalances(balances)}
                </div>
              )}

              <Link href="/nft/mint">
                <div className="my-auto cursor-pointer">NFT</div>
              </Link>
              <Link href="/marketplace/list">
                <div className="my-auto cursor-pointer">Marketplace</div>
              </Link>
              <div className="flex items-center justify-center gap-2">
                {hhAddrs.map((ha, idx) => (
                  <button
                    key={idx}
                    className={`hover:text-blue-600 ${
                      address == ha
                        ? "bg-blue-600 text-white hover:text-black px-2 py-1 rounded-lg"
                        : "border-blue-400 border px-2 py-1 rounded-lg"
                    }`}
                    onClick={() => navigator.clipboard.writeText(hhAddrs[idx])}
                  >
                    hh-{idx}-{ha.slice(-2)}
                  </button>
                ))}
                <button
                  className="hover:text-blue-600 border-blue-400 border px-2 py-1 rounded-lg"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "http://52.52.130.184:9999/assets/1.json"
                    )
                  }
                >
                  json
                </button>
                <button
                  className="hover:text-blue-600 border-blue-400 border px-2 py-1 rounded-lg"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      marketplaceInfo.address
                    )
                  }
                >
                  mp
                </button>
              </div>
            </>
          ) : (
            <button
              className="bg-blue-500 px-4 py-2 rounded-lg text-black"
              onClick={connect}
            >
              connect metamask
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
