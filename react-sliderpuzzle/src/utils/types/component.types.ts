import { Image, Size } from "utils/types/image.types";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onGameStart: (payload: { image: Image; size: Size }) => void;
}

export interface ButtonProps {
	id: string;
	label: string;
	className: string;
	onClickHandler: () => void;
}
