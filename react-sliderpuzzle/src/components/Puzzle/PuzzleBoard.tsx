import React, {
	useState,
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";

import PuzzleTile from "./PuzzleTile"; // Assuming Tile component is in the same directory

import type { Image } from "utils/types/image.types";

import "./PuzzleBoard.scss";

interface TileData {
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
}

interface BoardProps {
	image: Image;
	size: { horizontal: number; vertical: number };
	onRestart: () => void;
}

interface PuzzleArgs {
	image: Image;
	size: {
		horizontal: number;
		vertical: number;
	};
}

export interface PuzzleBoardRef {
	createPuzzle: (args: PuzzleArgs) => void;
}

const PuzzleBoard = forwardRef<PuzzleBoardRef, BoardProps>(
	({ image, size, onRestart }, ref) => {
		const [tiles, setTiles] = useState<TileData[]>([]);
		const [tileSize, setTileSize] = useState({ width: 0, height: 0 });
		const [isSolved, setIsSolved] = useState(false);

		const frameRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(ref, () => ({
			createPuzzle,
		}));

		useEffect(() => {
			createPuzzle({ image, size });
		}, [image, size]);

		const createPuzzle = ({ image, size }: PuzzleArgs) => {
			const img = new Image();

			img.onload = () => {
				const tileWidth = Math.floor(img.width / size.horizontal);
				const tileHeight = Math.floor(img.height / size.vertical);

				setTileSize({ width: tileWidth, height: tileHeight });
				generateTiles(tileWidth, tileHeight);
			};
			img.src = image.urls.small;
		};

		const generateTiles = (tileWidth: number, tileHeight: number) => {
			console.log("Hello", tileWidth, tileHeight);

			const newTiles = Array.from(
				{ length: size.horizontal * size.vertical },
				(_, i) => ({
					styles: {
						background: i === 0 ? "transparent" : `url(${image.urls.small})`,
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

		const shuffleTiles = (tiles: TileData[]) => {
			console.log("hery there", tiles);
			const shuffledTiles = [...tiles];
			for (let i = 0; i < shuffledTiles.length * 5; i++) {
				const emptyTile = shuffledTiles.find((t) => t.isEmpty);
				const adjacentTiles = getAdjacentTiles(emptyTile!, shuffledTiles);
				const randomTile =
					adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
				switchTiles(emptyTile!, randomTile);
			}
			setTiles(shuffledTiles);
		};

		const moveTile = (tile: TileData) => {
			const emptyTile = tiles.find((t) => t.isEmpty);
			if (emptyTile && getAdjacentTiles(tile, tiles).includes(emptyTile)) {
				const updatedTiles = [...tiles];
				switchTiles(emptyTile, tile);
				setTiles(updatedTiles);
				checkIfSolved(updatedTiles);
			}
		};

		const switchTiles = (tileA: TileData, tileB: TileData) => {
			[tileA.styles.order, tileB.styles.order] = [
				tileB.styles.order,
				tileA.styles.order,
			];
		};

		const getAdjacentTiles = (tile: TileData, tiles: TileData[]) => {
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

		const checkIfSolved = (tiles: TileData[]) => {
			setIsSolved(tiles.every((tile) => tile.styles.order === tile.position));
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
						<img src={image.urls.small} alt={image.alt_description} />
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
	}
);

export default PuzzleBoard;
