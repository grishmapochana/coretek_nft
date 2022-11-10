import React from "react";
import Client from "../helper/ipfs";
import {
  nftInstance
} from "../helper/web3function";
import { useWeb3React } from "@web3-react/core";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const initialState = {
  name: "",
  price: 0,
  description: "",
  image: "",
  attributes: [],
};

interface InitialState {
  name: string;
  price: number;
  description: string;
  image: string;
  attributes: object;
}

declare let window: any;

export default function Mint() {
  const { account, active } = useWeb3React();
  const formRef = React.useRef(null);
  const [attributes, setAttributes] = React.useState<any>(null);

  const [formData, setFormData] = React.useState<InitialState>(initialState);

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

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const added = await Client.add(file, {
      progress: (prog: any) => console.log(`recieved: ${prog}`),
    });
    setFormData({ ...formData, image: added.path });
  };

  const handleMint = async () => {
    const { name, description, image } = formData;
    const metaData = JSON.stringify({
      name: name,
      description: description,
      image: image,
      attributes: attributes,
    });
    const uri = await Client.add(metaData);
    const url = `https://coretek-nft.infura-ipfs.io/ipfs/${uri.path}`;


    if (window.ethereum && active) {
      const nft_instance = await nftInstance(account);
      const tx = await nft_instance!.mintToken(url);
      await tx.wait();
      toast.success(`${formData.name} minted successfully !`);
    } else {
      toast.error("Please connect your wallet");
    }
  };

  return (
    <>
      <div className="p-20 text-center bg-gray-50 h-screen">
        <p className="text-5xl font-semibold heading p-4">Minting</p>
        <div className="text-left bg-white p-10 shadow-lg w-1/3 m-auto">
          <p className="text-center underline mb-4 text-lg">Create you nft</p>
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
              onChange={handleUpload}
            />
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
    </>
  );
}
