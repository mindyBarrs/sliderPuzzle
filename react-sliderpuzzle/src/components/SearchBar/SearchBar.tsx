import React, { useRef, useState } from "react";

import { useSearchImages } from "queries/image.queries";

const SearchBar: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const searchBtnRef = useRef<HTMLButtonElement | null>(null);

	const { mutate: searchImage } = useSearchImages();

	const handleSearch = () => {
		if (searchTerm.trim()) {
			searchImage(searchTerm);
		}
	};

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

				<button onClick={handleSearch} ref={searchBtnRef}>
					Search
				</button>
			</div>
		</div>
	);
};

export default SearchBar;
