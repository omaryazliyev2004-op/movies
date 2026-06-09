import { Box, Typography, Grid } from "@mui/material";
import { LocalMovies, GitHub, LinkedIn, Code } from "@mui/icons-material";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Popular", to: "/?tab=popular" },
  { label: "Top Rated", to: "/?tab=top_rated" },
  { label: "Upcoming", to: "/?tab=upcoming" },
  { label: "Favorites", to: "/favorites" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(to top, rgba(6,8,18,0.95) 0%, rgba(10,12,27,0.8) 100%)",
        backdropFilter: "blur(12px)",
        py: 5,
        px: { xs: 3, md: 8 },
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: 1280,
          mx: "auto",
        }}
      >
        {/* Brand */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                width: 32, height: 32, borderRadius: "8px",
                background: "linear-gradient(135deg, #6c8fff, #f5c518)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <LocalMovies sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize="1.1rem"
              sx={{
                background: "linear-gradient(135deg, #fff, #6c8fff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              CineVerse
            </Typography>
          </Box>
          <Typography color="text.secondary" fontSize="0.82rem" maxWidth={280}>
            Discover amazing movies. Your ultimate cinema companion powered by TMDB.
          </Typography>
        </Grid>

        {/* Links */}
        <Grid item xs={6} sm={4} sx={{ textAlign: { sm: "center" } }}>
          <Typography fontWeight={700} fontSize="0.85rem" color="text.secondary" mb={2} letterSpacing="0.08em" textTransform="uppercase">
            Browse
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignItems: { sm: "center" } }}>
            {footerLinks.map((l) => (
              <Link key={l.label} to={l.to} style={{ textDecoration: "none", width: "fit-content" }}>
                <Typography
                  fontSize="0.88rem"
                  color="text.secondary"
                  sx={{
                    transition: "color 0.2s",
                    "&:hover": { color: "#6c8fff" },
                  }}
                >
                  {l.label}
                </Typography>
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Tech */}
        <Grid item xs={6} sm={4} sx={{ textAlign: { xs: "right", sm: "right" } }}>
          <Typography fontWeight={700} fontSize="0.85rem" color="text.secondary" mb={2} letterSpacing="0.08em" textTransform="uppercase">
            Built With
          </Typography>
          {["React 19", "Material UI v6", "TMDB API", "React Router v7"].map((t) => (
            <Typography key={t} fontSize="0.82rem" color="text.disabled" sx={{ mb: 0.8 }}>
              {t}
            </Typography>
          ))}
        </Grid>
      </Grid>

      <Box
        sx={{
          maxWidth: 1280, mx: "auto",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          mt: 4, pt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontSize="0.8rem" color="text.disabled" textAlign="center">
          © {new Date().getFullYear()} CineVerse. Movie data provided by{" "}
          <Box
            component="a"
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#6c8fff", "&:hover": { color: "#94b0ff" }, textDecoration: "none" }}
          >
            TMDB
          </Box>
          .
        </Typography>
      </Box>
    </Box>
  );
}
