import React from "react";

interface TileProps {
	tile: {
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
	};
	onMove: (tile: TileProps["tile"]) => void;
}

const PuzzleTile: React.FC<TileProps> = ({ tile, onMove }) => {
	const handleMove = () => {
		if (!tile.isEmpty) {
			onMove(tile);
		}
	};

	return (
		<div
			className={`tile ${tile.isEmpty ? "empty" : ""}`}
			style={tile.styles}
			onClick={handleMove}
		></div>
	);
};

export default PuzzleTile;
