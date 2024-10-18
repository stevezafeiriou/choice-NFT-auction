// src/components/Home.js
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { BrowserProvider, Contract } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import NFTCollection from "../../contracts/NFTCollection.json";
import { Container, Card, Input, Button, Message } from "./HomeElements";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
	const { address, isConnected } = useAccount();

	const [numberOfTokens, setNumberOfTokens] = useState(1);
	const [message, setMessage] = useState("");
	const [contractAddress, setContractAddress] = useState(null);

	useEffect(() => {
		// Load the contract address from the NFTCollection JSON file
		if (NFTCollection && NFTCollection.networks) {
			const networkId = "5777"; // Update to the correct network ID
			if (NFTCollection.networks[networkId]) {
				const address = NFTCollection.networks[networkId].address;
				console.log(`Contract address for network ${networkId}: ${address}`);
				setContractAddress(address);
			} else {
				console.error(`No contract deployed on network ${networkId}`);
			}
		} else {
			console.error("NFTCollection.json does not contain networks key");
		}
	}, []);

	const handleMint = async () => {
		if (!isConnected) {
			setMessage("Please connect your wallet first.");
			return;
		}

		if (!contractAddress) {
			setMessage("Contract address is not set.");
			console.error("Contract address is not set.");
			return;
		}

		try {
			const provider = new BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new Contract(contractAddress, NFTCollection.abi, signer);

			// Hardcode the price as 0.05 ether
			const price = parseEther("0.05");
			const totalCost = price.mul(BigNumber.from(numberOfTokens));

			const tx = await contract.mint(numberOfTokens, {
				value: totalCost.toHexString(),
			});
			await tx.wait();

			setMessage(`Successfully minted ${numberOfTokens} tokens!`);
			toast.success(`Successfully minted ${numberOfTokens} tokens!`);
		} catch (error) {
			console.error("Minting error:", error);
			if (error.code === "INSUFFICIENT_FUNDS") {
				setMessage("Insufficient funds to complete the transaction.");
			} else if (error.code === "NETWORK_ERROR") {
				setMessage(
					"Network error. Please check your internet connection and try again."
				);
			} else if (error.code === "GAS_LIMIT") {
				setMessage(
					"Gas limit error. Please increase the gas limit and try again."
				);
			} else {
				setMessage("An error occurred while minting. Please try again.");
			}
			toast.error("An error occurred while minting. Please try again.");
		}
	};

	return (
		<Container>
			<Card>
				{isConnected ? (
					<>
						<h2>NFT Minter</h2>
						<p>
							Add the amount of NFTs you want to Mint. You can mint 1-5 NFTs per
							Wallet.
						</p>
						<Input
							type="number"
							min="1"
							max="5"
							value={numberOfTokens}
							onChange={(e) => setNumberOfTokens(Number(e.target.value))}
						/>
						<Button onClick={handleMint}>Mint Tokens</Button>
						{message && <Message>{message}</Message>}
					</>
				) : (
					<Message>Please connect your wallet in order to mint.</Message>
				)}
			</Card>
			<ToastContainer position="top-center" />
		</Container>
	);
};

export default Home;
