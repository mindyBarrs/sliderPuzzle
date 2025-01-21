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
const searchImages = async (term: string): Promise<Image[]> => {
	const response = await axios.post<{ results: Image[] }>(API_SEARCH_URL, {
		term,
	});

	return response.data.results;
};

// Custom hook for random image
export const useRandomImage = () => {
	return useQuery<Image, Error>({
		queryKey: ["randomImage"],
		queryFn: fetchRandomImage,
		enabled: false,
	});
};

// Custom hook for searching images
export const useSearchImages = () => {
	const queryClient = useQueryClient();

	return useMutation<Image[], Error, string>({
		mutationFn: searchImages,
		onSuccess: (data, term) => {
			// Optionally update cached data or invalidate related queries
			queryClient.setQueryData(["searchedImages", term], data);
		},
	});
};
