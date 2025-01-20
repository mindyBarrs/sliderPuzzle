import React from "react";
import { ButtonProps } from "utils/types/component.types";

const Button: React.FC<ButtonProps> = ({ id, label, onClick }) => {
	return (
		<button id={id} onClick={() => onClick}>
			{label}
		</button>
	);
};

export default Button;
