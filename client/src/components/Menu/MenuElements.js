import styled from "styled-components";

export const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px 15px;
	margin: 0 5px;
	border: 1px solid #ddd;
	color: #1b1d1c;
	border-radius: 12px;
	background-color: #ddd;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.25s ease-in-out;

	&:hover {
		color: #1b1d1c;
		background-color: transparent;
	}
`;

export const NavMenu = styled.nav`
	display: flex;
	gap: 10px;

	a {
		text-decoration: none;
		color: #1b1d1c;
	}
`;

export const UserImage = styled.img`
	width: 32px;
	height: 32px;
	margin-right: 10px;
	border-radius: 50%;
`;
