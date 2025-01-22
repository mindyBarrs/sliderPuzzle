import React, { useRef, useState } from "react";

import { useSearchImages } from "queries/image.queries";

interface SearchBarProps {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	onClickHandler: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	searchTerm,
	setSearchTerm,
	onClickHandler,
}) => {
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const searchBtnRef = useRef<HTMLButtonElement | null>(null);

	// const { mutate: searchImage } = useSearchImages();

	return (
		<div>
			<label htmlFor="search">Search for an image</label>

			<div className="search-wrapper">
				<input
					id="search"
					type="text"
					placeholder="Search"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					ref={searchInputRef}
				/>

				<button onClick={onClickHandler} ref={searchBtnRef}>
					Search
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
