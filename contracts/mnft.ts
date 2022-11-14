
import { ContractInfo } from "./types";
import networkInfo from "./network";  

const contractInfo: ContractInfo = {
  name: "MNFT",
  address: "0x18dE0A63D9F8ebd1c85f597B4419aa77718DE29d",
  habi: [
    "constructor(address _marketplaceAddress)",
    "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
    "event TokenMinted(uint256 indexed tokenId, string tokenURI, address marketplaceAddress)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "function approve(address to, uint256 tokenId)",
    "function balanceOf(address owner) view returns (uint256)",
    "function getAllTokenInfos() view returns (tuple(uint256 tokenId, address owner)[])",
    "function getAllTokenInfosOwnedBy(address addr) view returns (tuple(uint256 tokenId, address owner)[])",
    "function getAllTokenInfosOwnedByMe() view returns (tuple(uint256 tokenId, address owner)[])",
    "function getAllTokens() view returns (uint256[])",
    "function getAllTokensOwnedBy(address addr) view returns (uint256[])",
    "function getApproved(uint256 tokenId) view returns (address)",
    "function getLatestToken() view returns (uint256)",
    "function getTokenCreatorById(uint256 tokenId) view returns (address)",
    "function getTokensCreatedByMe() view returns (uint256[])",
    "function getTokensOwnedByMe() view returns (uint256[])",
    "function isApprovedForAll(address owner, address operator) view returns (bool)",
    "function mintToken(string tokenURI) returns (uint256)",
    "function name() view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function safeTransferFrom(address from, address to, uint256 tokenId)",
    "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",
    "function setApprovalForAll(address operator, bool approved)",
    "function supportsInterface(bytes4 interfaceId) view returns (bool)",
    "function symbol() view returns (string)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function transferFrom(address from, address to, uint256 tokenId)"
],
  network: networkInfo
}

export default contractInfo;
