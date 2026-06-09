const API_KEY = "dcea1fd7b3e65d34387ad6de7ef9cc5e";
const BASE = "https://api.themoviedb.org/3";

export const API = {
  top: `${BASE}/movie/top_rated?api_key=${API_KEY}`,
  popular: `${BASE}/movie/popular?api_key=${API_KEY}`,
  upcoming: `${BASE}/movie/upcoming?api_key=${API_KEY}`,
  trending: `${BASE}/trending/movie/week?api_key=${API_KEY}`,
  nowPlaying: `${BASE}/movie/now_playing?api_key=${API_KEY}`,
  search: (query, page = 1) =>
    `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
  detail: (id) =>
    `${BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,similar,keywords`,
  genres: `${BASE}/genre/movie/list?api_key=${API_KEY}`,
  byGenre: (genreId, page = 1) =>
    `${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
  imgBase: "https://image.tmdb.org/t/p/",
  img: (path, size = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
};
