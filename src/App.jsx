import React from "react";
import ReactDOM from "react-dom/client";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Search from "./components/Search";
import MovieDetails from "./components/MovieDetails";

function App() {
  return (
    <BrowserRouter>
      <h1>Tom's Movie Database</h1>
      <Routes>
        <Route path='/' element={<Search />} />
        <Route path='/movie/:imdbID' element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
