// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./ERC4907.sol";

contract MyERC4907 is ERC4907 {
    uint256 private _nextTokenId;
    struct Rent{
        uint256 tokenId;
        uint64 expire;
        uint256 blockTimestamp;
    }
    event CarBorrowed(
        uint256 carTokenId,
        address borrower,
        uint256 startTime,
        uint256 duration
    );
    event BlockTimestamp(
        uint256 blockTimestamp
    );
    constructor(
        string memory name,
        string memory symbol
    ) ERC4907(name, symbol) {}

    function airdrop() external {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
    }

    function getTokensByOwner(
        address owner
    ) public view returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](balanceOf(owner));
        uint256 count = 0;

        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (address(ownerOf(i)) == owner) {
                tokens[count] = i;
                count++;
            }
        }
        return tokens;
    }

    function getTokensByUser(//正在借用的列表
        address user
    ) public  returns (Rent[] memory) {
        uint256[] memory tokens = new uint256[](_nextTokenId);
        uint256 count = 0;
        emit BlockTimestamp(block.timestamp);
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (userOf(i)==user) {
                tokens[count] = i;
                count++;
            }
        }
        Rent[] memory result = new Rent[](count);
        for (uint256 i = 0; i < count; i++) {

            result[i] = Rent(tokens[i], _users[tokens[i]].expires,block.timestamp);
        }
        return result;
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
    function MyUserOf(uint256 TokenId,uint256 TimeNow) public view returns(address){
        if((uint256)(_users[TokenId].expires)>TimeNow){
                return _users[TokenId].user;
        }else{
            return address(0);
        }

    }

    function RentCar(uint256 tokenId, address user, uint64 expires,uint256 TimeNow) public {
        if ((uint256)(_users[tokenId].expires)< TimeNow && msg.sender != ownerOf(tokenId)) {
            //排除正在被借用的情况
            setUser(tokenId, user, expires);
            emit CarBorrowed(tokenId, user, block.timestamp, expires);
        } else {
            if (userOf(tokenId) != address(0) && userOf(tokenId) == msg.sender)
                revert("you have rent the car")  ;
            else if (
                userOf(tokenId) != address(0) && userOf(tokenId) != msg.sender
            ) revert( "the car is used by others " ) ;
            else revert("you are renting car of yourself") ;
        }
    }
}
