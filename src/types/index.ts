export type Movie = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type TVShow = {
	adult: boolean;
	backdrop_path: string;
	created_by: {
		id: number;
		credit_id: string;
		name: string;
		gender: number;
		profile_path: string;
	}[];
	episode_run_time: number[];
	first_air_date: string;
	genres: Genre[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: Episode;
	name: string;
	next_episode_to_air: string;
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: {
		id: number;
		logo_path: string;
		name: string;
		origin_country: string;
	};
	seasons: Season[];
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	};
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
};

export type Episode = {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
};

export type Genre = {
	id: number;
	name: string;
};

export type Actor = {
	adult: boolean;
	biography: string;
	birthday: string;
	deathday: string;
	gender: number;
	homepage: string;
	id: number;
	imdb_id: string;
	known_for_department: string;
	name: string;
	place_of_birth: string;
	popularity: number;
	profile_path: string;
};

export type Network = {
	id: number;
	logo_path: string;
	name: string;
	origin_country: string;
};

export type Season = {
	air_date: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
};
