import React, { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";

import { useRandomImage } from "queries/image.queries";

import type { GameStartPayload } from "utils/types/game.types";
import type { Size } from "utils/types/image.types";

import "./startPanel.scss";
import MonkImage from "assets/monks.jpg";

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
					size,
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
			<Button
				id="randomStart"
				onClickHandler={createPuzzle}
				label="Create Puzzle with Random Image"
				className="startGame"
			/>
			<Button
				id="searchStart"
				onClickHandler={openModal}
				label="Search for image & Create Puzzle"
				className="startGame"
			/>

			<Modal
				isOpen={isModalOpened}
				onClose={closeModal}
				onGameStart={selectImage}
			/>
		</div>
	);
};

export default OptionsForm;
