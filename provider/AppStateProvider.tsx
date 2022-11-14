import { BigNumber, Contract, ethers } from "ethers";
import { useRef, createContext, useContext } from "react";
import network from "../contracts/network";
import mnftInfo from "../contracts/mnft";
import mtokenInfo from "../contracts/mtoken";
import marketplaceInfo from "../contracts/marketplace";
import type { MNFT } from "../contracts/types/MNFT";
import type { MToken } from "../contracts/types/MToken";
import type { Marketplace } from "../contracts/types/Marketplace";

export interface AppState {
  provider?: ethers.providers.Web3Provider | null;
  signer?: ethers.providers.JsonRpcSigner | null;
  address?: string | null; // isMetamaskConnected
  erc20Contract?: MToken | null;
  nftContract?: MNFT | null;
  marketplaceContract?: Marketplace | null;
}

interface AppContextState {
  getAppState: () => AppState;
  updateAppState: (up: Partial<AppState>) => void;
  resetAppState: () => void;
  connectMetamask: () => Promise<void>;
  reconnectMetamask: () => Promise<void>;
  disconnectMetamask: () => Promise<void>;
  getProviderNSigner: () => [
    ethers.providers.Web3Provider | null | undefined,
    ethers.providers.JsonRpcSigner | null | undefined
  ];
  getContracts: () => [
    MToken | undefined | null,
    MNFT | undefined | null,
    Marketplace | undefined | null
  ];
  fromWei: (num: BigNumber) => string;
  toWei: (str: string) => BigNumber;
}

const AppStateContext = createContext<AppContextState>({
  getAppState: () => ({}),
  updateAppState: (up: Partial<AppState>) => {},
  resetAppState: () => {},
  connectMetamask: async () => {},
  reconnectMetamask: async () => {},
  disconnectMetamask: async () => {},
  getProviderNSigner: () => [null, null],
  getContracts: () => [null, null, null],
  fromWei: (num: BigNumber) => ethers.utils.formatEther(num),
  toWei: (str: string) => ethers.utils.parseEther(str),
});

export default function AppStateProvider({ children }: { children: any }) {
  const appStateRef = useRef<AppState>({});

  function getProviderNSigner(): [
    ethers.providers.Web3Provider | null | undefined,
    ethers.providers.JsonRpcSigner | null | undefined
  ] {
    let appState = appStateRef.current;
    return [appState.provider, appState.signer];
  }

  function getAppState(): AppState {
    return { ...appStateRef.current };
  }

  function resetAppState(): void {
    appStateRef.current = {};
  }

  function updateAppState(update: Partial<AppState>): void {
    appStateRef.current = { ...appStateRef.current, ...update };
  }

  function setupContracts() {
    let provider = appStateRef.current.provider;
    if (provider) {
      appStateRef.current.erc20Contract = new ethers.Contract(
        mtokenInfo.address,
        mtokenInfo.habi,
        provider
      ) as MToken;
      appStateRef.current.nftContract = new ethers.Contract(
        mnftInfo.address,
        mnftInfo.habi,
        provider
      ) as MNFT;
      appStateRef.current.marketplaceContract = new ethers.Contract(
        marketplaceInfo.address,
        marketplaceInfo.habi,
        provider
      ) as Marketplace;
    } else {
      console.log("provider is required to setup contracts !");
    }
  }

  function getContracts(): [
    MToken | undefined | null,
    MNFT | undefined | null,
    Marketplace | undefined | null
  ] {
    const erc20Contract = appStateRef.current.erc20Contract;
    const nftContract = appStateRef.current.nftContract;
    const marketplaceContract = appStateRef.current.marketplaceContract;
    return [erc20Contract, nftContract, marketplaceContract];
  }

  const fromWei = (num: BigNumber) => ethers.utils.formatEther(num);
  const toWei = (str: string) => ethers.utils.parseEther(str);

  async function connectMetamask() {
    try {
      let [provider, signer] = getProviderNSigner();
      console.log({ provider, signer });
      if (provider && signer) {
        const signerAddress = await signer.getAddress();
        if (!appStateRef.current.address && signerAddress) {
          updateAppState({ address: signerAddress });
          setupContracts();
        }
        console.log({
          msg: `already connected, signer address is ${signerAddress}`,
        }, getContracts());

        return;
      }

      if (!(window && (window as any).ethereum)) {
        alert("install metamask");
        return;
      }

      appStateRef.current.provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      await appStateRef.current.provider.send("eth_requestAccounts", [
        {
          rpcUrls: [network.url],
          chainId: ethers.utils.hexlify(network.chainId!!),
        },
      ]);
      appStateRef.current.signer = appStateRef.current.provider.getSigner();
      let address = await appStateRef.current.signer.getAddress();
      if (address) {
        updateAppState({ address });
        setupContracts();
      } else {
        console.log(
          "connectMetamask",
          "some thing went wrong - address & smartcontracts not setup",
          { address }
        );
      }
    } catch (err: any) {
      console.log(err.code, err.message);
    }
  }

  async function reconnectMetamask() {
    if (!(window && (window as any).ethereum)) {
      alert("install metamask");
      return;
    }
    appStateRef.current.provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    await appStateRef.current.provider.send("wallet_requestPermissions", [
      { eth_accounts: {} },
    ]);
    appStateRef.current.signer = appStateRef.current.provider.getSigner();
    let address = await appStateRef.current.signer.getAddress();
    if (address) {
      updateAppState({ address });
      setupContracts();
    } else {
      console.log(
        "reconnectMetamask",
        "some thing went wrong - address & smartcontracts not setup",
        { address }
      );
    }
  }

  async function disconnectMetamask() {
    if (!(window && (window as any).ethereum)) {
      alert("install metamask");
      return;
    }
    resetAppState();
  }

  return (
    <AppStateContext.Provider
      value={{
        getAppState,
        updateAppState,
        resetAppState,
        connectMetamask,
        reconnectMetamask,
        disconnectMetamask,
        getProviderNSigner,
        getContracts,
        fromWei,
        toWei,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppContextState {
  const appContextState = useContext(AppStateContext);
  if (!appContextState) {
    throw new Error("useAppState must be used within a useAppStateProvider");
  }
  return appContextState;
}
