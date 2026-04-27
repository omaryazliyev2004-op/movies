import { useEffect, useRef, useState } from "react";
import { API } from "../api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [movieType, setMovieType] = useState("top_rated");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(() => +localStorage.getItem("title") || 1);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(9999);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    getMovies(movieType, page, search, min, max, score);
  }, [movieType, page, search, min, max, score]);

  async function getMovies(type, pg, searchVal, minY, maxY, sc) {
    setLoading(true);
    setMovies([]);

    let url;
    if (searchVal.length > 0) {
      url = API.search(searchVal, pg);
    } else {
      url =
        type === "top_rated"
          ? API.top
          : type === "popular"
          ? API.popular
          : API.upcoming;
      url += `&page=${pg}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      let results = data.results || [];

      results = results.filter((movie) => {
        const year = movie.release_date
          ? +movie.release_date.split("-")[0]
          : 0;
        return year >= minY && year <= maxY && movie.vote_average >= sc;
      });

      setMovies(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleBtnClick(type) {
    setMovieType(type);
    setPage(1);
    localStorage.setItem("title", 1);
  }

  function handleSearch(e) {
    const val = e.target.value;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearch(val.trim());
      setPage(1);
      localStorage.setItem("title", 1);
    }, 400);
  }

  function handleFilter(setter) {
    return (e) => {
      setter(+e.target.value || 0);
      setPage(1);
      localStorage.setItem("title", 1);
    };
  }

  function goNext() {
    const next = page + 1;
    setPage(next);
    localStorage.setItem("title", next);
  }

  function goPrev() {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      localStorage.setItem("title", prev);
    }
  }

  return (
    <div className="container">

      <div style={{ marginBottom: "20px" }}>
        <button className="btns" value="top_rated" onClick={() => handleBtnClick("top_rated")}>Top Rated</button>
        <button className="btns" value="popular" onClick={() => handleBtnClick("popular")}>Popular</button>
        <button className="btns" value="upcoming" onClick={() => handleBtnClick("upcoming")}>Upcoming</button>
      </div>

      <div className="fl" style={{ marginBottom: "20px" }}>
        <input id="search" placeholder="search" onChange={handleSearch} />
        <input id="min" type="number" placeholder="min year" onChange={handleFilter(setMin)} />
        <input id="max" type="number" placeholder="max year" onChange={handleFilter(setMax)} />
        <input id="score" type="number" placeholder="score" onChange={handleFilter(setScore)} />
      </div>

      <div className="append">
        {loading ? (
          <h2 style={{ color: "orange" }}>Loading...</h2>
        ) : movies.length === 0 ? (
          <h2 style={{ color: "orange" }}>Hech narsa topilmadi</h2>
        ) : (
          movies.map((movie) => (
            <div className="movie" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className="orange">{movie.vote_average}</span>
              </div>
              <span className="date">{movie.release_date}</span>
            </div>
          ))
        )}
      </div>

      <div className="pn">
        <button className="prev" disabled={page === 1} onClick={goPrev}>prev</button>
        <span className="title">{page}</span>
        <button className="next" onClick={goNext}>next</button>
      </div>

    </div>
  );
}
