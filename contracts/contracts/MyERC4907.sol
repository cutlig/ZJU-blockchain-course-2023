// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./ERC4907.sol";

contract MyERC4907 is ERC4907 {
    uint256 private _nextTokenId;

    constructor(
        string memory name,
        string memory symbol
    ) ERC4907(name, symbol) {}

    function airdrop() external {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
    }

    function getTokensByUser(
        address user
    ) public view returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](balanceOf(user));
        uint256 count = 0;

        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (address(_users[i].user) == user) {
                tokens[count] = i;
                count++;
            }
        }

        return tokens;
    }


    function getUnusedTokenIds() public view returns (uint256[] memory) {
        uint256[] memory unusedTokenIds = new uint256[](_nextTokenId);
        uint256 unusedTokenCount = 0;

        for (uint256 tokenId = 0; tokenId < _nextTokenId; tokenId++) {
            if (userOf(tokenId) == address(0)) {
                unusedTokenIds[unusedTokenCount] = tokenId;
                unusedTokenCount++;
            }
        }

        uint256[] memory result = new uint256[](unusedTokenCount);
        for (uint256 i = 0; i < unusedTokenCount; i++) {
            result[i] = unusedTokenIds[i];
        }


        return result;
    }

    function RentCar(uint256 tokenId, address user, uint64 expires) public {
        if(userOf(tokenId)==address(0)){
            setUser(tokenId, user, expires);
        }
    }
}
