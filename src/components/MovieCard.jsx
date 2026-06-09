import { Link } from "react-router-dom";
import {
  Card, CardMedia, CardContent, Box, Typography,
  IconButton, Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  CalendarMonth,
} from "@mui/icons-material";
import { useFavorites } from "../context/FavoritesContext";

export default function MovieCard({ movie, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  const imgSrc = movie.poster_path || movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`
    : null;
  const year = movie.release_date?.split("-")[0] || "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const ratingColor =
    movie.vote_average >= 7.5 ? "#43e97b"
    : movie.vote_average >= 5  ? "#f5c518"
    : "#ff6b6b";

  return (
    <Card
      component={Link}
      to={`/movie/${movie.id}`}
      sx={{
        display: "block",
        textDecoration: "none",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#161929",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: "cardFadeIn 0.5s ease both",
        animationDelay: `${Math.min(index * 0.05, 0.4)}s`,
        "@keyframes cardFadeIn": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        "&:hover": {
          transform: "translateY(-6px)",
          border: "1px solid rgba(108,143,255,0.3)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(108,143,255,0.1)",
        },
      }}
    >
      {/* Poster */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {imgSrc ? (
          <CardMedia
            component="img"
            image={imgSrc}
            alt={movie.title}
            sx={{
              height: 300,
              objectFit: "cover",
              transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
              ".MuiCard-root:hover &": { transform: "scale(1.06)" },
            }}
          />
        ) : (
          <Box
            sx={{
              height: 300,
              background: "linear-gradient(135deg, #161929, #1e2240)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.disabled" fontSize="3rem">🎬</Typography>
          </Box>
        )}

        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,12,27,0.9) 0%, rgba(10,12,27,0.1) 60%, transparent 100%)",
          }}
        />

        {/* Rating badge */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: ratingColor,
            color: "#000",
            fontWeight: 800,
            fontSize: "0.72rem",
            px: 0.9,
            py: 0.3,
            borderRadius: "7px",
            boxShadow: `0 2px 8px ${ratingColor}80`,
            display: "flex",
            alignItems: "center",
            gap: 0.3,
          }}
        >
          <StarIcon sx={{ fontSize: 11 }} />
          {rating}
        </Box>

        {/* Favorite button */}
        <Tooltip title={fav ? "Remove from favorites" : "Add to favorites"} arrow>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(movie);
            }}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              backgroundColor: fav
                ? alpha("#ff6b9d", 0.25)
                : "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              border: fav
                ? "1px solid rgba(255,107,157,0.5)"
                : "1px solid rgba(255,255,255,0.12)",
              color: fav ? "#ff6b9d" : "rgba(255,255,255,0.7)",
              transition: "all 0.22s",
              "&:hover": {
                backgroundColor: alpha("#ff6b9d", 0.3),
                color: "#ff6b9d",
                transform: "scale(1.12)",
              },
            }}
          >
            {fav ? (
              <FavoriteIcon sx={{ fontSize: 16 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Info */}
      <CardContent sx={{ p: 1.5, pb: "14px !important" }}>
        <Typography
          fontWeight={700}
          fontSize="0.88rem"
          noWrap
          sx={{ color: "#f0f0f5", mb: 0.4 }}
        >
          {movie.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              color: "#9ca3af",
            }}
          >
            <CalendarMonth sx={{ fontSize: 12 }} />
            <Typography fontSize="0.75rem" color="text.secondary">
              {year}
            </Typography>
          </Box>

          {movie.vote_count > 0 && (
            <Typography fontSize="0.7rem" color="text.disabled">
              {(movie.vote_count / 1000).toFixed(1)}k
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
