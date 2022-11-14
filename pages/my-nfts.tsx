import React from "react";
import {
  etherToWei,
  getFormatedNft,
  nftInstance,
  nftMarketplaceInstance,
  tokenInstance,
} from "../helper/web3function";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Created from "../components/created";
import Collected from "../components/collected";
import { useAppState } from "../helper/AppStateProvider";

var nftAddress = process.env.NFT_CONTRACT_ADDRESS;
var tokenContractAddress = process.env.TOKEN_ADDRESS;
var listingFee = process.env.LISTING_FEE;
var nftMarketplaceAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;

declare let window: any;

export default function Minted() {
  
  const { getAppState } = useAppState();
  const { address } = getAppState();
  const account = address;

  const [nftData, setNftData] = React.useState<{ [key: string]: any }>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>("");
  const [price, setPrice] = React.useState<any>(0);
  const [tab, setTab] = React.useState<string>('created');

  React.useEffect(() => {
    if (account) getNFT();
  }, [account]);

  const getNFT = async () => {
    if (window.ethereum) {
      const nft_Instance = await nftInstance(account);
      try {
        const mintedNft = await nft_Instance!.getTokensCreatedByMe({
          from: account,
        });
        const formattedNFTList = await Promise.all(
          mintedNft.map((nft: any) => {
            var res = getFormatedNft(nft, account);
            return res;
          })
        );
        setNftData(formattedNFTList);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSellPopup = (data: any) => {
    setShowModal(true);
    setData(data);
  };

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const handleSell = async () => {
    try {
      // console.log({account})
      const token_instance = await tokenInstance(account);
      const res = await token_instance!.increaseAllowance(
        nftMarketplaceAddress,
        etherToWei(price),
        { from: account }
      );
      if(res){
        // console.log({ res });
        // return;
        const nftMarketplace_instance = await nftMarketplaceInstance(account);
        const tx = await nftMarketplace_instance!.createMarketItem(
          nftAddress,
          tokenContractAddress,
          etherToWei(listingFee),
          data.token,
          etherToWei(price)
        );
        await tx.wait();
        toast.success(`${data.name} sold to the marketplace successfully !`);
        setShowModal(false);
      }
    } catch (e) {
      setShowModal(false);
      console.log(e);
    }
  };


  const RenderSwitch = (param:string)=> {
  switch(param) {
    case 'collected':
      return <Collected/>;
    default:
      return <Created/>;
  }
}
  return (
    <div className="p-20 bg-gray-100 min-h-screen">
      <div className="border-b border-gray-200 dark:border-gray-700 mt-2">
        <ul className="mx-auto flex flex-wrap justify-center -mb-px text-lg font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="mr-2">
            <div
              className={`inline-flex p-4 ${
                tab === "created" && "text-blue-600 border-blue-600"
              } rounded-t-lg border-b-2 border-transparent group cursor-pointer dark:text-blue-500 dark:border-blue-500 `}
              onClick={() => setTab("created")}
            >
              Created
            </div>
          </li>
          <li className="mr-2">
            <div
              className={`inline-flex p-4 ${
                tab === "collected" && "text-blue-600 border-blue-600"
              } rounded-t-lg border-b-2  active dark:text-blue-500 dark:border-blue-500 group cursor-pointer`}
              aria-current="page"
              onClick={() => setTab("collected")}
            >
              Collected
            </div>
          </li>
        </ul>
      </div>

      <div>{RenderSwitch(tab)}</div>

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
  );
}
