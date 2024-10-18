import React from "react";
import Menu from "../Menu";
import { HeaderContainer, Logo } from "./HeaderElements";

const Header = () => {
	return (
		<HeaderContainer>
			<Logo>[Saphire Labs] NFT Collection Template</Logo>
			<Menu />
		</HeaderContainer>
	);
};

export default Header;
