import React, { useState, useEffect } from "react";

import PuzzleTile from "./PuzzleTile";
import Button from "components/Button";

import { useRandomImage } from "queries/image.queries";

import type { Image } from "utils/types/image.types";
import type {
	TileProps,
	PuzzleBoardProps,
} from "utils/types/puzzleboard.types";

import MonkImage from "assets/monks.jpg";
import "./PuzzleBoard.scss";

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ image, size, setImage }) => {
	const [tiles, setTiles] = useState<TileProps[]>([]);
	const [tileSize, setTileSize] = useState({ width: 0, height: 0 });
	const [isSolved, setIsSolved] = useState(false);

	const { data: randomImage, refetch: getRandomImage } = useRandomImage();

	useEffect(() => {
		createPuzzle({ image, size, setImage });
	}, [image, size]);

	const createPuzzle = ({ image, size }: PuzzleBoardProps) => {
		const img = new Image();

		img.onload = () => {
			const tileWidth = Math.floor(img.width / size.horizontal);
			const tileHeight = Math.floor(img.height / size.vertical);

			setTileSize({ width: tileWidth, height: tileHeight });
			generateTiles(tileWidth, tileHeight, image);
		};

		img.src = image?.urls?.small;
	};

	const generateTiles = (
		tileWidth: number,
		tileHeight: number,
		image: Image
	) => {
		const newTiles = Array.from(
			{ length: size.horizontal * size.vertical },
			(_, i) => ({
				styles: {
					backgroundImage:
						i === 0 ? "transparent" : `url(${image?.urls?.small})`,
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
		const tempOrder = tileA.styles.order;

		tileA.styles = {
			...tileA.styles, // Copy other styles
			order: tileB.styles.order, // Assign the new 'order'
		};

		tileB.styles = {
			...tileB.styles, // Copy other styles
			order: tempOrder, // Assign the swapped 'order'
		};
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
				setImage(randomImage);
			} else {
				throw new Error("No image found");
			}
		} catch (error) {
			console.error("Failed to get random image:", error);
			setImage(MonkImage);
		}
	};

	return (
		<main className="board">
			<div className="puzzle-board">
				<div
					className="frame-wrapper"
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
				<Button
					id="resuffle"
					className="shuffle"
					label="Reshuffle Puzzle"
					onClickHandler={() => shuffleTiles(tiles)}
				/>
				<Button
					id="newGame"
					className="restart"
					label="New Game"
					onClickHandler={onRestart}
				/>
			</div>
		</main>
	);
};

export default PuzzleBoard;
