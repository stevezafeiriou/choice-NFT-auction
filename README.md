# Choice NFT and Canvas Auction [Saphire Labs]

This project is a decentralized application (DApp) for minting on-chain NFTs using Ethereum smart contracts. Each minted NFT contributes to a collective pixel canvas, which is eventually auctioned to the highest bidder after all NFTs are minted. This documentation covers the deployment and operation of the `Choice` and `CanvasContract` contracts, along with the structure to develop a frontend DApp.

![Choice NFT](./images/mint.png)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Compiling Contracts](#compiling-contracts)
- [Deploying Contracts](#deploying-contracts)
- [Testing the Contracts](#testing-the-contracts)
- [Running the Frontend](#running-the-frontend)
- [Smart Contract Overview](#smart-contract-overview)
- [Frontend TODO](#frontend-todo)
- [License](#license)
- [Contact](#contact)

## Prerequisites

Ensure that the following tools are installed on your development machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (version 6.x or later)
- [Truffle](https://www.trufflesuite.com/) (version 5.x or later)
- [Ganache](https://www.trufflesuite.com/ganache) (for local Ethereum development)
- [MetaMask](https://metamask.io/) or another Ethereum wallet for interacting with the DApp.

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd nft-collection
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

## Configuration

1. **Create a `.env` file:**

   In the root directory, create a `.env` file and add your environment variables:

   ```plaintext
   MNEMONIC="your mnemonic phrase here"
   INFURA_PROJECT_ID="your Infura project ID here"
   ETHERSCAN_API_KEY="your Etherscan API key here"
   ```

2. **Update `truffle-config.js`:**

   Ensure the `truffle-config.js` file has the correct Infura and network configurations for development or deployment:

   ```javascript
   const HDWalletProvider = require("@truffle/hdwallet-provider");
   require("dotenv").config();

   module.exports = {
   	contracts_build_directory: "./client/src/contracts",
   	networks: {
   		development: {
   			host: "127.0.0.1",
   			port: 8545,
   			network_id: "*",
   		},
   		mainnet: {
   			provider: () =>
   				new HDWalletProvider(
   					process.env.MNEMONIC,
   					`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
   				),
   			network_id: 1,
   		},
   		ropsten: {
   			provider: () =>
   				new HDWalletProvider(
   					process.env.MNEMONIC,
   					`https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
   				),
   			network_id: 3,
   		},
   	},
   	compilers: {
   		solc: {
   			version: "0.8.19",
   			settings: {
   				optimizer: {
   					enabled: true,
   					runs: 200,
   				},
   			},
   		},
   	},
   	plugins: ["truffle-plugin-verify"],
   	api_keys: {
   		etherscan: process.env.ETHERSCAN_API_KEY,
   	},
   };
   ```

## Compiling Contracts

1. **Compile the contracts:**

   ```bash
   truffle compile
   ```

## Deploying Contracts

1. **Deploy to the development network:**

   Ensure that Ganache is running, and then deploy the contracts:

   ```bash
   truffle migrate --reset --network development
   ```

2. **Deploy to a public testnet or mainnet:**

   Configure your `.env` file for Infura and deploy:

   ```bash
   truffle migrate --network ropsten
   ```

   or

   ```bash
   truffle migrate --network mainnet
   ```

## Testing the Contracts

1. **Run the smart contract tests:**

   ```bash
   truffle test
   ```

   These tests will verify the minting of NFTs, bidding on the canvas, and ensuring that auctions work as expected.

   Example tests include:

   - **Minting and updating the canvas**
   - **Starting and interacting with the auction**
   - **Bid placement and refunds**
   - **Withdrawing funds as the owner**

## Running the Frontend

1. **Start the React development server:**

   ```bash
   cd client
   npm start
   ```

2. **Open your browser:**

   Navigate to `http://localhost:3000` to interact with the DApp.

## Smart Contract Overview

### Choice Contract

- The **Choice** contract handles the minting of NFTs.
- Each mint requires **1 ETH**.
- The contract allows the owner to **withdraw funds**.
- NFTs minted contribute pixels to the shared canvas by interacting with the **CanvasContract**.

### Canvas Contract

- The **CanvasContract** stores the pixels contributed by NFTs.
- It runs an **auction** after all NFTs are minted, allowing users to place bids on the full canvas.
- Events such as **AuctionStarted**, **BidPlaced**, and **AuctionEnded** are emitted to track the auction’s progress.
- Like the **Choice** contract, the owner can also **withdraw funds** from this contract.

## Frontend TODO

To complete the project, the following frontend tasks need to be implemented:

1. **Minting Page**:

   - Create a page where users can connect their wallets and mint a token by paying 1 ETH.
   - Display the 8x5 grid for input and render the preview before minting.

2. **Canvas Page**:

   - Display the canvas with all the collected pixels from the minted NFTs.
   - Add real-time updates to show new pixels when a token is minted.

3. **Auction Page**:

   - Create a page for users to place bids on the canvas.
   - Show the highest bidder and their bid amount.
   - Implement countdown functionality for the auction ending time.

4. **Event Listeners**:

   - Listen to events emitted by the contracts (e.g., `AuctionStarted`, `BidPlaced`, `AuctionEnded`) and update the UI accordingly.

5. **Withdraw Functionality**:

   - Allow the contract owner to withdraw funds from both the **Choice** and **CanvasContract** through the frontend.

6. **Wallet Integration**:

   - Ensure MetaMask or other Ethereum wallets can connect seamlessly to the frontend.

7. **Deployment**:
   - Deploy the frontend to a platform like Vercel, Netlify, or GitHub Pages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries, please contact:steve@saphirelabs.com
