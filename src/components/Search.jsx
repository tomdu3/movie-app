import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  };

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setQuery(event.target.elements.query.value);
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
            <Link to={`/movie/${movie.imdbID}`}>
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
            </Link>
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
