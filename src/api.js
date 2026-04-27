const API_KEY = "dcea1fd7b3e65d34387ad6de7ef9cc5e";

export const API = {
  top: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
  popular: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
  upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`,
  search: (query, page) =>
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`,
};
