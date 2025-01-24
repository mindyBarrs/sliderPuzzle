import React from "react";

import { SearchBarProps } from "utils/types/component.types";

import "./SearchBar.scss";

const SearchBar: React.FC<SearchBarProps> = ({
	searchTerm,
	setSearchTerm,
	onClickHandler,
}) => {
	return (
		<div>
			<label htmlFor="search">Search for an image</label>

			<div className="search-wrapper">
				<input
					id="search"
					type="text"
					placeholder="Search for an image"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				<button onClick={onClickHandler}>Search</button>
			</div>
		</div>
	);
};

export default SearchBar;
