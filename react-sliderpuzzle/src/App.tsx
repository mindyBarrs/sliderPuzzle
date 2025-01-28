import React, { useState } from "react";

import PuzzleBoard from "components/Puzzle/PuzzleBoard";

import StartPanel from "feature/startPanel";

import type { GameStartPayload } from "utils/types/game.types";
import type { Image, Size } from "utils/types/image.types";

import "./utils/theme/base.scss";

const App: React.FC = () => {
	const [playing, setPlaying] = useState(false);

	const [image, setImage] = useState<Image | null>(null);
	const [size, setSize] = useState<Size | null>(null);

	const createPuzzle = (payload: GameStartPayload) => {
		setImage(payload.image);
		setSize(payload.size);
		setPlaying(true);
	};

	return (
		<>
			<h1>Slide Puzzle</h1>

			{playing ? (
				<PuzzleBoard
					size={size || { horizontal: 0, vertical: 0 }}
					image={
						image || {
							id: "",
							alt_description: "",
							urls: {
								small: "",
							},
						}
					}
					setImage={setImage}
				/>
			) : (
				<StartPanel onGameStart={createPuzzle} />
			)}
		</>
	);
};

export default App;
