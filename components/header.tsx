import Link from "next/link";
import React from "react";

import { injected } from "./connector";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress, switchBSCTestNetwork } from "../helper/index";
import Image from "next/image";
import Logo from "../assets/logo.png";
import {
  getTokenBalance,
  marketplaceListingFee,
  nftInstance,
  tokenInstance,
  weiToEther,
} from "../helper/web3function";
import { IoWallet } from "react-icons/io5";

var mftMarketplaceAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;

declare let window: any;

export default function Header() {
  const { active, account, activate } = useWeb3React();
  const [balance, setBalance] = React.useState<string>("");

  React.useEffect(() => {
    if (account) getBalance();
  }, [account]);

  const handleConnect = async () => {
    try {
      if (window.ethereum) {
        if (window.ethereum.networkVersion === "97") {
          await activate(injected);
        } else {
          switchBSCTestNetwork();
          await activate(injected);
        }
      } else {
        alert("Please install metamask");
      }
    } catch (exp) {
      console.log(exp);
    }
  };

  const getBalance = async () => {
    const balance = await getTokenBalance(account!);
    setBalance(balance!);
    const listingFee = await marketplaceListingFee()
    localStorage.setItem("listingFee", listingFee!);
  };

  return (
    <div className="shadow-lg p-4 px-20 absolute w-full bg-white top-0">
      <div className="grid grid-cols-9 gap-4">
        <Link href="/">
          <div className="my-auto cursor-pointer">
            <Image src={Logo} width={200} height={40} />
          </div>
        </Link>
        <div className="col-span-8 flex flex-row-reverse gap-10">
          {active ? (
            <>
              <div className="bg-gray-200 p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer">
                {shortenAddress(account)}
              </div>
              <div className="bg-gray-200 p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer flex gap-2">
                <IoWallet className="my-auto" />
                {balance}
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
              onClick={handleConnect}
            >
              Connect Wallet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
