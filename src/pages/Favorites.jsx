import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Button,
  IconButton, Tooltip, Divider, Chip, alpha, TextField,
  InputAdornment,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Movie as MovieIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useFavorites } from "../context/FavoritesContext";
import { API } from "../api";

export default function Favorites() {
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState("");

  const filtered = favorites.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating =
    favorites.length > 0
      ? (favorites.reduce((s, m) => s + (m.vote_average || 0), 0) / favorites.length).toFixed(1)
      : 0;

  const topGenres = {};
  favorites.forEach((m) => {
    (m.genre_ids || []).forEach((gid) => {
      topGenres[gid] = (topGenres[gid] || 0) + 1;
    });
  });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", py: 4 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* ── Header ── */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(255,107,157,0.12) 0%, rgba(108,143,255,0.08) 100%)",
            border: "1px solid rgba(255,107,157,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 48, height: 48,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #ff6b9d, #ff4081)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 6px 20px rgba(255,107,157,0.4)",
              }}
            >
              <FavoriteIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                My Favorites
              </Typography>
              <Typography color="text.secondary" fontSize="0.9rem">
                Your personal movie collection
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[
              { label: "Saved Movies", value: favorites.length, color: "#ff6b9d" },
              { label: "Avg Rating", value: avgRating, color: "#f5c518", suffix: "⭐" },
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  px: 2.5, py: 1.5,
                  borderRadius: "12px",
                  backgroundColor: alpha(stat.color, 0.1),
                  border: `1px solid ${alpha(stat.color, 0.25)}`,
                  minWidth: 120,
                }}
              >
                <Typography fontSize="1.6rem" fontWeight={800} color={stat.color} lineHeight={1}>
                  {stat.suffix}{stat.value}
                </Typography>
                <Typography fontSize="0.75rem" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Search bar */}
            <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                placeholder="Search favorites…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{ maxWidth: 320 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography color="text.disabled" fontSize="0.85rem">
                {filtered.length} of {favorites.length} movies
              </Typography>
            </Box>

            {/* Grid */}
            <Grid container spacing={2}>
              {filtered.map((movie, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <FavoriteCard movie={movie} onRemove={removeFavorite} index={i} />
                </Grid>
              ))}
            </Grid>

            {filtered.length === 0 && search && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary" fontSize="1rem">
                  No favorites match "{search}"
                </Typography>
                <Button onClick={() => setSearch("")} sx={{ mt: 1 }}>Clear search</Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

function FavoriteCard({ movie, onRemove, index }) {
  const imgSrc = API.img(movie.poster_path || movie.backdrop_path, "w500");
  const year = movie.release_date?.split("-")[0];
  const ratingColor =
    movie.vote_average >= 7.5 ? "#43e97b"
    : movie.vote_average >= 5 ? "#f5c518"
    : "#ff6b6b";

  return (
    <Box
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        backgroundColor: "#161929",
        display: "flex",
        gap: 0,
        transition: "all 0.3s",
        animation: "fadeInUp 0.4s ease both",
        animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "&:hover": {
          transform: "translateY(-4px)",
          border: "1px solid rgba(255,107,157,0.25)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,107,157,0.06)",
        },
      }}
    >
      {/* Poster */}
      <Box
        component={Link}
        to={`/movie/${movie.id}`}
        sx={{ flex: "0 0 80px", display: "block", overflow: "hidden" }}
      >
        {imgSrc ? (
          <Box
            component="img"
            src={imgSrc}
            alt={movie.title}
            sx={{ width: 80, height: "100%", objectFit: "cover", display: "block", minHeight: 110 }}
          />
        ) : (
          <Box
            sx={{
              width: 80, height: 110,
              background: "linear-gradient(135deg, #1e2240, #161929)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <MovieIcon sx={{ color: "text.disabled", fontSize: 28 }} />
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, p: 1.5, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <Box>
          <Typography
            component={Link}
            to={`/movie/${movie.id}`}
            fontWeight={700}
            fontSize="0.88rem"
            noWrap
            sx={{
              display: "block",
              color: "#f0f0f5",
              textDecoration: "none",
              mb: 0.4,
              "&:hover": { color: "#6c8fff" },
              transition: "color 0.2s",
            }}
          >
            {movie.title}
          </Typography>
          <Typography color="text.disabled" fontSize="0.75rem">{year || "—"}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Chip
            icon={<StarIcon sx={{ fontSize: "13px !important", color: `${ratingColor} !important` }} />}
            label={movie.vote_average?.toFixed(1) || "N/A"}
            size="small"
            sx={{
              height: 22, fontSize: "0.72rem", fontWeight: 700,
              backgroundColor: alpha(ratingColor, 0.1),
              border: `1px solid ${alpha(ratingColor, 0.25)}`,
              color: ratingColor,
            }}
          />
          <Tooltip title="Remove from favorites">
            <IconButton
              size="small"
              onClick={() => onRemove(movie.id)}
              sx={{
                color: "rgba(255,107,107,0.5)",
                p: 0.5,
                "&:hover": { color: "#ff6b6b", backgroundColor: alpha("#ff6b6b", 0.1) },
                transition: "all 0.2s",
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

function EmptyState() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        borderRadius: "20px",
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <Typography fontSize="5rem" mb={2} sx={{ animation: "hero-float 3s ease-in-out infinite",
        "@keyframes hero-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }}>
        💔
      </Typography>
      <Typography variant="h5" fontWeight={700} mb={1}>
        No Favorites Yet
      </Typography>
      <Typography color="text.secondary" fontSize="0.95rem" mb={3} maxWidth={320} mx="auto">
        Start adding movies you love to your personal collection
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        endIcon={<ArrowForward />}
        sx={{
          background: "linear-gradient(135deg, #6c8fff, #4a6be0)",
          px: 3, py: 1.2, fontWeight: 700,
          boxShadow: "0 6px 20px rgba(108,143,255,0.4)",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 28px rgba(108,143,255,0.5)" },
        }}
      >
        Browse Movies
      </Button>
    </Box>
  );
}
