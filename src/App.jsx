import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

import theme from "./theme";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Favorites from "./pages/Favorites";

export default function App() {
  const [currentTab, setCurrentTab] = useState("popular");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <BrowserRouter>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.default",
            }}
          >
            <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

            <Box component="main" sx={{ flex: 1 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      currentTab={currentTab}
                      onTabChange={setCurrentTab}
                    />
                  }
                />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </Box>

            <Footer />
          </Box>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
