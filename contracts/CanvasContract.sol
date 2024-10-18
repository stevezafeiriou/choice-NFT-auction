// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CanvasContract is ERC721, Ownable {
	uint256 public maxPixels;
	uint256 public pixelCounter;
	uint256 public auctionEndTime;
	uint256 public highestBid;
	address public highestBidder;
	bool public auctionStarted;
	bool public auctionEnded;
	address public mintingContract;

	enum PixelColor {
		WHITE,
		BLUE,
		ORANGE
	}

	struct Pixel {
		uint256 x;
		uint256 y;
		PixelColor color;
		address owner;
	}

	mapping(uint256 => Pixel) public pixels;
	mapping(bytes32 => bool) public usedCoordinates;
	address public canvasWinner;
	uint256 public tokenIdCounter;

	event AuctionStarted(uint256 auctionEndTime);
	event BidPlaced(address bidder, uint256 amount);
	event AuctionEnded(address winner, uint256 amount);

	constructor(uint256 _maxPixels) ERC721("OnChainCanvas", "OCC") {
		maxPixels = _maxPixels;
		pixelCounter = 0;
		tokenIdCounter = 0;
	}

	function setMintingContract(address _mintingContract) external onlyOwner {
		mintingContract = _mintingContract;
	}

	function addPixel(uint256 tokenId, address owner) external {
		require(
			msg.sender == mintingContract,
			"Only the minting contract can call this function"
		);
		require(pixelCounter < maxPixels, "Canvas is already full");

		(uint256 x, uint256 y) = getRandomPosition();
		PixelColor color = getColorFromTokenId(tokenId);

		pixels[pixelCounter] = Pixel(x, y, color, owner);
		pixelCounter++;

		if (pixelCounter == maxPixels) {
			mintCanvas();
			startAuction();
		}
	}

	function getColorFromTokenId(
		uint256 tokenId
	) internal pure returns (PixelColor) {
		uint256 modResult = tokenId % 3;
		if (modResult == 0) {
			return PixelColor.WHITE;
		} else if (modResult == 1) {
			return PixelColor.BLUE;
		} else {
			return PixelColor.ORANGE;
		}
	}

	function getRandomPosition() internal returns (uint256, uint256) {
		uint256 gridWidth = 21;
		uint256 gridHeight = 21;

		uint256 x;
		uint256 y;

		bytes32 positionHash;

		do {
			x =
				(uint256(
					keccak256(
						abi.encodePacked(block.prevrandao, block.timestamp, pixelCounter)
					)
				) % gridWidth) *
				50;
			y =
				(uint256(
					keccak256(
						abi.encodePacked(
							block.prevrandao,
							block.timestamp,
							pixelCounter + 1
						)
					)
				) % gridHeight) *
				50;
			positionHash = keccak256(abi.encodePacked(x, y));
		} while (usedCoordinates[positionHash]);

		usedCoordinates[positionHash] = true;

		return (x, y);
	}

	function generateCanvasSVG() public view returns (string memory) {
		string
			memory svgStart = "<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1080' style='background:black'>";
		string memory svgEnd = "</svg>";
		string memory svgContent = "";

		for (uint256 i = 0; i < pixelCounter; i++) {
			Pixel memory p = pixels[i];
			string memory color = getColorString(p.color);

			svgContent = string(
				abi.encodePacked(
					svgContent,
					"<rect width='50' height='50' x='",
					Strings.toString(p.x),
					"' y='",
					Strings.toString(p.y),
					"' fill='",
					color,
					"' />"
				)
			);
		}

		return string(abi.encodePacked(svgStart, svgContent, svgEnd));
	}

	function getColorString(
		PixelColor color
	) internal pure returns (string memory) {
		if (color == PixelColor.WHITE) {
			return "white";
		} else if (color == PixelColor.BLUE) {
			return "blue";
		} else {
			return "orange";
		}
	}

	function mintCanvas() internal {
		_mint(address(this), tokenIdCounter);
	}

	function startAuction() internal {
		require(!auctionStarted, "Auction already started");
		auctionStarted = true;
		auctionEndTime = block.timestamp + 7 days;

		emit AuctionStarted(auctionEndTime);
	}

	function bid() external payable {
		require(auctionStarted, "Auction has not started");
		require(block.timestamp <= auctionEndTime, "Auction has ended");
		require(msg.value > highestBid, "Bid is too low");

		if (highestBidder != address(0)) {
			payable(highestBidder).transfer(highestBid);
		}

		highestBid = msg.value;
		highestBidder = msg.sender;

		emit BidPlaced(msg.sender, msg.value);
	}

	function endAuction() external {
		require(auctionStarted, "Auction not started");
		require(block.timestamp >= auctionEndTime, "Auction not ended yet");
		require(!auctionEnded, "Auction already ended");

		auctionEnded = true;
		canvasWinner = highestBidder;

		_transfer(address(this), highestBidder, tokenIdCounter);
		payable(owner()).transfer(highestBid);

		emit AuctionEnded(highestBidder, highestBid);
	}

	// Withdraw function for the contract owner to withdraw funds
	function withdraw() external onlyOwner {
		payable(owner()).transfer(address(this).balance);
	}
}
