import Router from "next/router";
import React from "react";
import { useAppState } from "../../provider/AppStateProvider";
import {
  createJSONFile,
  getJSONMetadata,
  getJSONMetadataBy,
  uploadFile,
} from "../../helper/file";

interface InitialState {
  name: string;
  price: number;
  description: string;
  image: string;
  attributes: object;
}

const initState = {
  name: "",
  price: 0,
  description: "",
  image: "",
  attributes: [],
};

export default function CreateNFT() {
  const formRef = React.useRef(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const autoFillRef = React.useRef<HTMLInputElement>(null);
  const [attributes, setAttributes] = React.useState<any>(null);

  const [formData, setFormData] = React.useState<InitialState>(initState);

  const { getContracts, getProviderNSigner } = useAppState();

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

  const handleMint = async () => {
    let files = fileRef.current?.files;
    if (!files || files.length == 0) {
      console.log("please select a file to upload");
      return;
    }

    const { name, description, image } = formData;
    const payload = {
      name: name,
      description: description,
      image: image,
      attributes: attributes,
    };

    const assetFile = files[0];
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

    const [erc20Contract, nftContract, marketplaceContract] = getContracts();
    console.log("📌 👉 👨‍💻 handleMint 👨‍💻 nftContract", nftContract);

    const [_, signer] = getProviderNSigner();
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
  };

  async function autoFillHelper() {
    let node = autoFillRef.current;
    let url = node?.value;
    if (node) {
      (node as any).value = null;
    }
    if (!url) return;
    console.log({url})

    let data = await getJSONMetadataBy(url);
    let st = {
      name: data.name,
      price: 10,
      description: data.description,
      image: "",
      attributes: data.attributes,
    };

    let resp = await fetch(
      data.image.replace("localhost:3000", "52.52.130.184:9999/assets")
    );
    let arrBuf = await resp.arrayBuffer();
    let blob = new Blob([arrBuf], { type: "image/*" });
    const dataTransfer = new DataTransfer();
    const file = new File([blob], data.image.split("/").pop(), {
      type: "image/*",
    });
    dataTransfer.items.add(file);

    if (fileRef.current) {
      fileRef.current.files = dataTransfer.files;
    }

    setFormData(st);
    setAttributes(data.attributes);
  }

  return (
    <>
      <div className="p-20 text-center bg-gray-200 h-full">
        <p className="text-5xl font-semibold heading p-4">Minting</p>
        <div className="flex justify-end gap-3">
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
        <div className="text-left bg-white p-10 shadow-lg w-1/3 m-auto mt-5">
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
              Price
            </label>
            <input
              className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
              type="text"
              placeholder="Bid Price"
              name="price"
              value={formData.price}
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
