import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Box, IconButton, InputBase,
  Badge, Button, Drawer, List, ListItem,
  ListItemButton, ListItemText, useMediaQuery, useTheme,
  alpha, Tooltip, Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Movie as MovieIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  LocalMovies,
  TrendingUp,
  Star,
  UpcomingOutlined,
  WhatshotRounded,
} from "@mui/icons-material";
import { useFavorites } from "../context/FavoritesContext";

const navLinks = [
  { label: "Popular", path: "/", tab: "popular", icon: <WhatshotRounded sx={{ fontSize: 18 }} /> },
  { label: "Top Rated", path: "/", tab: "top_rated", icon: <Star sx={{ fontSize: 18 }} /> },
  { label: "Upcoming", path: "/", tab: "upcoming", icon: <UpcomingOutlined sx={{ fontSize: 18 }} /> },
  { label: "Trending", path: "/", tab: "trending", icon: <TrendingUp sx={{ fontSize: 18 }} /> },
];

export default function Navbar({ onTabChange, currentTab }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useFavorites();

  function handleSearch(e) {
    if (e.key === "Enter" && searchVal.trim()) {
      navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  }

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: 1200 }}>
        <Toolbar sx={{ gap: 1, px: { xs: 2, md: 3 }, minHeight: { xs: 60, md: 68 } }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                background: "linear-gradient(135deg, #6c8fff, #f5c518)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(108,143,255,0.4)",
              }}
            >
              <LocalMovies sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box
              component="span"
              sx={{
                fontWeight: 800, fontSize: "1.3rem",
                background: "linear-gradient(135deg, #fff 30%, #6c8fff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              CineVerse
            </Box>
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, ml: 3 }}>
              {navLinks.map((n) => (
                <Button
                  key={n.label}
                  startIcon={n.icon}
                  onClick={() => onTabChange && onTabChange(n.tab)}
                  sx={{
                    color: currentTab === n.tab && location.pathname === "/"
                      ? "#6c8fff" : "rgba(255,255,255,0.7)",
                    backgroundColor:
                      currentTab === n.tab && location.pathname === "/"
                        ? alpha("#6c8fff", 0.12) : "transparent",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: alpha("#6c8fff", 0.08),
                    },
                    borderRadius: "10px",
                    px: 1.8,
                    py: 0.8,
                    fontSize: "0.88rem",
                    transition: "all 0.2s",
                  }}
                >
                  {n.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flex: 1 }} />

          {/* Search bar (desktop) */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex", alignItems: "center",
                backgroundColor: alpha("#fff", 0.05),
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px", px: 1.5, py: 0.5,
                transition: "all 0.25s",
                "&:focus-within": {
                  border: "1px solid rgba(108,143,255,0.5)",
                  backgroundColor: alpha("#6c8fff", 0.06),
                  boxShadow: "0 0 0 3px rgba(108,143,255,0.1)",
                },
                width: 240,
              }}
            >
              <SearchIcon sx={{ color: "#9ca3af", fontSize: 18, mr: 1 }} />
              <InputBase
                placeholder="Search movies…"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                sx={{ color: "#f0f0f5", fontSize: "0.9rem", width: "100%" }}
                inputProps={{ "aria-label": "search movies" }}
              />
            </Box>
          )}

          {/* Mobile search icon */}
          {isMobile && (
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              sx={{ color: searchOpen ? "#6c8fff" : "rgba(255,255,255,0.7)" }}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          )}

          {/* Favorites */}
          <Tooltip title="Favorites">
            <IconButton component={Link} to="/favorites" sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#ff6b9d" } }}>
              <Badge badgeContent={favorites.length} color="error" max={99}>
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Mobile menu */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "rgba(255,255,255,0.7)", ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile search bar */}
        {isMobile && searchOpen && (
          <Box
            sx={{
              px: 2, pb: 1.5,
              display: "flex", alignItems: "center",
              backgroundColor: alpha("#fff", 0.03),
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <SearchIcon sx={{ color: "#9ca3af", mr: 1 }} />
            <InputBase
              autoFocus
              placeholder="Search movies…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ color: "#f0f0f5", flex: 1, fontSize: "0.95rem" }}
            />
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260, backgroundColor: "#0f1124",
            borderLeft: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Box sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#6c8fff" }}>Menu</Box>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: "#9ca3af" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ pt: 0 }}>
          {navLinks.map((n) => (
            <ListItem key={n.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  onTabChange && onTabChange(n.tab);
                  setDrawerOpen(false);
                  navigate("/");
                }}
                sx={{
                  mx: 1, borderRadius: "10px",
                  mb: 0.5,
                  backgroundColor:
                    currentTab === n.tab ? alpha("#6c8fff", 0.12) : "transparent",
                  "&:hover": { backgroundColor: alpha("#6c8fff", 0.08) },
                }}
              >
                <Box sx={{ mr: 1.5, color: currentTab === n.tab ? "#6c8fff" : "#9ca3af", display: "flex" }}>
                  {n.icon}
                </Box>
                <ListItemText
                  primary={n.label}
                  primaryTypographyProps={{
                    fontWeight: 600, fontSize: "0.95rem",
                    color: currentTab === n.tab ? "#6c8fff" : "#f0f0f5",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/favorites"
              onClick={() => setDrawerOpen(false)}
              sx={{ mx: 1, borderRadius: "10px", mb: 0.5, "&:hover": { backgroundColor: alpha("#ff6b9d", 0.08) } }}
            >
              <Box sx={{ mr: 1.5, color: "#ff6b9d", display: "flex" }}>
                <FavoriteIcon sx={{ fontSize: 18 }} />
              </Box>
              <ListItemText
                primary="Favorites"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
              />
              <Badge badgeContent={favorites.length} color="error" max={99} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
