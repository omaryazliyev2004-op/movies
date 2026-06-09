import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  ArrowBack,
  Favorite as FavoriteIcon,
  FavoriteBorder,
  Star as StarIcon,
  AccessTime,
  CalendarMonth,
  Language,
  PlayCircleOutlined,
  Close as CloseIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { API } from "../api";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setLoading(true);
    setMovie(null);
    setTrailerKey(null);

    fetch(API.detail(id))
      .then((r) => r.json())
      .then((data) => {
        setMovie(data);
        const videos = data.videos?.results || [];
        const trailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos[0];
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#0a0c1b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "3px solid rgba(108,143,255,0.2)",
            borderTop: "3px solid #6c8fff",
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography color="text.secondary">Loading movie details…</Typography>
      </Box>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#0a0c1b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography fontSize="4rem">🎬</Typography>
        <Typography variant="h5" color="text.secondary">
          Movie not found
        </Typography>
        <Button onClick={() => navigate("/")} variant="contained">
          Go Home
        </Button>
      </Box>
    );
  }

  const fav = isFavorite(movie.id);
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const ratingColor =
    movie.vote_average >= 7.5
      ? "#43e97b"
      : movie.vote_average >= 5
      ? "#f5c518"
      : "#ff6b6b";

  const cast = (movie.credits?.cast || []).slice(0, 12);
  const similar = (movie.similar?.results || []).slice(0, 6);
  const directors = (movie.credits?.crew || []).filter(
    (c) => c.job === "Director"
  );
  const writers = (movie.credits?.crew || [])
    .filter((c) => ["Writer", "Screenplay", "Story"].includes(c.job))
    .slice(0, 3);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0a0c1b" }}>
      {/* ── Hero Backdrop ── */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 260, sm: 360, md: 500 },
          overflow: "hidden",
          backgroundColor: "#111327",
        }}
      >
        {backdropUrl && (
          <Box
            component="img"
            src={backdropUrl}
            alt={movie.title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "brightness(0.3)",
            }}
          />
        )}

        {/* Gradient */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a0c1b 0%, rgba(10,12,27,0.4) 60%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(108,143,255,0.3)",
              borderColor: "#6c8fff",
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 5 } }}>
        {/* ── Poster + Info ── */}
        <Grid
          container
          spacing={{ xs: 3, md: 5 }}
          sx={{
            mt: { xs: -10, sm: -14, md: -22 },
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* Poster */}
          <Grid item xs={12} sm="auto">
            <Box
              sx={{
                width: { xs: 160, sm: 220, md: 280 },
                mx: { xs: "auto", sm: 0 },
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
                border: "3px solid rgba(255,255,255,0.08)",
                aspectRatio: "2/3",
                backgroundColor: "#161929",
                flexShrink: 0,
              }}
            >
              {posterUrl ? (
                <Box
                  component="img"
                  src={posterUrl}
                  alt={movie.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MovieIcon sx={{ fontSize: 64, color: "text.disabled" }} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} sm>
            <Box sx={{ pt: { xs: 0, md: 6 } }}>
              {/* Genre chips */}
              {movie.genres && movie.genres.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 2 }}
                >
                  {movie.genres.map((g) => (
                    <Chip
                      key={g.id}
                      label={g.name}
                      size="small"
                      sx={{
                        backgroundColor: alpha("#6c8fff", 0.15),
                        border: "1px solid rgba(108,143,255,0.3)",
                        color: "#94b0ff",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                      }}
                    />
                  ))}
                </Stack>
              )}

              {/* Title */}
              <Typography
                component="h1"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
                  lineHeight: 1.15,
                  color: "#fff",
                  mb: 1,
                }}
              >
                {movie.title}
              </Typography>

              {/* Tagline */}
              {movie.tagline && (
                <Typography
                  color="text.secondary"
                  fontStyle="italic"
                  fontSize={{ xs: "0.9rem", md: "1rem" }}
                  mb={2.5}
                >
                  "{movie.tagline}"
                </Typography>
              )}

              {/* Meta */}
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 3, alignItems: "center" }}
              >
                {/* Rating */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    backgroundColor: alpha(ratingColor, 0.12),
                    border: `1px solid ${alpha(ratingColor, 0.35)}`,
                    borderRadius: "10px",
                    px: 1.8,
                    py: 0.8,
                  }}
                >
                  <StarIcon sx={{ color: ratingColor, fontSize: 18 }} />
                  <Typography
                    fontWeight={800}
                    fontSize="1.1rem"
                    color={ratingColor}
                  >
                    {rating}
                  </Typography>
                  <Typography color="text.disabled" fontSize="0.78rem">
                    /10
                  </Typography>
                </Box>

                {year !== "N/A" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      color: "#9ca3af",
                    }}
                  >
                    <CalendarMonth sx={{ fontSize: 16 }} />
                    <Typography fontSize="0.9rem" fontWeight={600}>
                      {year}
                    </Typography>
                  </Box>
                )}

                {runtime && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      color: "#9ca3af",
                    }}
                  >
                    <AccessTime sx={{ fontSize: 16 }} />
                    <Typography fontSize="0.9rem" fontWeight={600}>
                      {runtime}
                    </Typography>
                  </Box>
                )}

                {movie.original_language && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      color: "#9ca3af",
                    }}
                  >
                    <Language sx={{ fontSize: 16 }} />
                    <Typography
                      fontSize="0.9rem"
                      fontWeight={600}
                      textTransform="uppercase"
                    >
                      {movie.original_language}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {/* Progress bar */}
              {movie.vote_count > 0 && (
                <Box sx={{ mb: 3, maxWidth: 320 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.8,
                    }}
                  >
                    <Typography fontSize="0.75rem" color="text.disabled">
                      User Score
                    </Typography>
                    <Typography fontSize="0.75rem" color="text.disabled">
                      {movie.vote_count?.toLocaleString()} votes
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((movie.vote_average / 10) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${ratingColor}, ${alpha(
                          ratingColor,
                          0.5
                        )})`,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Buttons */}
              <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 4 }}
              >
                {trailerKey && (
                  <Button
                    variant="contained"
                    startIcon={<PlayCircleOutlined />}
                    onClick={() => setTrailerOpen(true)}
                    sx={{
                      background:
                        "linear-gradient(135deg, #6c8fff, #4a6be0)",
                      fontWeight: 700,
                      px: 3,
                      py: 1.1,
                      boxShadow: "0 6px 20px rgba(108,143,255,0.4)",
                      "&:hover": {
                        boxShadow: "0 8px 28px rgba(108,143,255,0.55)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Watch Trailer
                  </Button>
                )}

                <Button
                  variant={fav ? "contained" : "outlined"}
                  startIcon={fav ? <FavoriteIcon /> : <FavoriteBorder />}
                  onClick={() => toggleFavorite(movie)}
                  sx={
                    fav
                      ? {
                          background:
                            "linear-gradient(135deg, #ff6b9d, #ff4081)",
                          fontWeight: 700,
                          px: 2.5,
                          py: 1.1,
                          boxShadow: "0 4px 14px rgba(255,107,157,0.4)",
                          "&:hover": { transform: "translateY(-2px)" },
                        }
                      : {
                          borderColor: "rgba(255,107,157,0.4)",
                          color: "#ff6b9d",
                          fontWeight: 600,
                          px: 2.5,
                          py: 1.1,
                          "&:hover": {
                            borderColor: "#ff6b9d",
                            backgroundColor: alpha("#ff6b9d", 0.1),
                            transform: "translateY(-1px)",
                          },
                        }
                  }
                >
                  {fav ? "Saved ❤️" : "Add to Favorites"}
                </Button>
              </Stack>

              {/* Overview */}
              {movie.overview && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    fontSize="0.75rem"
                    fontWeight={700}
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing="0.1em"
                    mb={1}
                  >
                    Overview
                  </Typography>
                  <Typography
                    color="rgba(240,240,245,0.82)"
                    fontSize={{ xs: "0.92rem", md: "1rem" }}
                    lineHeight={1.85}
                  >
                    {movie.overview}
                  </Typography>
                </Box>
              )}

              {/* Crew & Stats */}
              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                {directors.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      fontSize="0.72rem"
                      fontWeight={700}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      mb={0.6}
                    >
                      Director{directors.length > 1 ? "s" : ""}
                    </Typography>
                    <Typography fontWeight={600} fontSize="0.9rem">
                      {directors.map((d) => d.name).join(", ")}
                    </Typography>
                  </Grid>
                )}

                {writers.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography
                      fontSize="0.72rem"
                      fontWeight={700}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      mb={0.6}
                    >
                      Writers
                    </Typography>
                    <Typography fontWeight={600} fontSize="0.9rem">
                      {writers.map((w) => w.name).join(", ")}
                    </Typography>
                  </Grid>
                )}

                {movie.budget > 0 && (
                  <Grid item xs={6} sm={3}>
                    <Typography
                      fontSize="0.72rem"
                      fontWeight={700}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      mb={0.6}
                    >
                      Budget
                    </Typography>
                    <Typography fontWeight={700} fontSize="0.9rem">
                      ${(movie.budget / 1e6).toFixed(0)}M
                    </Typography>
                  </Grid>
                )}

                {movie.revenue > 0 && (
                  <Grid item xs={6} sm={3}>
                    <Typography
                      fontSize="0.72rem"
                      fontWeight={700}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      mb={0.6}
                    >
                      Revenue
                    </Typography>
                    <Typography fontWeight={700} fontSize="0.9rem" color="#43e97b">
                      ${(movie.revenue / 1e6).toFixed(0)}M
                    </Typography>
                  </Grid>
                )}

                {movie.status && (
                  <Grid item xs={6} sm={3}>
                    <Typography
                      fontSize="0.72rem"
                      fontWeight={700}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      mb={0.6}
                    >
                      Status
                    </Typography>
                    <Chip
                      label={movie.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          movie.status === "Released"
                            ? alpha("#43e97b", 0.15)
                            : alpha("#f5c518", 0.15),
                        color:
                          movie.status === "Released" ? "#43e97b" : "#f5c518",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        border: `1px solid ${
                          movie.status === "Released"
                            ? alpha("#43e97b", 0.3)
                            : alpha("#f5c518", 0.3)
                        }`,
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <Box sx={{ mt: 7 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              🎭 Cast
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                overflowX: "auto",
                pb: 2,
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": {
                  background: "#6c8fff",
                  borderRadius: 2,
                },
                "&::-webkit-scrollbar-track": { background: "#161929" },
              }}
            >
              {cast.map((actor) => (
                <Box
                  key={actor.credit_id}
                  sx={{
                    minWidth: 96,
                    maxWidth: 96,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <Avatar
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : undefined
                    }
                    alt={actor.name}
                    sx={{
                      width: 68,
                      height: 68,
                      mx: "auto",
                      mb: 1,
                      border: "2px solid rgba(108,143,255,0.25)",
                      backgroundColor: "#1e2240",
                      transition: "border-color 0.2s",
                      "&:hover": { borderColor: "#6c8fff" },
                      fontSize: "1.4rem",
                    }}
                  >
                    {actor.name?.[0]}
                  </Avatar>
                  <Typography
                    fontSize="0.72rem"
                    fontWeight={600}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {actor.name}
                  </Typography>
                  <Typography
                    fontSize="0.65rem"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {actor.character}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Production Companies ── */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight={700} mb={2} color="text.secondary">
              Production Companies
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {movie.production_companies.slice(0, 6).map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* ── Similar Movies ── */}
        {similar.length > 0 && (
          <Box sx={{ mt: 7, mb: 5 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              🎬 Similar Movies
            </Typography>
            <Grid container spacing={2}>
              {similar.map((m, i) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}>
                  <MovieCard movie={m} index={i} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* ── Trailer Modal ── */}
      {trailerOpen && trailerKey && (
        <Box
          onClick={() => setTrailerOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: { xs: "95vw", md: "80vw" },
              maxWidth: 1000,
              aspectRatio: "16/9",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              position: "relative",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title="Movie Trailer"
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>

          <IconButton
            onClick={() => setTrailerOpen(false)}
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 10000,
              backgroundColor: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,107,107,0.25)",
                borderColor: "#ff6b6b",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
