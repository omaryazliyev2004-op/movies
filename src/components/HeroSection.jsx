import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Chip, Skeleton } from "@mui/material";
import {
  PlayCircleOutlined,
  InfoOutlined,
  StarRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";
import { API } from "../api";

export default function HeroSection() {
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API.trending)
      .then((r) => r.json())
      .then((d) => {
        const list = (d.results || []).filter(
          (m) => m.backdrop_path && m.overview
        );
        setFeatured(list[Math.floor(Math.random() * Math.min(5, list.length))]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", height: { xs: 380, md: 520 }, borderRadius: 0 }}
        animation="wave"
      />
    );
  }

  if (!featured) return null;

  const bgImg = API.img(featured.backdrop_path, "original");
  const year = featured.release_date?.split("-")[0];
  const rating = featured.vote_average?.toFixed(1);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 380, sm: 460, md: 540 },
        overflow: "hidden",
        mb: 0,
      }}
    >
      {/* Background image */}
      <Box
        component="img"
        src={bgImg}
        alt={featured.title}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 20%",
          filter: "brightness(0.45)",
          animation: "hero-float 8s ease-in-out infinite",
          "@keyframes hero-float": {
            "0%, 100%": { transform: "scale(1.02)" },
            "50%": { transform: "scale(1.06)" },
          },
        }}
      />

      {/* Gradient overlays */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(10,12,27,0.95) 0%, rgba(10,12,27,0.6) 50%, rgba(10,12,27,0.1) 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(to top, #0a0c1b 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: { xs: 3, sm: 5, md: 8 },
          pb: { xs: 4, md: 5 },
          maxWidth: 700,
        }}
      >
        {/* Trending badge */}
        <Chip
          label="🔥 Trending This Week"
          size="small"
          sx={{
            mb: 2,
            width: "fit-content",
            backgroundColor: "rgba(245,197,24,0.15)",
            border: "1px solid rgba(245,197,24,0.4)",
            color: "#f5c518",
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3rem" },
            fontWeight: 800,
            lineHeight: 1.15,
            mb: 1.5,
            color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            animation: "fadeInUp 0.7s ease both",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {featured.title}
        </Typography>

        {/* Meta */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
            animation: "fadeInUp 0.7s 0.1s ease both",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#f5c518" }}>
            <StarRounded sx={{ fontSize: 18 }} />
            <Typography fontWeight={700} fontSize="0.9rem">{rating}</Typography>
          </Box>
          {year && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#9ca3af" }}>
              <CalendarMonthRounded sx={{ fontSize: 16 }} />
              <Typography fontSize="0.85rem">{year}</Typography>
            </Box>
          )}
        </Box>

        {/* Overview */}
        <Typography
          sx={{
            color: "rgba(240,240,245,0.75)",
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            lineHeight: 1.7,
            mb: 3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxWidth: 560,
            animation: "fadeInUp 0.7s 0.15s ease both",
          }}
        >
          {featured.overview}
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            animation: "fadeInUp 0.7s 0.2s ease both",
          }}
        >
          <Button
            component={Link}
            to={`/movie/${featured.id}`}
            variant="contained"
            startIcon={<PlayCircleOutlined />}
            sx={{
              background: "linear-gradient(135deg, #6c8fff, #4a6be0)",
              px: 3,
              py: 1.2,
              fontSize: "0.95rem",
              fontWeight: 700,
              boxShadow: "0 6px 24px rgba(108,143,255,0.45)",
              "&:hover": {
                background: "linear-gradient(135deg, #94b0ff, #6c8fff)",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 30px rgba(108,143,255,0.55)",
              },
            }}
          >
            View Details
          </Button>
          <Button
            component={Link}
            to={`/movie/${featured.id}`}
            variant="outlined"
            startIcon={<InfoOutlined />}
            sx={{
              borderColor: "rgba(255,255,255,0.25)",
              color: "#fff",
              px: 2.5,
              py: 1.2,
              fontSize: "0.95rem",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(255,255,255,0.06)",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.5)",
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            More Info
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
