const Choice = artifacts.require("Choice"); // Minting contract
const CanvasContract = artifacts.require("CanvasContract");
const { time } = require("@openzeppelin/test-helpers");

contract("Choice and CanvasContract", (accounts) => {
	let choiceInstance;
	let canvasInstance;

	const maxTokens = 10;
	const testGrid = [
		"0",
		"0",
		"0",
		"0",
		"0",
		"#ffffff",
		"0",
		"#ff56b1",
		"#ff56b1",
		"0",
		"0",
		"0",
		"0",
		"0",
		"0",
		"#ff56b1",
		"0",
		"#ff56b1",
		"0",
		"0",
		"#ff56b1",
		"0",
		"0",
		"#ff56b1",
		"0",
		"0",
		"0",
		"0",
		"#ff56b1",
		"0",
		"0",
		"0",
		"#ff56b1",
		"0",
		"#ff56b1",
		"0",
		"0",
		"#ff56b1",
		"0",
		"#ff56b1",
	];

	before(async () => {
		canvasInstance = await CanvasContract.deployed();
		choiceInstance = await Choice.deployed();
	});

	it("should mint all tokens and add pixels to the canvas", async () => {
		for (let i = 0; i < maxTokens; i++) {
			await choiceInstance.mintToken(testGrid, {
				from: accounts[0],
				value: web3.utils.toWei("1", "ether"),
			});
		}

		const pixelCount = await canvasInstance.pixelCounter();
		assert.equal(
			pixelCount.toNumber(),
			maxTokens,
			"The canvas should have the correct number of pixels"
		);
	});

	it("should start the auction after the last token is minted", async () => {
		const auctionStarted = await canvasInstance.auctionStarted();
		assert.equal(
			auctionStarted,
			true,
			"The auction should be started after the last token is minted"
		);
	});

	it("should allow bidding and handle outbid refunds", async () => {
		await canvasInstance.bid({
			from: accounts[1],
			value: web3.utils.toWei("1", "ether"),
		});
		let highestBidder = await canvasInstance.highestBidder();
		let highestBid = await canvasInstance.highestBid();
		assert.equal(
			highestBidder,
			accounts[1],
			"Account 1 should be the highest bidder"
		);
		assert.equal(
			highestBid.toString(),
			web3.utils.toWei("1", "ether"),
			"Highest bid should be 1 ETH"
		);

		await canvasInstance.bid({
			from: accounts[2],
			value: web3.utils.toWei("2", "ether"),
		});
		highestBidder = await canvasInstance.highestBidder();
		highestBid = await canvasInstance.highestBid();
		assert.equal(
			highestBidder,
			accounts[2],
			"Account 2 should now be the highest bidder"
		);
		assert.equal(
			highestBid.toString(),
			web3.utils.toWei("2", "ether"),
			"Highest bid should now be 2 ETH"
		);

		const account1BalanceAfter = await web3.eth.getBalance(accounts[1]);
		assert(
			parseFloat(account1BalanceAfter) >
				parseFloat(web3.utils.toWei("99", "ether")),
			"Account 1 should have been refunded"
		);
	});

	it("should end the auction and transfer the canvas to the highest bidder", async () => {
		await time.increase(time.duration.days(7)); // Move time forward

		await canvasInstance.endAuction({ from: accounts[0] });

		const auctionEnded = await canvasInstance.auctionEnded();
		assert.equal(auctionEnded, true, "The auction should have ended");

		const canvasOwner = await canvasInstance.ownerOf(0);
		assert.equal(
			canvasOwner,
			accounts[2],
			"The canvas NFT should have been transferred to the highest bidder"
		);
	});

	it("should retrieve the data URI for token 3 and the full canvas", async () => {
		const tokenDataURI = await choiceInstance.tokenURI(3);
		console.log("\nData URI for Token 3:");
		console.log(tokenDataURI);

		const canvasSVG = await canvasInstance.generateCanvasSVG();
		const canvasDataURI =
			"data:image/svg+xml;base64," + Buffer.from(canvasSVG).toString("base64");

		console.log("\nData URI for the full canvas:");
		console.log(canvasDataURI);
	});
});
