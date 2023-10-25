// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./ERC4907.sol";

contract MyERC4907 is ERC4907{
    mapping(address => bool) claimedAirdropUserList;

    constructor(string memory name,string memory symbol) ERC4907(name,symbol){

    }

    function airdrop() external {
        require(claimedAirdropUserList[msg.sender]) == false;

    }
}
