import React from "react";

import type { TileProps } from "utils/types/puzzleboard.types";

interface PuzzleTileProps {
	tile: TileProps;
	onMove?: (tile: TileProps) => void;
}

const PuzzleTile: React.FC<PuzzleTileProps> = ({ tile, onMove }) => {
	const handleMove = () => {
		if (!tile.isEmpty) {
			onMove?.(tile);
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
