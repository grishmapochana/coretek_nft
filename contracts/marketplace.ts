
import { ContractInfo } from "./types";
import networkInfo from "./network";  

const contractInfo: ContractInfo = {
  name: "Marketplace",
  address: "0x0d287f61B3dB151b0403A634BaD66ae593fB9078",
  habi: [
    "constructor()",
    "event MarketItemCreated(uint256 indexed marketItemId, address indexed nftContract, uint256 indexed tokenId, address creator, address seller, address owner, uint256 price, bool sold, bool canceled)",
    "function cancelMarketItem(address nftContractAddress, uint256 marketItemId) payable",
    "function createMarketItem(address nftContractAddress, address erc20ContractAddress, uint256 feeAmount, uint256 tokenId, uint256 price) payable returns (uint256)",
    "function createMarketSale(address nftContractAddress, address erc20ContractAddress, uint256 marketItemId) payable",
    "function fetchAvailableMarketItems() view returns (tuple(uint256 marketItemId, address nftContractAddress, uint256 tokenId, address creator, address seller, address owner, uint256 price, bool sold, bool canceled)[])",
    "function fetchMarketItemsByAddressProperty(string _addressProperty) view returns (tuple(uint256 marketItemId, address nftContractAddress, uint256 tokenId, address creator, address seller, address owner, uint256 price, bool sold, bool canceled)[])",
    "function fetchOwnedMarketItems() view returns (tuple(uint256 marketItemId, address nftContractAddress, uint256 tokenId, address creator, address seller, address owner, uint256 price, bool sold, bool canceled)[])",
    "function fetchSellingMarketItems() view returns (tuple(uint256 marketItemId, address nftContractAddress, uint256 tokenId, address creator, address seller, address owner, uint256 price, bool sold, bool canceled)[])",
    "function getLatestMarketItemByTokenId(uint256 tokenId) view returns (tuple(uint256 marketItemId, address nftContractAddress, uint256 tokenId, address creator, address seller, address owner, uint256 price, bool sold, bool canceled), bool)",
    "function getListingFee() view returns (uint256)"
],
  network: networkInfo
}

export default contractInfo;
