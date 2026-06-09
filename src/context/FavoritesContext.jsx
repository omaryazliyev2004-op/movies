import { createContext, useContext, useState, useCallback } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cineverse_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const addFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      const next = [movie, ...prev];
      localStorage.setItem("cineverse_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.filter((m) => m.id !== id);
      localStorage.setItem("cineverse_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((m) => m.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (movie) => {
      if (isFavorite(movie.id)) removeFavorite(movie.id);
      else addFavorite(movie);
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
