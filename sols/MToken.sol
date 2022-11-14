
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MToken is ERC20, Ownable {
    constructor() ERC20("MTK", "MTOKEN") {
        uint256 initialSupply = 1000000 * 10**18; // 1,000,000
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
