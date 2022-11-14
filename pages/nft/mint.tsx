import Router from "next/router";
import React, { useRef, useState } from "react";
import { useAppState } from "../../provider/AppStateProvider";
import {
  createJSONFile,
  getJSONMetadataBy,
  uploadFile,
} from "../../helper/file";

interface InitialState {
  name: string;
  description: string;
  image: string;
  attributes: object;
  edition: number;
  external_url: string;
  creator?: string | null;
}

const initState = {
  name: "",
  description: "",
  image: "",
  attributes: [],
  edition: 1,
  external_url: "https://www.coretek.io",
};

export default function CreateNFT() {
  const formRef = useRef(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const autoFillRef = useRef<HTMLInputElement>(null);
  const bulkMintRef = useRef<HTMLInputElement>(null);
  const [attributes, setAttributes] = useState<any>(null);
  const [formData, setFormData] = useState<InitialState>(initState);
  const [loading, setLoading] = useState(false);

  const { getAppState } = useAppState();
  

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addAttribute = (e: any) => {
    e.preventDefault();
    if (attributes) {
      var attr = [
        ...attributes,
        {
          id: attributes.length,
          trait_type: e.target.key.value,
          value: e.target.value.value,
        },
      ];
      setAttributes(attr);
    } else {
      setAttributes([
        { id: 0, trait_type: e.target.key.value, value: e.target.value.value },
      ]);
    }
  };

  const removeAttribute = (id: number) => {
    var filteredAttr = attributes.filter((data: any) => data.id !== id);
    setAttributes(filteredAttr);
  };

  async function mint(payload: InitialState, file: File) {
    const {erc20Contract, nftContract, marketplaceContract,signer} = await getAppState();
    const assetFile = file;
    const assetFileName = assetFile.name;
    const assetUrl = await uploadFile(assetFile, assetFileName, "vj");

    payload.image = assetUrl!;
    let assetFileTokens = assetFileName!.split(".");
    if (assetFileTokens.length > 0) assetFileTokens.pop();
    assetFileTokens.push(".json");
    let jsonFileName = assetFileTokens.join("");
    const jsonFile = createJSONFile(payload, jsonFileName);
    const jsonUrl = await uploadFile(jsonFile!, jsonFileName, "vj");

    console.log({ assetUrl, jsonUrl });

    if (
      jsonUrl &&
      signer &&
      erc20Contract &&
      nftContract &&
      marketplaceContract
    ) {
      const mintTx = await nftContract.connect(signer).mintToken(jsonUrl);
      const mintTxReceipt = await mintTx.wait();
      console.log("minted successfully", mintTxReceipt.transactionHash);
      // Router.push("/nft/list");
    } else {
      console.log("minting failed", {
        jsonUrl,
        erc20Contract,
        nftContract,
        marketplaceContract,
        signer,
      });
    }
  }

  const handleMint = async () => {
    try {
      setLoading(true);
      // await new Promise((r) => setTimeout(r, 4000));

      let files = fileRef.current?.files;
      if (!files || files.length == 0) {
        console.log("please select a file to upload");
        return;
      }

      const {address} = await getAppState();

      const { name, description, image, edition, external_url } = formData;
      const payload: InitialState = {
        name: name,
        description: description,
        image: image,
        attributes: attributes,
        creator: address,
        edition,
        external_url
      };

      await mint(payload, files[0]);
    } catch (err: any) {
      console.log("handleMint", err.message, err);
    } finally {
      setLoading(false);
    }
  };

  async function getNFTdata(url: string): Promise<[InitialState, File]> {
    let data = await getJSONMetadataBy(url);
    const { address } = await getAppState();
    let st: InitialState = {
      name: data.name,
      edition: data.edition || 1,
      external_url: initState.external_url,
      // external_url: data.external_url,
      description: data.description,
      image: "",
      attributes: data.attributes,
      creator: address,
    };

    let resp = await fetch(
      data.image.replace("localhost:3000", "52.52.130.184:9999/assets")
    );
    let arrBuf = await resp.arrayBuffer();
    let blob = new Blob([arrBuf], { type: "image/*" });

    const file = new File([blob], data.image.split("/").pop(), {
      type: "image/*",
    });
    return [st, file];
  }

  async function autoFill(url: string) {
    if (!url) return;
    const [st, file]: [InitialState, File] = await getNFTdata(url);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file as File);

    if (fileRef.current) {
      fileRef.current.files = dataTransfer.files;
    }

    setFormData(st);
    setAttributes(st.attributes);
  }

  async function autoFillHelper() {
    try {
      setLoading(true);
      let node = autoFillRef.current;
      let url = node?.value;
      // if (node) {
      //   (node as any).value = null;
      // }
      await autoFill(url as string);
    } catch (err: any) {
      console.log("handleMint", err.message, err);
    } finally {
      setLoading(false);
    }
  }

  async function bulkMint() {
    let progressedI = 0;
    try {
      setLoading(true);
      let node = bulkMintRef.current;
      let val = node?.value;
      let from = 1;
      let to = 1;
      // if (node) {
      //   (node as any).value = null;
      // }
      if (val) {
        [from, to] = val.trim().split(",").map(v => parseInt(v))
      }
      if(!(from > 0 && to > 0 && to >= from)) return
      for(let i = from; i <= to; i++) {
        let url = `http://52.52.130.184:9999/assets/${i}.json`;
        let [payload, file] = await getNFTdata(url);
        await mint(payload, file)
        progressedI = i;
      }
    } catch (err: any) {
      console.log("handleMint", err.message, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div
        className={`${
          loading ? "hidden" : ""
        } p-20 text-center bg-gray-800 h-full`}
      >
        <p className="text-5xl font-semibold heading p-4 text-white">Minting</p>
        <div className="flex justify-end gap-3">
          <div className="flex items-center">
            <input
              type="text"
              className="h-12 w-32 px-2 rounded-lg z-0 focus:shadow focus:outline-none"
              placeholder="from,to"
              ref={bulkMintRef}
            />
            <button
              onClick={bulkMint}
              className="h-10 text-white rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2"
            >
              Bulk Mint
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="url"
              className="h-12 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none"
              placeholder="input json url"
              ref={autoFillRef}
            />
            <button
              onClick={autoFillHelper}
              className="h-10 text-white rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2"
            >
              autoFill
            </button>
          </div>

          <button
            onClick={() => Router.replace("/nft/list")}
            className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
          >
            list
          </button>
          <button
            onClick={() => {
              setFormData(initState);
              setAttributes([]);
            }}
            className="float-right bg-blue-400 rounded-lg py-2 px-4 hover:bg-blue-800 hover:text-white"
          >
            refresh
          </button>
        </div>
        <div className="text-left bg-white p-10 shadow-lg w-1/3 m-auto mt-5 rounded-xl">
          <p className="text-center underline mb-4 text-lg">Create your nft</p>
          <div className="my-4">
            <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
              NFT Name
            </label>
            <input
              className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
              type="text"
              placeholder="Nft Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="my-4">
            <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="my-4">
            <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
              Edition
            </label>
            <input
              className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
              type="text"
              placeholder="Edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            />
          </div>

          <div className="my-4">
            <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
              External url
            </label>
            <input
              className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
              type="text"
              placeholder="External url"
              name="external_url"
              value={formData.external_url}
              onChange={handleChange}
            />
          </div>

          <div className="my-4">
            <label
              className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              className="p-4 block w-full text-sm bg-gray-200 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none"
              id="file_input"
              type="file"
              name="image"
              ref={fileRef}
            />
            <div className="w-full h-30">
              {fileRef.current?.files && fileRef.current.files[0] && (
                <img
                  className="w-full h-full"
                  src={URL.createObjectURL(fileRef.current.files[0])}
                />
              )}
            </div>
          </div>

          <div className="my-4">
            <form onSubmit={(e) => addAttribute(e)} ref={formRef}>
              <label
                className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300"
                htmlFor="file_input"
              >
                Attributes
              </label>

              <div className="flex flex-wrap">
                {attributes
                  ? attributes.map((attr: any, i: number) => {
                      return (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-3 py-0.5 rounded mb-1"
                          onClick={() => removeAttribute(attr.id)}
                        >
                          {attr.trait_type}:{attr.value}
                        </span>
                      );
                    })
                  : ""}
              </div>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="key"
                  className="bg-gray-200 p-4 w-1/2 rounded focus:bg-gray-300 border-0 focus:outline-none"
                  placeholder="Key"
                  required
                />
                <input
                  type="text"
                  name="value"
                  className="bg-gray-200 p-4 w-1/2 rounded focus:bg-gray-300 border-0 focus:outline-none"
                  placeholder="Value"
                  required
                />
                <button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 px-8 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>

          <div className="mb-4 mt-6">
            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 px-8 py-4 rounded"
              onClick={handleMint}
            >
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
