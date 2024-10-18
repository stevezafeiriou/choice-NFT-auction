// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DynamicBuffer.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./CanvasContract.sol";

contract Choice is ERC721URIStorage, Ownable {
	using DynamicBuffer for bytes;

	uint256 public maxSupply = 10;
	uint256 public totalMinted = 0;
	uint256 public mintPrice = 1 ether; // Mint price is set to 1 ETH

	CanvasContract public canvasContract;

	constructor(address _canvasContract) ERC721("ChoiceNFT", "CHC") {
		canvasContract = CanvasContract(_canvasContract);
	}

	function mintToken(string[] memory grid) public payable {
		require(totalMinted < maxSupply, "Max supply reached");
		require(grid.length == 40, "Grid must be 8x5 (40 cells)");
		require(msg.value >= mintPrice, "Insufficient ETH to mint");

		uint256 tokenId = totalMinted;
		totalMinted += 1;

		_safeMint(msg.sender, tokenId);

		string memory tokenURIData = generateTokenURI(tokenId, grid);
		_setTokenURI(tokenId, tokenURIData);

		canvasContract.addPixel(tokenId, msg.sender);
	}

	function generateTokenURI(
		uint256 tokenId,
		string[] memory grid
	) public view returns (string memory) {
		require(
			_exists(tokenId),
			"ERC721Metadata: URI query for nonexistent token"
		);

		string memory svgImage = generateSVG(grid);

		string memory json = Base64.encode(
			bytes(
				string(
					abi.encodePacked(
						'{"name": "Choice NFT #',
						Strings.toString(tokenId),
						'", "description": "On-chain generative SVG artwork.", "image": "data:image/svg+xml;base64,',
						Base64.encode(bytes(svgImage)),
						'"}'
					)
				)
			)
		);

		return string(abi.encodePacked("data:application/json;base64,", json));
	}

	function generateSVG(
		string[] memory grid
	) internal pure returns (string memory) {
		string
			memory svgStart = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1080 1080' width='1080' height='1080'>";
		string memory svgEnd = "</svg>";
		string memory svgContent = "";

		string
			memory backgroundRect = "<rect width='1080' height='1080' fill='black' />";
		svgContent = string(abi.encodePacked(svgContent, backgroundRect));

		uint256 xOffset = (1080 - 400) / 2;
		uint256 yOffset = (1080 - 250) / 2;
		uint256 cellSize = 50;

		for (uint256 i = 0; i < grid.length; i++) {
			uint256 x = (i % 8) * cellSize + xOffset;
			uint256 y = (i / 8) * cellSize + yOffset;

			if (keccak256(bytes(grid[i])) != keccak256(bytes("0"))) {
				svgContent = string(
					abi.encodePacked(
						svgContent,
						"<rect width='50' height='50' x='",
						Strings.toString(x),
						"' y='",
						Strings.toString(y),
						"' fill='",
						grid[i],
						"'/>"
					)
				);
			}
		}

		return string(abi.encodePacked(svgStart, svgContent, svgEnd));
	}

	// Withdraw function to allow the owner to withdraw funds from the contract
	function withdraw() external onlyOwner {
		payable(owner()).transfer(address(this).balance);
	}
}
