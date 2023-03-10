/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Marketplace, MarketplaceInterface } from "../Marketplace";

const _abi = [
  {
    type: "constructor",
    payable: false,
    inputs: [],
  },
  {
    type: "event",
    anonymous: false,
    name: "MarketItemCreated",
    inputs: [
      {
        type: "uint256",
        name: "marketItemId",
        indexed: true,
      },
      {
        type: "address",
        name: "nftContract",
        indexed: true,
      },
      {
        type: "uint256",
        name: "tokenId",
        indexed: true,
      },
      {
        type: "address",
        name: "creator",
        indexed: false,
      },
      {
        type: "address",
        name: "seller",
        indexed: false,
      },
      {
        type: "address",
        name: "owner",
        indexed: false,
      },
      {
        type: "uint256",
        name: "price",
        indexed: false,
      },
      {
        type: "bool",
        name: "sold",
        indexed: false,
      },
      {
        type: "bool",
        name: "canceled",
        indexed: false,
      },
    ],
  },
  {
    type: "function",
    name: "cancelMarketItem",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      {
        type: "address",
        name: "nftContractAddress",
      },
      {
        type: "uint256",
        name: "marketItemId",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "createMarketItem",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      {
        type: "address",
        name: "nftContractAddress",
      },
      {
        type: "address",
        name: "erc20ContractAddress",
      },
      {
        type: "uint256",
        name: "feeAmount",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "price",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "createMarketSale",
    constant: false,
    stateMutability: "payable",
    payable: true,
    inputs: [
      {
        type: "address",
        name: "nftContractAddress",
      },
      {
        type: "address",
        name: "erc20ContractAddress",
      },
      {
        type: "uint256",
        name: "marketItemId",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "fetchAvailableMarketItems",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          {
            type: "uint256",
            name: "marketItemId",
          },
          {
            type: "address",
            name: "nftContractAddress",
          },
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "address",
            name: "creator",
          },
          {
            type: "address",
            name: "seller",
          },
          {
            type: "address",
            name: "owner",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "bool",
            name: "sold",
          },
          {
            type: "bool",
            name: "canceled",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "fetchMarketItemsByAddressProperty",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "string",
        name: "_addressProperty",
      },
    ],
    outputs: [
      {
        type: "tuple[]",
        components: [
          {
            type: "uint256",
            name: "marketItemId",
          },
          {
            type: "address",
            name: "nftContractAddress",
          },
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "address",
            name: "creator",
          },
          {
            type: "address",
            name: "seller",
          },
          {
            type: "address",
            name: "owner",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "bool",
            name: "sold",
          },
          {
            type: "bool",
            name: "canceled",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "fetchOwnedMarketItems",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          {
            type: "uint256",
            name: "marketItemId",
          },
          {
            type: "address",
            name: "nftContractAddress",
          },
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "address",
            name: "creator",
          },
          {
            type: "address",
            name: "seller",
          },
          {
            type: "address",
            name: "owner",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "bool",
            name: "sold",
          },
          {
            type: "bool",
            name: "canceled",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "fetchSellingMarketItems",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          {
            type: "uint256",
            name: "marketItemId",
          },
          {
            type: "address",
            name: "nftContractAddress",
          },
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "address",
            name: "creator",
          },
          {
            type: "address",
            name: "seller",
          },
          {
            type: "address",
            name: "owner",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "bool",
            name: "sold",
          },
          {
            type: "bool",
            name: "canceled",
          },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getLatestMarketItemByTokenId",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "tokenId",
      },
    ],
    outputs: [
      {
        type: "tuple",
        components: [
          {
            type: "uint256",
            name: "marketItemId",
          },
          {
            type: "address",
            name: "nftContractAddress",
          },
          {
            type: "uint256",
            name: "tokenId",
          },
          {
            type: "address",
            name: "creator",
          },
          {
            type: "address",
            name: "seller",
          },
          {
            type: "address",
            name: "owner",
          },
          {
            type: "uint256",
            name: "price",
          },
          {
            type: "bool",
            name: "sold",
          },
          {
            type: "bool",
            name: "canceled",
          },
        ],
      },
      {
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "getListingFee",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
];

export class Marketplace__factory {
  static readonly abi = _abi;
  static createInterface(): MarketplaceInterface {
    return new utils.Interface(_abi) as MarketplaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Marketplace {
    return new Contract(address, _abi, signerOrProvider) as Marketplace;
  }
}
