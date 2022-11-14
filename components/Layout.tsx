import { stat } from "fs";
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
  }>({ balances: [] });

  async function getOrUpdateState() {
    const appst = getAppState();
    const [erc20Contract, nftContract, marketplaceContract] = getContracts();
    console.log("Hi")
    if (appst.address && erc20Contract && nftContract && marketplaceContract) {
      let name = await erc20Contract.name();
      let symbol = await erc20Contract.symbol();
      let balInWei = await erc20Contract.balanceOf(appst.address);
      setState({
        address: appst.address,
        balances: [{ name, symbol, value: fromWei(balInWei) }],
      });
    }
  }

  const connect = useCallback(async () => {
    await connectMetamask();
    await getOrUpdateState();
  }, []);

  const reconnect = useCallback(async () => {
    await reconnectMetamask();
    await getOrUpdateState();
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectMetamask(); // internally resets appstate
    await getOrUpdateState();
  }, []);

  return (
    <div>
      <Header
        state={state}
        connect={connect}
        reconnect={reconnect}
        disconnect={disconnect}
      />
      {state.address ? children : <div className="m-20">please connect metamask</div>}
    </div>
  );
}
