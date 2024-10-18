// src/components/HomeElements.js
import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f0f2f5;
`;

export const Card = styled.div`
	background: white;
	padding: 2rem;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	text-align: center;
	max-width: 400px;
	width: 100%;

	h2 {
		font-size: 1.1rem;
		margin: 10px 0;
	}
	p {
		font-size: 1rem;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 0.75rem;
	margin: 1rem 0;
	border-radius: 12px;
	border: 1px solid #ccc;
`;

export const Button = styled.button`
	width: 100%;
	padding: 0.75rem;
	border: none;
	border-radius: 12px;
	background-color: #007bff;
	color: white;
	font-size: 1rem;
	transition: all 0.2s ease-in-out;
	cursor: pointer;
	&:hover {
		background-color: #0056b3;
	}
`;

export const Message = styled.p`
	margin: 1rem 0;
`;
