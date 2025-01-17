import type { Image } from "./image.types";

export interface GameStartPayload {
	image: Image;
	size: {
		horizontal: number;
		vertical: number;
	};
}
