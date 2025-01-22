import type { Image, Size } from "utils/types/image.types";

export interface TileProps {
	styles: {
		background: string;
		backgroundPositionX: string;
		backgroundPositionY: string;
		width: string;
		height: string;
		order: number;
	};
	position: number;
	isEmpty: boolean;

	onMove?: (tile: TileProps) => void;
}

export interface PuzzleBoardProps {
	image: Image;
	size: Size;
}
