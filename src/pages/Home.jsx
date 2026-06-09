import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box, Container, Grid, Typography, TextField, InputAdornment,
  ToggleButton, ToggleButtonGroup, Select, MenuItem, FormControl,
  Slider, Chip, Stack, Collapse, Button, Pagination,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  TuneRounded,
  WhatshotRounded,
  Star as StarIcon,
  UpcomingOutlined,
  TrendingUp,
  ClearAll,
} from "@mui/icons-material";
import { API } from "../api";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import HeroSection from "../components/HeroSection";

const TABS = [
  { value: "popular", label: "Popular", icon: <WhatshotRounded sx={{ fontSize: 16 }} /> },
  { value: "top_rated", label: "Top Rated", icon: <StarIcon sx={{ fontSize: 16 }} /> },
  { value: "upcoming", label: "Upcoming", icon: <UpcomingOutlined sx={{ fontSize: 16 }} /> },
  { value: "trending", label: "Trending", icon: <TrendingUp sx={{ fontSize: 16 }} /> },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "rating_desc", label: "Rating ↓" },
  { value: "rating_asc", label: "Rating ↑" },
  { value: "year_desc", label: "Newest First" },
  { value: "year_asc", label: "Oldest First" },
  { value: "title_asc", label: "Title A-Z" },
];

function sortMovies(movies, sort) {
  const arr = [...movies];
  switch (sort) {
    case "rating_desc": return arr.sort((a, b) => b.vote_average - a.vote_average);
    case "rating_asc":  return arr.sort((a, b) => a.vote_average - b.vote_average);
    case "year_desc":   return arr.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
    case "year_asc":    return arr.sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));
    case "title_asc":   return arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    default:            return arr;
  }
}

export default function Home({ currentTab, onTabChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()]);
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const searchTimer = useRef(null);
  const topRef = useRef(null);

  // Load genres once
  useEffect(() => {
    fetch(API.genres)
      .then((r) => r.json())
      .then((d) => setGenres(d.genres || []))
      .catch(() => {});
  }, []);

  // Sync search from URL
  useEffect(() => {
    const s = searchParams.get("search") || "";
    if (s !== search) {
      setSearch(s);
      setSearchInput(s);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setMovies([]);
    try {
      let url;
      if (search.trim()) {
        url = API.search(search.trim(), page);
      } else if (selectedGenre) {
        url = API.byGenre(selectedGenre, page);
      } else {
        const map = {
          top_rated: API.top,
          popular: API.popular,
          upcoming: API.upcoming,
          trending: API.trending,
        };
        url = (map[currentTab] || API.popular) + `&page=${page}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      let results = data.results || [];

      // Filter by year and score
      results = results.filter((m) => {
        const y = m.release_date ? +m.release_date.split("-")[0] : 0;
        return (
          y >= yearRange[0] &&
          y <= yearRange[1] &&
          m.vote_average >= minScore
        );
      });

      setMovies(sortMovies(results, sort));
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setTotalResults(data.total_results || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentTab, page, search, selectedGenre, yearRange, minScore, sort]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Scroll to top on page change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val.trim());
      setPage(1);
      if (val.trim()) {
        setSearchParams({ search: val.trim() });
      } else {
        setSearchParams({});
      }
    }, 450);
  }

  function handleTabChange(_, newVal) {
    if (!newVal) return;
    onTabChange(newVal);
    setPage(1);
    setSelectedGenre("");
    setSearch("");
    setSearchInput("");
    setSearchParams({});
  }

  function handleGenreClick(gId) {
    setSelectedGenre(gId === selectedGenre ? "" : gId);
    setPage(1);
    setSearch("");
    setSearchInput("");
    setSearchParams({});
  }

  function clearFilters() {
    setYearRange([1990, new Date().getFullYear()]);
    setMinScore(0);
    setSort("default");
    setSelectedGenre("");
    setSearch("");
    setSearchInput("");
    setPage(1);
    setSearchParams({});
  }

  const hasActiveFilters =
    selectedGenre ||
    search ||
    minScore > 0 ||
    yearRange[0] !== 1990 ||
    yearRange[1] !== new Date().getFullYear() ||
    sort !== "default";

  const skeletons = Array.from({ length: 12 });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      {/* Hero */}
      {!search && !selectedGenre && page === 1 && <HeroSection />}

      <Box ref={topRef} />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
        {/* ── Top Controls ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
            mb: 3,
          }}
        >
          {/* Search */}
          <TextField
            id="movie-search"
            placeholder="Search for movies…"
            value={searchInput}
            onChange={handleSearchChange}
            size="small"
            sx={{ flex: { md: "0 0 320px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Tab selector */}
          <ToggleButtonGroup
            value={currentTab}
            exclusive
            onChange={handleTabChange}
            size="small"
            sx={{
              flexWrap: "wrap",
              gap: 0.5,
              "& .MuiToggleButtonGroup-grouped": {
                border: "1px solid rgba(255,255,255,0.1) !important",
                borderRadius: "10px !important",
                px: 1.8,
                py: 0.7,
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "text.secondary",
                transition: "all 0.2s",
                "&.Mui-selected": {
                  backgroundColor: alpha("#6c8fff", 0.18),
                  color: "#6c8fff",
                  borderColor: "rgba(108,143,255,0.35) !important",
                },
                "&:hover": {
                  backgroundColor: alpha("#6c8fff", 0.08),
                  color: "#fff",
                },
              },
            }}
          >
            {TABS.map((t) => (
              <ToggleButton key={t.value} value={t.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {t.icon} {t.label}
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box sx={{ flex: 1 }} />

          {/* Sort + Filter toggle */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                displayEmpty
                sx={{ fontSize: "0.85rem" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value} sx={{ fontSize: "0.85rem" }}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant={filtersOpen ? "contained" : "outlined"}
              startIcon={<TuneRounded />}
              onClick={() => setFiltersOpen((p) => !p)}
              size="small"
              sx={{
                borderColor: "rgba(255,255,255,0.15)",
                color: filtersOpen ? "#fff" : "text.secondary",
                fontSize: "0.82rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Filters {hasActiveFilters && "•"}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="text"
                size="small"
                onClick={clearFilters}
                startIcon={<ClearAll />}
                sx={{ color: "#ff6b6b", fontSize: "0.8rem", fontWeight: 600 }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {/* ── Collapsible filters panel ── */}
        <Collapse in={filtersOpen}>
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Grid container spacing={4} alignItems="flex-start">
              {/* Year range */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography fontSize="0.8rem" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing="0.08em">
                  Year Range
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={yearRange}
                    onChange={(_, v) => { setYearRange(v); setPage(1); }}
                    min={1900}
                    max={new Date().getFullYear()}
                    valueLabelDisplay="auto"
                    sx={{
                      color: "#6c8fff",
                      "& .MuiSlider-thumb": {
                        width: 16, height: 16,
                        "&:hover": { boxShadow: "0 0 0 8px rgba(108,143,255,0.16)" },
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography fontSize="0.78rem" color="text.secondary">{yearRange[0]}</Typography>
                    <Typography fontSize="0.78rem" color="text.secondary">{yearRange[1]}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Min score */}
              <Grid item xs={12} sm={6} md={4}>
                <Typography fontSize="0.8rem" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing="0.08em">
                  Minimum Rating: <Box component="span" sx={{ color: "#f5c518" }}>{minScore.toFixed(1)}</Box>
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={minScore}
                    onChange={(_, v) => { setMinScore(v); setPage(1); }}
                    min={0}
                    max={10}
                    step={0.5}
                    valueLabelDisplay="auto"
                    sx={{
                      color: "#f5c518",
                      "& .MuiSlider-thumb": {
                        width: 16, height: 16,
                        "&:hover": { boxShadow: "0 0 0 8px rgba(245,197,24,0.16)" },
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* ── Genre chips ── */}
        {genres.length > 0 && (
          <Box sx={{ mb: 3, overflowX: "auto", pb: 1 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "nowrap", minWidth: "max-content" }}>
              {genres.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  onClick={() => handleGenreClick(g.id)}
                  variant={selectedGenre === g.id ? "filled" : "outlined"}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    border: selectedGenre === g.id
                      ? "1px solid #6c8fff"
                      : "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: selectedGenre === g.id
                      ? alpha("#6c8fff", 0.2)
                      : "transparent",
                    color: selectedGenre === g.id ? "#6c8fff" : "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: alpha("#6c8fff", 0.1),
                      borderColor: "rgba(108,143,255,0.4)",
                      color: "#fff",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* ── Results info ── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography color="text.secondary" fontSize="0.85rem">
            {loading ? "Loading…" : search ? (
              <>Results for <Box component="span" sx={{ color: "#6c8fff", fontWeight: 700 }}>"{search}"</Box> — {totalResults.toLocaleString()} found</>
            ) : (
              <>{TABS.find((t) => t.value === currentTab)?.label} Movies</>
            )}
          </Typography>
          {!loading && movies.length > 0 && (
            <Typography color="text.disabled" fontSize="0.8rem">
              Page {page} of {totalPages}
            </Typography>
          )}
        </Box>

        {/* ── Movie Grid ── */}
        <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
          {loading
            ? skeletons.map((_, i) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={i}>
                  <SkeletonCard />
                </Grid>
              ))
            : movies.length === 0
            ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: "center", py: 10,
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Typography fontSize="4rem" mb={2}>🎬</Typography>
                  <Typography variant="h5" fontWeight={700} color="text.secondary" mb={1}>
                    No Movies Found
                  </Typography>
                  <Typography color="text.disabled" fontSize="0.9rem">
                    Try adjusting your search or filters
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
                      variant="outlined"
                      sx={{ mt: 2, borderColor: "rgba(255,255,255,0.15)" }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>
              </Grid>
            )
            : movies.map((movie, i) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
                <MovieCard movie={movie} index={i} />
              </Grid>
            ))
          }
        </Grid>

        {/* ── Pagination ── */}
        {!loading && movies.length > 0 && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              shape="rounded"
              size="medium"
              siblingCount={0}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "text.secondary",
                  borderColor: "rgba(255,255,255,0.1)",
                  fontWeight: 600,
                  borderRadius: "10px",
                  "&.Mui-selected": {
                    backgroundColor: "#6c8fff",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(108,143,255,0.4)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(108,143,255,0.12)",
                    color: "#fff",
                  },
                },
                "& .MuiPaginationItem-firstLast": {
                  display: { xs: "none", sm: "inline-flex" }
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
