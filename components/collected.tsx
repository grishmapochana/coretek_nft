import React from "react";
import { etherToWei, getFormatedNft, nftInstance, nftMarketplaceInstance, tokenInstance } from "../helper/web3function";
import { toast, ToastContainer } from "react-toastify";
import NftCard from "./nftCard";
import { useAppState } from "../helper/AppStateProvider";

var nftAddress = process.env.NFT_CONTRACT_ADDRESS;
var tokenContractAddress = process.env.TOKEN_ADDRESS;
var nftMarketplaceAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;

export default function Collected() {
  const {getAppState} = useAppState();
  const [nftData, setNftData] = React.useState<{ [key: string]: any }>([]);

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>("");
  const [price, setPrice] = React.useState<any>(0);
  
  const { address } = getAppState();

  React.useEffect(() => {  
    if (address) getNFT();
  }, [address]);

  const getNFT = async () => {
    if ((window as any).ethereum) {
      const nft_Instance = await nftInstance(address);
      try {
        const mintedNft = await nft_Instance!.getTokensOwnedByMe({
          from: address,
        });
        const formattedNFTList = await Promise.all(
          mintedNft.map((nft: any) => {
            var res = getFormatedNft(nft, address);
            return res;
          })
        );
        console.log({ formattedNFTList });
        setNftData(formattedNFTList);
      } catch (err) {
        console.log(err);
      }
    }
  };

   const handlePriceChange = (e: any) => {
     setPrice(e.target.value);
   };

  const handleSellPopup = (data: any) => {
    setShowModal(true);
    setData(data);
  };

  const handleSell = async () => {
    try {
      const token_instance = await tokenInstance(address);
      const marketplaceFee = localStorage.getItem("listingFee");
      const res = await token_instance!.increaseAllowance(
        nftMarketplaceAddress,
        etherToWei(marketplaceFee),
        { from: address }
      );
      await res.wait();
      if (res) {
        const nftMarketplace_instance = await nftMarketplaceInstance(address);
        const tx = await nftMarketplace_instance!.createMarketItem(
          nftAddress,
          tokenContractAddress,
          etherToWei(marketplaceFee),
          data.token,
          etherToWei(price)
        );
        await tx.wait();
        toast.success(`${data.name} sold to the marketplace successfully !`);
        setShowModal(false);
        getNFT();
      }
    } catch (e) {
      setShowModal(false);
      console.log(e);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-6 my-10">
        {nftData.length > 0 && (
          nftData.map((item: any, index: number) => (
              <NftCard
                key={index}
                image={item.image}
                name={item.name}
                price={item.price}
                desc={item.desc}
                tokenId={item.token}
              />
            )
        ))}
        
        {nftData.length > 0 ? (
          nftData.map((item: any, index: number) => {
            return (
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
                <div className="px-4 py-2 text-xs h-16">
                  {item.desc.substring(0, 100)}
                </div>
                <button
                  className="p-3 w-full bg-gray-200 bg-gray-400"
                  onClick={() => handleSellPopup(item)}
                >
                  Re-sale
                </button>
              </div>
            );
          })
        ) : (
          <div>No NFT's</div>
        )}
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Selling {data.name} to the marketplace
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ??
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {/* <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That???s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can???t do anything, you
                    won???t do anything. I was taught I could do everything.
                  </p> */}
                  <input
                    type="number"
                    placeholder="price in mac"
                    className="bg-gray-200 p-3 rounded-lg w-full"
                    onChange={handlePriceChange}
                  />
                </div>
                {/*footer*/}
                <div className="flex gap-4 items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="hover:bg-gray-500 text-black hover:text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-gray-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSell}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
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
