import React from "react";

import { ButtonProps } from "utils/types/component.types";

import "./Button.scss";

const Button: React.FC<ButtonProps> = ({
	id,
	label,
	className,
	onClickHandler,
}) => {
	return (
		<button id={id} onClick={onClickHandler} className={className}>
			{label}
		</button>
	);
};

export default Button;
