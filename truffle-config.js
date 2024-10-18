const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1", // Localhost (default: none)
			port: 8545, // Ganache GUI default port
			network_id: "*", // Any network (default: none)
		},
		mainnet: {
			provider: () =>
				new HDWalletProvider({
					mnemonic: process.env.MNEMONIC,
					providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
					numberOfAddresses: 1,
					shareNonce: true,
				}),
			network_id: 1, // Mainnet's id
			gas: 5500000, // Gas limit - adjust as necessary
			gasPrice: 20000000000, // 20 gwei (adjust based on current network conditions)
			confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
		ropsten: {
			provider: () =>
				new HDWalletProvider({
					mnemonic: process.env.MNEMONIC,
					providerOrUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
					numberOfAddresses: 1,
					shareNonce: true,
				}),
			network_id: 3, // Ropsten's id
			gas: 5500000, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
	},

	// Set default mocha options here, use special reporters, etc.
	mocha: {
		// timeout: 100000
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.19", // Fetch exact version from solc-bin (default: truffle's version)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 200,
				},
			},
		},
	},

	// Plugins configuration
	plugins: ["truffle-plugin-verify"],

	// Save build artifacts to client/src/contracts
	contracts_build_directory: "./client/src/contracts",

	// API keys configuration
	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY,
	},

	// Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
	// Note: if you migrated your contracts prior to enabling this field in your project and want
	// those previously migrated contracts available in the .db directory, you will need to run
	// `truffle migrate --reset --compile-all`
	db: {
		enabled: false,
	},
};
