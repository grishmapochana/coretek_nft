/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface MarketplaceInterface extends utils.Interface {
  functions: {
    "cancelMarketItem(address,uint256)": FunctionFragment;
    "createMarketItem(address,address,uint256,uint256,uint256)": FunctionFragment;
    "createMarketSale(address,address,uint256)": FunctionFragment;
    "fetchAvailableMarketItems()": FunctionFragment;
    "fetchMarketItemsByAddressProperty(string)": FunctionFragment;
    "fetchOwnedMarketItems()": FunctionFragment;
    "fetchSellingMarketItems()": FunctionFragment;
    "getLatestMarketItemByTokenId(uint256)": FunctionFragment;
    "getListingFee()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "cancelMarketItem"
      | "createMarketItem"
      | "createMarketSale"
      | "fetchAvailableMarketItems"
      | "fetchMarketItemsByAddressProperty"
      | "fetchOwnedMarketItems"
      | "fetchSellingMarketItems"
      | "getLatestMarketItemByTokenId"
      | "getListingFee"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "cancelMarketItem",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createMarketItem",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createMarketSale",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchAvailableMarketItems",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fetchMarketItemsByAddressProperty",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchOwnedMarketItems",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fetchSellingMarketItems",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getLatestMarketItemByTokenId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getListingFee",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelMarketItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createMarketItem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createMarketSale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchAvailableMarketItems",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchMarketItemsByAddressProperty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchOwnedMarketItems",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchSellingMarketItems",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLatestMarketItemByTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getListingFee",
    data: BytesLike
  ): Result;

  events: {
    "MarketItemCreated(uint256,address,uint256,address,address,address,uint256,bool,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MarketItemCreated"): EventFragment;
}

export interface MarketItemCreatedEventObject {
  marketItemId: BigNumber;
  nftContract: string;
  tokenId: BigNumber;
  creator: string;
  seller: string;
  owner: string;
  price: BigNumber;
  sold: boolean;
  canceled: boolean;
}
export type MarketItemCreatedEvent = TypedEvent<
  [
    BigNumber,
    string,
    BigNumber,
    string,
    string,
    string,
    BigNumber,
    boolean,
    boolean
  ],
  MarketItemCreatedEventObject
>;

export type MarketItemCreatedEventFilter =
  TypedEventFilter<MarketItemCreatedEvent>;

export interface Marketplace extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MarketplaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    cancelMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      feeAmount: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createMarketSale(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    fetchAvailableMarketItems(
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          string,
          BigNumber,
          string,
          string,
          string,
          BigNumber,
          boolean,
          boolean
        ] &
          {
            marketItemId: BigNumber;
            nftContractAddress: string;
            tokenId: BigNumber;
            creator: string;
            seller: string;
            owner: string;
            price: BigNumber;
            sold: boolean;
            canceled: boolean;
          }[]
      ]
    >;

    fetchMarketItemsByAddressProperty(
      _addressProperty: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          string,
          BigNumber,
          string,
          string,
          string,
          BigNumber,
          boolean,
          boolean
        ] &
          {
            marketItemId: BigNumber;
            nftContractAddress: string;
            tokenId: BigNumber;
            creator: string;
            seller: string;
            owner: string;
            price: BigNumber;
            sold: boolean;
            canceled: boolean;
          }[]
      ]
    >;

    fetchOwnedMarketItems(
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          string,
          BigNumber,
          string,
          string,
          string,
          BigNumber,
          boolean,
          boolean
        ] &
          {
            marketItemId: BigNumber;
            nftContractAddress: string;
            tokenId: BigNumber;
            creator: string;
            seller: string;
            owner: string;
            price: BigNumber;
            sold: boolean;
            canceled: boolean;
          }[]
      ]
    >;

    fetchSellingMarketItems(
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          string,
          BigNumber,
          string,
          string,
          string,
          BigNumber,
          boolean,
          boolean
        ] &
          {
            marketItemId: BigNumber;
            nftContractAddress: string;
            tokenId: BigNumber;
            creator: string;
            seller: string;
            owner: string;
            price: BigNumber;
            sold: boolean;
            canceled: boolean;
          }[]
      ]
    >;

    getLatestMarketItemByTokenId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          string,
          BigNumber,
          string,
          string,
          string,
          BigNumber,
          boolean,
          boolean
        ] & {
          marketItemId: BigNumber;
          nftContractAddress: string;
          tokenId: BigNumber;
          creator: string;
          seller: string;
          owner: string;
          price: BigNumber;
          sold: boolean;
          canceled: boolean;
        },
        boolean
      ]
    >;

    getListingFee(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  cancelMarketItem(
    nftContractAddress: PromiseOrValue<string>,
    marketItemId: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createMarketItem(
    nftContractAddress: PromiseOrValue<string>,
    erc20ContractAddress: PromiseOrValue<string>,
    feeAmount: PromiseOrValue<BigNumberish>,
    tokenId: PromiseOrValue<BigNumberish>,
    price: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createMarketSale(
    nftContractAddress: PromiseOrValue<string>,
    erc20ContractAddress: PromiseOrValue<string>,
    marketItemId: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  fetchAvailableMarketItems(
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      string,
      BigNumber,
      string,
      string,
      string,
      BigNumber,
      boolean,
      boolean
    ] &
      {
        marketItemId: BigNumber;
        nftContractAddress: string;
        tokenId: BigNumber;
        creator: string;
        seller: string;
        owner: string;
        price: BigNumber;
        sold: boolean;
        canceled: boolean;
      }[]
  >;

  fetchMarketItemsByAddressProperty(
    _addressProperty: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      string,
      BigNumber,
      string,
      string,
      string,
      BigNumber,
      boolean,
      boolean
    ] &
      {
        marketItemId: BigNumber;
        nftContractAddress: string;
        tokenId: BigNumber;
        creator: string;
        seller: string;
        owner: string;
        price: BigNumber;
        sold: boolean;
        canceled: boolean;
      }[]
  >;

  fetchOwnedMarketItems(
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      string,
      BigNumber,
      string,
      string,
      string,
      BigNumber,
      boolean,
      boolean
    ] &
      {
        marketItemId: BigNumber;
        nftContractAddress: string;
        tokenId: BigNumber;
        creator: string;
        seller: string;
        owner: string;
        price: BigNumber;
        sold: boolean;
        canceled: boolean;
      }[]
  >;

  fetchSellingMarketItems(
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      string,
      BigNumber,
      string,
      string,
      string,
      BigNumber,
      boolean,
      boolean
    ] &
      {
        marketItemId: BigNumber;
        nftContractAddress: string;
        tokenId: BigNumber;
        creator: string;
        seller: string;
        owner: string;
        price: BigNumber;
        sold: boolean;
        canceled: boolean;
      }[]
  >;

  getLatestMarketItemByTokenId(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [
      [
        BigNumber,
        string,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        boolean,
        boolean
      ] & {
        marketItemId: BigNumber;
        nftContractAddress: string;
        tokenId: BigNumber;
        creator: string;
        seller: string;
        owner: string;
        price: BigNumber;
        sold: boolean;
        canceled: boolean;
      },
      boolean
    ]
  >;

  getListingFee(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    cancelMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      feeAmount: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createMarketSale(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    fetchAvailableMarketItems(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        boolean,
        boolean
      ] &
        {
          marketItemId: BigNumber;
          nftContractAddress: string;
          tokenId: BigNumber;
          creator: string;
          seller: string;
          owner: string;
          price: BigNumber;
          sold: boolean;
          canceled: boolean;
        }[]
    >;

    fetchMarketItemsByAddressProperty(
      _addressProperty: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        boolean,
        boolean
      ] &
        {
          marketItemId: BigNumber;
          nftContractAddress: string;
          tokenId: BigNumber;
          creator: string;
          seller: string;
          owner: string;
          price: BigNumber;
          sold: boolean;
          canceled: boolean;
        }[]
    >;

    fetchOwnedMarketItems(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        boolean,
        boolean
      ] &
        {
          marketItemId: BigNumber;
          nftContractAddress: string;
          tokenId: BigNumber;
          creator: string;
          seller: string;
          owner: string;
          price: BigNumber;
          sold: boolean;
          canceled: boolean;
        }[]
    >;

    fetchSellingMarketItems(
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        boolean,
        boolean
      ] &
        {
          marketItemId: BigNumber;
          nftContractAddress: string;
          tokenId: BigNumber;
          creator: string;
          seller: string;
          owner: string;
          price: BigNumber;
          sold: boolean;
          canceled: boolean;
        }[]
    >;

    getLatestMarketItemByTokenId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        [
          BigNumber,
          string,
          BigNumber,
          string,
          string,
          string,
          BigNumber,
          boolean,
          boolean
        ] & {
          marketItemId: BigNumber;
          nftContractAddress: string;
          tokenId: BigNumber;
          creator: string;
          seller: string;
          owner: string;
          price: BigNumber;
          sold: boolean;
          canceled: boolean;
        },
        boolean
      ]
    >;

    getListingFee(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "MarketItemCreated(uint256,address,uint256,address,address,address,uint256,bool,bool)"(
      marketItemId?: PromiseOrValue<BigNumberish> | null,
      nftContract?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      creator?: null,
      seller?: null,
      owner?: null,
      price?: null,
      sold?: null,
      canceled?: null
    ): MarketItemCreatedEventFilter;
    MarketItemCreated(
      marketItemId?: PromiseOrValue<BigNumberish> | null,
      nftContract?: PromiseOrValue<string> | null,
      tokenId?: PromiseOrValue<BigNumberish> | null,
      creator?: null,
      seller?: null,
      owner?: null,
      price?: null,
      sold?: null,
      canceled?: null
    ): MarketItemCreatedEventFilter;
  };

  estimateGas: {
    cancelMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      feeAmount: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createMarketSale(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    fetchAvailableMarketItems(overrides?: CallOverrides): Promise<BigNumber>;

    fetchMarketItemsByAddressProperty(
      _addressProperty: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fetchOwnedMarketItems(overrides?: CallOverrides): Promise<BigNumber>;

    fetchSellingMarketItems(overrides?: CallOverrides): Promise<BigNumber>;

    getLatestMarketItemByTokenId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getListingFee(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    cancelMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createMarketItem(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      feeAmount: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      price: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createMarketSale(
      nftContractAddress: PromiseOrValue<string>,
      erc20ContractAddress: PromiseOrValue<string>,
      marketItemId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    fetchAvailableMarketItems(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchMarketItemsByAddressProperty(
      _addressProperty: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchOwnedMarketItems(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fetchSellingMarketItems(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLatestMarketItemByTokenId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getListingFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
