import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import NFTMarketContractAbi from "../../contracts/ABI/NFT_MARKETPLACE.json";
import { etherToWei, getFormatedNft, nftMarketplaceInstance } from "../../helper/web3function";
import Hardhat from "../../assets/hardhat.png";
import { useWeb3React } from "@web3-react/core";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { capitalizeFirstLetter } from "../../helper";

declare let window: any;
var marketPlaceAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;

interface Nft {
  attributes: [];
  creator: string;
  desc: string;
  image: string;
  name: string;
  price: string;
  token: number;
  owner: string;
}
export default function Page() {
  const { active, account } = useWeb3React();
  const router = useRouter();
  const id = router.query.id;

  const [nftData, setNftData] = React.useState<Nft>();
  React.useEffect(() => {
    if (id) getNFT();
  }, [id]);

  const getNFT = async () => {
    if (window.ethereum) {
      const marketplaceInstance = await nftMarketplaceInstance(account);
      try {
        const nftItems = await marketplaceInstance!.Items(id);
        var formattedNft = await getFormatedNft(nftItems);
        setNftData(formattedNft);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleBuy = async () => {
    if (window.ethereum) {
      const marketplaceInstance = await nftMarketplaceInstance(account);
      try {
        const tx = await marketplaceInstance!.buyItem(id, {
          from: account,
          value: etherToWei(nftData?.price),
        });
        await tx.wait();
        router.push("/collected");
      } catch (err:any) {
        toast.error(capitalizeFirstLetter(err.reason));
      }
    }
  };

  const BuyButton = () => {
    return (
      <div
        className="bg-gray-200 w-40 text-center p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer"
        onClick={handleBuy}
      >
        Buy
      </div>
    );
  }

  return (
    <>
      <div className="p-20 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-2 gap-10 my-5 mx-40 bg-white p-10 rounded-lg shadow">
          <div className="">
            <img
              src={nftData?.image}
              className="rounded-xl shadow-lg mx-auto w-2/3"
            />
          </div>
          <div className="my-auto">
            <p className="text-6xl font-semibold mb-4">{nftData?.name}</p>
            <p className="text-md mb-6">{nftData?.desc}</p>
            <p className="text-md mb-6">Owner Address: {nftData?.owner}</p>
            <p className="text-4xl mb-6 flex gap-4">
              <Image src={Hardhat} width={30} height={2} />
              {nftData?.price} ETH
            </p>
            {nftData?.attributes && <p className="mb-2">Attributes</p>}
            <div className="flex gap-4 w-full flex-wrap mb-6">
              {nftData?.attributes && nftData?.attributes.map((item: any, index) => (
                <div className="bg-blue-200 w-36 py-2 text-center rounded-lg border border-blue-500 cursor-default" key={index}>
                  <div className="text-xs text-blue-500 uppercase">
                    {item.trait_type}
                  </div>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>

            {active ? (
              nftData?.owner.toLocaleLowerCase() ===
              marketPlaceAddress?.toLocaleLowerCase() ? (
                account !== nftData?.creator && <BuyButton />
              ) : (
                account !== nftData?.owner && <BuyButton />
              )
            ) : (
              <div
                className="bg-gray-200 w-40 text-center p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out cursor-pointer"
                // onClick={handleConnect}
              >
                Connect Wallet
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}
