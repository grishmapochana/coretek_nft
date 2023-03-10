
import { ContractInfo } from "./types";
import networkInfo from "./network";  

const contractInfo: ContractInfo = {
  name: "MToken",
  address: "0x0a694872c6Bef531c805B968B4343Cb01aD66591",
  habi: [
    "constructor()",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
    "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
    "function mint(address to, uint256 amount)",
    "function name() view returns (string)",
    "function owner() view returns (address)",
    "function renounceOwnership()",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "function transferOwnership(address newOwner)"
],
  network: networkInfo
}

export default contractInfo;
