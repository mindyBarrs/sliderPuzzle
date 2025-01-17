import React, { useState } from "react";

import Modal from "components/Modal"; // Import your React version of SearchModal

import { useRandomImage } from "queries/image.queries";

import type { GameStartPayload } from "utils/types/game.types";

import MonkImage from "assets/monks.jpg"; // Ensure the correct path and filename

interface Size {
	horizontal: number;
	vertical: number;
}

interface OptionsFormProps {
	onGameStart: (payload: GameStartPayload) => void;
}

const OptionsForm: React.FC<OptionsFormProps> = ({ onGameStart }) => {
	const [isModalOpened, setIsModalOpened] = useState(false);

	const { data: randomImage, refetch: getRandomImage } = useRandomImage();

	const size: Size = {
		horizontal: 4,
		vertical: 4,
	};

	const openModal = () => {
		setIsModalOpened(true);
	};

	const closeModal = () => {
		setIsModalOpened(false);
	};

	const createPuzzle = async () => {
		try {
			await getRandomImage();

			if (randomImage) {
				onGameStart({
					image: randomImage,
					size: {
						horizontal: 4,
						vertical: 4,
					},
				});
			} else {
				throw new Error("No image found");
			}
		} catch (error) {
			console.error("Failed to get random image:", error);
			onGameStart({ image: MonkImage, size });
		}
	};

	const selectImage = (payload: GameStartPayload) => {
		onGameStart(payload);
	};

	return (
		<div id="optionsForm">
			<button onClick={createPuzzle}>Create Puzzle with Random Image</button>
			<button type="button" onClick={openModal}>
				Search for image & Create Puzzle
			</button>

			<Modal
				isOpen={isModalOpened}
				onClose={closeModal}
				onGameStart={selectImage}
			/>
		</div>
	);
};

export default OptionsForm;
