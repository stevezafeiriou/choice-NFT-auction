const Choice = artifacts.require("Choice");
const CanvasContract = artifacts.require("CanvasContract");

module.exports = async function (deployer, network, accounts) {
	const maxPixels = 10; // Reduced the number of NFTs/pixels to 10 for testing

	// Step 1: Deploy the CanvasContract with the max number of pixels
	await deployer.deploy(CanvasContract, maxPixels);
	const canvasInstance = await CanvasContract.deployed();

	// Step 2: Deploy the Choice contract (minting contract), passing the CanvasContract address
	await deployer.deploy(Choice, canvasInstance.address);
	const choiceInstance = await Choice.deployed();

	// Step 3: Set the Choice contract address in the CanvasContract
	await canvasInstance.setMintingContract(choiceInstance.address, {
		from: accounts[0],
	});

	console.log("CanvasContract deployed at:", canvasInstance.address);
	console.log("Choice contract deployed at:", choiceInstance.address);

	// Optional: Fund accounts for testing withdrawals (mainly useful in testnets)
	if (network !== "mainnet") {
		await web3.eth.sendTransaction({
			from: accounts[0],
			to: accounts[1],
			value: web3.utils.toWei("10", "ether"), // Sending 10 ETH for testing purposes
		});
	}
};
