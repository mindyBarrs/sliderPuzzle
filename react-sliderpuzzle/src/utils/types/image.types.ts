export interface Image {
	id: string;
	alt_description: string;
	urls: { small: string };
}

export interface Size {
	horizontal: number;
	vertical: number;
}
