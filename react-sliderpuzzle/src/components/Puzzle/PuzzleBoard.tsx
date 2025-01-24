import React, { useState, useEffect, useRef } from "react";

import PuzzleTile from "./PuzzleTile";

import { useRandomImage } from "queries/image.queries";

import type {
	TileProps,
	PuzzleBoardProps,
} from "utils/types/puzzleboard.types";

import MonkImage from "assets/monks.jpg";
import "./PuzzleBoard.scss";

// export interface PuzzleBoardRef {
// 	createPuzzle: (args: PuzzleBoardProps) => void;
// }

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ image, size }) => {
	const [tiles, setTiles] = useState<TileProps[]>([]);
	const [tileSize, setTileSize] = useState({ width: 0, height: 0 });
	const [isSolved, setIsSolved] = useState(false);

	const frameRef = useRef<HTMLDivElement>(null);

	const { data: randomImage, refetch: getRandomImage } = useRandomImage();

	useEffect(() => {
		createPuzzle({ image, size });
	}, [image, size]);

	const createPuzzle = ({ image, size }: PuzzleBoardProps) => {
		const img = new Image();

		img.onload = () => {
			const tileWidth = Math.floor(img.width / size.horizontal);
			const tileHeight = Math.floor(img.height / size.vertical);

			setTileSize({ width: tileWidth, height: tileHeight });
			generateTiles(tileWidth, tileHeight);
		};
		img.src = image?.urls?.small;
	};

	const generateTiles = (tileWidth: number, tileHeight: number) => {
		const newTiles = Array.from(
			{ length: size.horizontal * size.vertical },
			(_, i) => ({
				styles: {
					background: i === 0 ? "transparent" : `url(${image?.urls?.small})`,
					backgroundPositionX: `-${(i % size.horizontal) * tileWidth}px`,
					backgroundPositionY: `-${
						Math.floor(i / size.horizontal) * tileHeight
					}px`,
					width: `${tileWidth}px`,
					height: `${tileHeight}px`,
					order: i,
				},
				position: i,
				isEmpty: i === 0,
			})
		);

		setTiles(newTiles);
		shuffleTiles(newTiles);
	};

	const shuffleTiles = (tiles: TileProps[]) => {
		const shuffledTiles = [...tiles];

		for (let i = 0; i < shuffledTiles.length * 5; i++) {
			const emptyTile = shuffledTiles.find((t) => t?.isEmpty);
			const adjacentTiles = getAdjacentTiles(emptyTile!, shuffledTiles);
			const randomTile =
				adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
			switchTiles(emptyTile!, randomTile);
		}
		setTiles(shuffledTiles);
	};

	const moveTile = (tile: TileProps) => {
		const emptyTile = tiles.find((t) => t?.isEmpty);
		if (emptyTile && getAdjacentTiles(tile, tiles).includes(emptyTile)) {
			const updatedTiles = [...tiles];
			switchTiles(emptyTile, tile);
			setTiles(updatedTiles);
			checkIfSolved(updatedTiles);
		}
	};

	const switchTiles = (tileA: TileProps, tileB: TileProps) => {
		[tileA.styles.order, tileB.styles.order] = [
			tileB.styles.order,
			tileA.styles.order,
		];
	};

	const getAdjacentTiles = (tile: TileProps, tiles: TileProps[]) => {
		const pos = tile.styles.order;
		return tiles.filter((t) =>
			[
				pos % size.horizontal ? pos - 1 : null,
				(pos + 1) % size.horizontal ? pos + 1 : null,
				pos - size.horizontal,
				pos + size.horizontal,
			].includes(t.styles.order)
		);
	};

	const checkIfSolved = (tiles: TileProps[]) => {
		setIsSolved(tiles.every((tile) => tile.styles.order === tile.position));
	};

	const onRestart = async () => {
		try {
			await getRandomImage();

			if (randomImage) {
				createPuzzle({
					image: randomImage,
					size,
				});
			} else {
				throw new Error("No image found");
			}
		} catch (error) {
			console.error("Failed to get random image:", error);
			createPuzzle({ image: MonkImage, size });
		}
	};

	return (
		<main className="board">
			<div className="puzzle-board">
				<div
					className="frame-wrapper"
					ref={frameRef}
					style={{
						width: `${tileSize.width * size.horizontal}px`,
						height: `${tileSize.height * size.vertical}px`,
					}}
				>
					{isSolved && <h2 className="win">You Win!</h2>}

					<div className="frame">
						{tiles.map((tile) => (
							<PuzzleTile key={tile.position} tile={tile} onMove={moveTile} />
						))}
					</div>
				</div>

				<div className="preview">
					<h3>Image Preview</h3>
					<img src={image?.urls?.small} alt={image?.alt_description} />
				</div>
			</div>

			<div className="controls">
				<button
					type="button"
					className="shuffle"
					onClick={() => shuffleTiles(tiles)}
				>
					Reshuffle Puzzle
				</button>

				<button type="button" className="restart" onClick={onRestart}>
					New Game
				</button>
			</div>
		</main>
	);
};

export default PuzzleBoard;
