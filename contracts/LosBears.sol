//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LosBears is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    Counters.Counter private _mintCount;

    Counters.Counter private _giveawayCount;

    Counters.Counter private _whitelistCount;

    string private _defaultBaseURI;

    address payable public payableAddress;

    uint256 public maxMintable = 1111;

    uint256 public maxTokens = 1111;

    uint256 public maxGiveaway = 0;

    uint256 public maxMintPerWL = 50;

    uint256 public mintPrice = 7 ether;

    uint256 public whitelistPrice = 5 ether;

    uint256 public whitelistSaleStart = 1649095200000; // 4th april 8pm CET
    
    uint256 public publicSaleStart = 1649527200000; // 9th april 8pm CET

    mapping(address => uint256) private whitelistBalance;

    constructor() ERC721("Los Bears", "BEAR") {
        _tokenIds.increment();
    }

    function whitelist(address to) public onlyOwner {
        require(to != address(0), "Address cannot be 0");
        whitelistBalance[to] = maxMintPerWL;
    }

    function whitelistAddresses(address[] calldata to) external onlyOwner {
        for (uint i = 0; i < to.length; i++) {
            whitelist(to[i]);
        }
    }

    function isWhitelisted(address to) public view returns (bool) {
        return whitelistBalance[to] > 0 && to != address(0);
    }

    function claim(uint256 quantity) external payable whenNotPaused {
        if (isWhitelisted(msg.sender) && publicSaleStart > block.timestamp) {
            whitelistMint(msg.sender, quantity);
        } else {
            publicMint(msg.sender, quantity);
        }
    }

    function give(address to, uint256 quantity) external onlyOwner {
        giveAmount(to, quantity);
    }

    function publicMint(address to, uint256 quantity) internal {
        require(publicSaleStart <= block.timestamp, "Public sale not started");
        uint256 totalPrice = mintPrice * quantity;
        require(msg.value >= totalPrice, "Invalid amount");
        uint256 tokenId = _tokenIds.current();
        require((tokenId + quantity - 1) < maxMintable, "Cannot claim");
        payableAddress.transfer(totalPrice);
        mintAmount(to, quantity);
    }

    function whitelistMint(address to, uint256 quantity) internal {
        require(whitelistSaleStart <= block.timestamp, "Whitelist sale not started");
        require(publicSaleStart >= block.timestamp, "Whitelist sale ended");
        require(whitelistBalance[to] > 0, "Exceeded whitelist mint limit");
        require(
            whitelistBalance[to] >= quantity,
            string(abi.encodePacked("You can mint just ", whitelistBalance[to].toString(), " more"))
        );
        uint256 totalPrice = whitelistPrice * quantity;
        require(msg.value >= totalPrice, "Invalid amount");
        uint256 tokenId = _tokenIds.current();
        require((tokenId + quantity - 1) < maxMintable, "Cannot claim");
        payableAddress.transfer(totalPrice);
        mintAmount(to, quantity);
    }

    function blockTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function mintAmount(address to, uint256 amount) internal {
        uint256 tokenId = _tokenIds.current();
        for (uint i = 0; i < amount; i++) {
            mintNFT(to, tokenId + i);
        }
    }

    function mintNFT(address to, uint256 tokenId) internal {
        internalMint(to, tokenId);
        _mintCount.increment();
    }

    function giveAmount(address to, uint256 amount) internal {
        uint256 tokenId = _tokenIds.current();
        for (uint i = 0; i < amount; i++) {
            giveNFT(to, tokenId + i);
        }
    }

    function giveNFT(address to, uint256 tokenId) internal {
        internalMint(to, tokenId);
        _giveawayCount.increment();
    }

    function internalMint(address to, uint256 tokenId) internal {
        require(tokenId <= maxTokens, "Token limit exceeded!");
        _safeMint(to, tokenId);
        _tokenIds.increment();
    }

    function togglePause() public onlyOwner {
        if (paused()) {
            _unpause();
        } else {
            _pause();
        }
    }

    function setBaseURI(string calldata newBaseURI) public onlyOwner {
        _defaultBaseURI = newBaseURI;
    }

    function setWhitelistSaleStart(uint256 newTimestamp) public onlyOwner {
        whitelistSaleStart = newTimestamp;
    }

    function setPublicSaleStart(uint256 newTimestamp) public onlyOwner {
        publicSaleStart = newTimestamp;
    }

    function setPayableAddress(address newPayableAddress) public onlyOwner {
        payableAddress = payable(newPayableAddress);
    }

    function setMaxMintPerWL(uint256 newMaxMintPerWL) public onlyOwner {
        maxMintPerWL = newMaxMintPerWL;
    }

    function setMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }

    function setWhitelistPrice(uint256 newWhitelistPrice) public onlyOwner {
        whitelistPrice = newWhitelistPrice;
    }

    function setMaxGiveaway(uint256 newMaxGiveaway) public onlyOwner {
        maxGiveaway = newMaxGiveaway;
        maxMintable = maxTokens - maxGiveaway;
    }

    function setMaxMintable(uint256 newMaxMintable) public onlyOwner {
        maxMintable = newMaxMintable;
        maxGiveaway = maxTokens - maxMintable;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _defaultBaseURI;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}