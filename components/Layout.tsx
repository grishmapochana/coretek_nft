import { ReactNode, useCallback, useState } from "react";
import Header from "../components/header";
import { useAppState } from "../provider/AppStateProvider";

export default function Layout({ children }: { children?: ReactNode }) {
  const {
    getContracts,
    getAppState,
    fromWei,
    connectMetamask,
    reconnectMetamask,
    disconnectMetamask,
  } = useAppState();
  const [state, setState] = useState<{
    balances: { name: string; symbol: string; value: string }[];
    address?: string;
    loading: boolean;
  }>({ balances: [], loading: false });

  async function getOrUpdateState() {
    try {
      setState({ balances: [], loading: true });
      const appst = getAppState();
      const [erc20Contract, nftContract, marketplaceContract] = getContracts();
      // console.log("getOrUpdateState", appst)
      if (
        appst.address &&
        erc20Contract &&
        nftContract &&
        marketplaceContract
      ) {
        let name = await erc20Contract.name();
        let symbol = await erc20Contract.symbol();
        let balInWei = await erc20Contract.balanceOf(appst.address);
        setState({
          address: appst.address,
          balances: [{ name, symbol, value: fromWei(balInWei) }],
          loading: false,
        });
      }
    } catch (err) {
      console.log(err)
      await disconnectMetamask();
      setState({ balances: [], loading: false });
    }
  }

  const connect = useCallback(async () => {
    setState({ balances: [], loading: true });
    await connectMetamask();
    await getOrUpdateState();
  }, []);

  const reconnect = useCallback(async () => {
    setState({ balances: [], loading: true });
    await reconnectMetamask();
    await getOrUpdateState();
  }, []);

  const disconnect = useCallback(async () => {
    setState({ balances: [], loading: true });
    await disconnectMetamask(); // internally resets appstate
    setState({ balances: [], loading: false });
  }, []);

  return (
    <div>
      <Header
        state={state}
        connect={connect}
        reconnect={reconnect}
        disconnect={disconnect}
      />
      {state.address ? (
        children
      ) : (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-800">
          {state.loading ? (
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <button
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onClick={connect}
            >
              connect metamask
            </button>
          )}
        </div>
      )}
    </div>
  );
}
