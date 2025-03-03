import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Search from "./components/Search";
import MovieDetails from "./components/MovieDetails";

function App() {
  return (
    <BrowserRouter>
      <h1>Tom's Movie Database</h1>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/movie/:imdbID" element={<MovieDetailsWithGoBack />} />
      </Routes>
    </BrowserRouter>
  );
}

const MovieDetailsWithGoBack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack = location.state?.goBack || '/';
  const searchState = location.state?.searchState;

  const handleGoBack = () => {
    navigate(goBack, { state: { searchState } });
  };

  return <MovieDetails goBack={handleGoBack} />;
};

export default App;