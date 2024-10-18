import styled from "styled-components";

export const HeaderContainer = styled.header`
	display: flex;

	justify-content: space-between;
	align-items: center;
	padding: 20px 60px;

	@media screen and (max-width: 768px) {
		padding: 20px 30px;
	}
`;

export const Logo = styled.div`
	font-size: 1.1rem;
	font-weight: 600;

	@media screen and (max-width: 768px) {
		max-width: 50%;
		font-size: 1rem;
	}
`;
