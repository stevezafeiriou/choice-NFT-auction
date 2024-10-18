import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@rainbow-me/rainbowkit/styles.css";
import {
	getDefaultConfig,
	lightTheme,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

/* 

By default, your dApp uses public RPC providers for each chain to fetch balances, 
resolve ENS names, and more. This can often cause reliability issues for your users 
as public nodes are rate-limited. You should instead purchase access to an RPC 
provider through services like Alchemy or QuickNode, and define your own 
Transports in Wagmi. This can be achieved by adding the transports param 
in getDefaultConfig or via Wagmi's createConfig directly.

A Transport is the networking middle layer that handles sending 
JSON-RPC requests to the Ethereum Node Provider (like Alchemy, Infura, etc).

const config = getDefaultConfig({
  chains: [
    {
      ...mainnet,
      iconBackground: '#000',
      iconUrl: 'https://example.com/icons/ethereum.png',
    },
    {
      ...optimism,
      iconBackground: '#ff0000',
      iconUrl: 'https://example.com/icons/optimism.png',
    },
  ],
});

*/

const config = getDefaultConfig({
	appName: "Test App",
	projectId: "project_id",
	chains: [mainnet, localhost],
	ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<App />
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>
);
