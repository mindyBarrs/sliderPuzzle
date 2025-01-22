import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_RANDOM_URL, API_SEARCH_URL } from "utils/constants/url.constants";
import { Image } from "utils/types/image.types";

// Fetch a random image
const fetchRandomImage = async (): Promise<Image> => {
	const response = await axios.get<Image>(API_RANDOM_URL);

	const transformedData: Image = {
		id: response.data.id,
		alt_description:
			response.data.alt_description || "No description available",
		urls: {
			small: response.data.urls.small,
		},
	};

	return transformedData;
};

// Search images by term
interface SearchResponse {
	results: Image[];
}

const searchImages = async (term: string): Promise<Image[]> => {
	const response = await axios.post<SearchResponse>(API_SEARCH_URL, {
		term,
	});

	const transformedData: Image[] = response.data.results.map((image) => ({
		id: image.id,
		alt_description: image.alt_description || "No description available",
		urls: {
			small: image.urls.small,
		},
	}));

	return transformedData;
};

// Custom hook for random image
export const useRandomImage = () => {
	return useQuery<Image, Error>({
		retry: false,
		queryKey: ["randomImage"],
		queryFn: fetchRandomImage,
	});
};

// Custom hook for searching images
export const useSearchImages = () => {
	const queryClient = useQueryClient();

	return useMutation<Image[], Error, string>({
		mutationFn: searchImages,
		onSuccess: (data, term) => {
			// Optionally update cached data or invalidate related queries
			queryClient.setQueryData(["searchImages", term], data);
		},
	});
};
