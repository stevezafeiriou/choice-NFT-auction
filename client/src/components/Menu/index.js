import React from "react";
import { Link } from "react-router-dom";
import { NavMenu } from "./MenuElements";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Menu = () => {
	return (
		<NavMenu>
			{/* <Link to="/" style={styles.link}>
				Home
			</Link> */}
			<ConnectButton
				chainStatus="none"
				accountStatus={{
					smallScreen: "avatar",
					largeScreen: "full",
				}}
				showBalance={{
					smallScreen: false,
					largeScreen: true,
				}}
			/>
			{/* Add more links as needed */}
		</NavMenu>
	);
};

export default Menu;
