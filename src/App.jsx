import React from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Search from "./components/Search";
import MovieDetails from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/movie/:imdbID" element={<MovieDetailsWithGoBack />} />
          </Routes>
        </main>
        <Footer />
      </div>
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