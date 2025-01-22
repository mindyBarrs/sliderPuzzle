import React, { useEffect, useRef, useState } from "react";

import SearchBar from "components/SearchBar";

import { useSearchImages } from "queries/image.queries";

import type { Image } from "utils/types/image.types";
import type { ModalProps } from "utils/types/component.types";

import "./Modal.scss";

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onGameStart }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const targetRef = useRef<HTMLDivElement | null>(null);
	const closeModalBtnRef = useRef<HTMLButtonElement | null>(null);

	const { mutate: searchImage, data: searchImages, error } = useSearchImages();

	const handleSearch = () => {
		if (searchTerm.trim()) {
			searchImage(searchTerm);
		}
	};

	const handleOutsideClick = (e: MouseEvent) => {
		if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
			onClose();
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleOutsideClick);
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [isOpen]);

	const handleSelectImage = (image: Image) => {
		onGameStart({ image, size: { horizontal: 4, vertical: 4 } });
		onClose();
	};

	console.log(searchImages);

	if (!isOpen) return null;

	return (
		<div className="modal-mask">
			<div className="modal-wrapper">
				<div className="modal-container" ref={targetRef}>
					<div className="modal-header">
						<button onClick={onClose} ref={closeModalBtnRef}>
							X
						</button>
					</div>

					<div className="modal-body">
						<SearchBar
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							onClickHandler={handleSearch}
						/>

						{searchImages?.length === 0 && !error && <div>No images found</div>}
						{error && <div className="error">{error.message}</div>}

						{searchImages && searchImages.length > 0 && (
							<ul className="image-container">
								{searchImages.map((image: Image) => (
									<li
										key={image.id}
										className="image-item"
										onClick={() => handleSelectImage(image)}
									>
										<img alt={image.alt_description} src={image.urls.small} />
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="modal-footer"></div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
