import { ethers } from "ethers";

export function getHABIFromJson(abi: any) {
  const iface = new ethers.utils.Interface(abi);
  const habi = iface.format(ethers.utils.FormatTypes.full);
  return habi;
}

export function getHABIfromContract(contract: ethers.Contract) {
  const iface = contract.interface;
  const habi = iface.format(ethers.utils.FormatTypes.full);
  return habi;
}

export function getJABIfromContract(contract: ethers.Contract) {
  const iface = contract.interface;
  const jabi = iface.format(ethers.utils.FormatTypes.json);
  return jabi;
}
