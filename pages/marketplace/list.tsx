import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAppState } from "../../provider/AppStateProvider";
import { getJSONMetadataBy } from "../../helper/file";
import Router from "next/router";
import TransferFormModal from "../../components/Modal";

export default function MintedNFTs({ address }: { address?: string }) {
  const { getContracts, getAppState } = useAppState();
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = React.useState<{ [key: string]: any }>([]);
  const [showModal, setShowModal] = useState(false);
  const transferTokenRef = useRef<any>({});
  const selectedNFTRef = useRef<any>({value: "MY"});

  useEffect(() => {
    getMyNFTs();
  }, []);

  const _getMintedNFTs = async (address?: string) => {
    try {
      setLoading(true);
      const appState = getAppState();
      const { nftContract } = appState;
      if (nftContract && appState.address) {
        let mintedTokens: { tokenId: number; owner: string }[] = [];
        if (!address) {
          const allTokenInfos = await nftContract.getAllTokenInfos();
          mintedTokens = allTokenInfos.map((ti: any) => ({
            tokenId: ti.tokenId,
            owner: ti.owner,
          }));
        } else {
          const allTokenInfosOwnedByAddr =
            await nftContract.getAllTokenInfosOwnedBy(address);

          mintedTokens = allTokenInfosOwnedByAddr.map((ti: any) => ({
            tokenId: ti.tokenId,
            owner: ti.owner,
          }));
        }

        if (mintedTokens && mintedTokens.length > 0) {
          const nfts = await Promise.all(
            mintedTokens.map(async ({ tokenId, owner }) => {
              let tokenUri: string = await nftContract.tokenURI(tokenId);
              let nftData = await getJSONMetadataBy(tokenUri);
              nftData.owner = owner;
              nftData.address = appState.address;
              nftData.tokenId = tokenId;
              return nftData;
            })
          );
          setNfts(nfts);
        } else {
          setNfts([]);
          console.log("no minted nfts found", {});
        }
      } else {
        console.log("getMintedNFTs", "nftContract is required");
      }
    } catch (err: any) {
      console.log(err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const _transferNFT = async (from: string, to: string, tokenId: number) => {
    const { nftContract, signer } = getAppState();
    if (nftContract && signer) {
      const tx = await nftContract.connect(signer).transferFrom(from, to, tokenId);
      const txReceipt = await tx.wait();
      console.log(txReceipt);
    }
  };

  const getMyNFTs = async () => {
    selectedNFTRef.current.value = "MY"
    let appState = getAppState();
    if (appState && appState.address) {
      await _getMintedNFTs(appState.address);
    }
  };

  return (
    <div className="p-20 bg-gray-800 min-h-screen">
      {loading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="m-2 text-5xl text-center text-white">{selectedNFTRef.current.value} - Minted NFTS</div>
          <div className="flex justify-end gap-3">
            <div className="flex justify-end gap-3">
              <button
                onClick={getMyNFTs}
                className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
              >
                My NFTs
              </button>
              <button
                onClick={() => {
                  selectedNFTRef.current.value = "ALL"
                  _getMintedNFTs()
                }}
                className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
              >
                All NFTs
              </button>
            </div>
            <button
              onClick={() => Router.replace("/nft/mint")}
              className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
            >
              mint
            </button>
            {/* <button onClick={() => Router.replace("/nft/list")} className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white">list</button> */}
            <button
              onClick={getMyNFTs}
              className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
            >
              refresh
            </button>
          </div>
          <div className="grid grid-cols-5 gap-6 my-10">
            {nfts.map((item: any, index: number) => {
              return (
                <Link href={`/nft/${item.tokenId}`} key={index}>
                  <div
                    className="rounded-lg overflow-hidden cursor-pointer hover:shadow-md hover:shadow-white bg-white"
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
                    </div>
                    <div className="px-4 py-2 text-xs">
                      {item.description?.substring(0, 100) || "-"}
                    </div>
                    <div className="px-4 py-2 text-xs">
                      {item.owner || "-"}
                      {/* owner address */}
                    </div>
                    <div className="flex items-center justify-center py-2">
                      <button
                        className={`${
                          item.address != item.owner
                            ? "bg-blue-100 line-through"
                            : "bg-blue-400 "
                        } rounded-lg py-2 px-4`}
                        disabled={item.address != item.owner}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                          transferTokenRef.current = {
                            from: item.address,
                            to: null,
                            tokenId: item.tokenId,
                          };
                        }}
                      >
                        transfer
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <>
            <TransferFormModal
              showModal={showModal}
              closeModal={() => setShowModal(false)}
              title={"transfer Token"}
              onSubmit={async (to: string | null) => {
                try {
                  setShowModal(false);
                  setLoading(true);
                  console.log("transfer address", to);
                  if (to) {
                    const { from, tokenId } = transferTokenRef.current;
                    await _transferNFT(from, to, tokenId);
                    await getMyNFTs()
                  }
                } catch (err: any) {
                  console.log("TransferFormModal submit", err.message, err);
                } finally {
                  transferTokenRef.current = {}
                  setLoading(false);
                }
              }}
            />
          </>
        </>
      )}
    </div>
  );
}
