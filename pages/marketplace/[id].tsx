import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppState } from "../../provider/AppStateProvider";
import { getJSONMetadataBy } from "../../helper/file";
import { getAddressUrl } from "../../contracts/network";

export default function Page() {
  const router = useRouter();
  const id = router.query.id;
  const [nftData, setNftData] = React.useState<{
    name: string;
    image: string;
    description: string;
    external_url?: string;
    dna?: string;
    edition?: string;
    attributes: { trait_type: string; value: string }[];
    creator: string;
  }>({
    name: "-",
    image: "-",
    description: "-",
    attributes: [],
    creator: "-",
  });
  const [loading, setLoading] = useState(false);

  const { getContracts, getProviderNSigner } = useAppState();

  useEffect(() => {
    if (id) getNFT();
  }, [id]);

  const getNFT = async () => {
    try {
      setLoading(true);
      const [erc20Contract, nftContract, marketplaceContract] = getContracts();
      const [_, signer] = getProviderNSigner();
      if (erc20Contract && nftContract && marketplaceContract && signer && id) {
        let tokenId = parseInt(id as string);
        let tokenUri = await nftContract.tokenURI(tokenId);
        let nftData = await getJSONMetadataBy(tokenUri);
        nftData.token = tokenId;
        setNftData(nftData);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-20 bg-gray-800 min-h-screen text-white flex items-center justify-center">
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
          <div className="grid grid-cols-2 gap-10 my-5 mx-40 p-10 rounded-lg shadow bg-gray-700">
            <div className="flex flex-col items-center">
              <img
                src={nftData?.image}
                className="rounded-xl shadow-lg mx-auto w-2/3"
              />
              <p className="text-2xl font-semibold mt-7">#{id}</p>
            </div>
            <div className="my-auto">
              <div className="flex items-center justify-start gap-1">
                <div>
                  <a
                    href={
                      nftData.external_url
                        ? nftData.external_url
                        : "https://www.coretek.io/"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-normal text-blue-500 underline"
                  >
                    {nftData.external_url
                      ? nftData.external_url
                      : "Coretek Labs"}
                  </a>
                </div>
                <img src="/verified.svg" className="h-4" />
              </div>

              <p className="text-6xl font-semibold mt-4">{nftData.name}</p>
              <p className="text-lg mt-4 italic">{nftData.description}</p>
              <p className="text-lg mt-6 font-semibold">
                Edition #{nftData.edition || 1}
              </p>
              <div className="flex items-center justify-start gap-3 mt-6">
                <p className="text-lg font-semibold">Creator : </p>
                <a
                  href={getAddressUrl(nftData.creator || "-")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-normal text-blue-500 underline"
                >
                  {nftData.creator || "-"}
                </a>
              </div>
              {nftData.attributes && nftData.attributes.length > 0 && (
                <div className="mt-7">
                  <p className="mt-2 font-bold">Attributes</p>
                  <div className="flex gap-4 w-full flex-wrap mt-4">
                    {nftData?.attributes &&
                      nftData?.attributes.map((item: any, index: number) => (
                        <div
                          className="bg-gray-800 w-36 py-2 text-center rounded-lg border border-blue-500 cursor-default"
                          key={index}
                        >
                          <div className="text-sm font-bold text-blue-500 uppercase">
                            {item.trait_type}
                          </div>
                          <div className="text-white">{item.value}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
