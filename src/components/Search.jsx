import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.searchState) {
      const { query, results, currentPage, totalPages } = location.state.searchState;
      setQuery(query);
      setResults(results);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
      setInputPage(currentPage);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await searchMovies(query, currentPage);
        if (data.Response === 'True') {
          setResults(data.Search);
          setTotalPages(Math.ceil(data.totalResults / 10));
        } else {
          setResults([]);
          setError(data.Error);
        }
      } catch (error) {
        setError('An error occurred while searching for movies.');
      }
    };

    if (query) {
      fetchMovies();
    }
  }, [query, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setInputPage(pageNumber);
  };

  const handleInputPageChange = (event) => {
    if (event.key === 'Enter') {
      const newPage = parseInt(event.target.value, 10);
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        setInputPage(newPage);
      }
    }
  };

  const renderPagination = () => {
    return (
      <div>
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          First Page
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev Page
        </button>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={handleInputPageChange}
        />
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next Page
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last Page ({totalPages})
        </button>
      </div>
    );
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setQuery(event.target.elements.query.value);
  };

  const handleMovieDetailsClick = (imdbID) => {
    navigate(`/movie/${imdbID}`, { state: { goBack: location.pathname, searchState: { query, results, currentPage, totalPages } } });
  };

  const renderResults = () => {
    if (error) {
      return <div>{error}</div>;
    }

    if (!results.length) {
      return <div>No results found.</div>;
    }

    return (
      <div>
        {results.map((movie) => (
          <div key={movie.imdbID}>
            <button onClick={() => handleMovieDetailsClick(movie.imdbID)}>
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
            </button>
            <p>{movie.Year}</p>
          </div>
        ))}
        {renderPagination()}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" name="query" placeholder="Search movies..." />
        <button type="submit">Search</button>
      </form>
      {renderResults()}
    </div>
  );
};

export default Search;