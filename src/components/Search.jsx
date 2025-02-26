import React, { useState } from 'react';
import { searchMovies } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async () => {
    try {
      const data = await searchMovies(query, currentPage);
      if (data.Response === 'True') {
        setResults(data.Search);
      } else {
        setResults([]);
        setError(data.Error);
      }
    } catch (error) {
      setError('An error occurred while searching for movies.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleSearch();
  };

  const renderPagination = () => {
    const { totalResults, Page, totalPages } = results;

    if (!totalResults) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div>
        <button disabled={Page === 1} onClick={() => handlePageChange(Page - 1)}>
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === Page}
          >
            {page}
          </button>
        ))}
        <button
          disabled={Page === totalPages}
          onClick={() => handlePageChange(Page + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search for a movie..."
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {results.length > 0 && (
        <ul>
          {results.map((movie) => (
            <li key={movie.imdbID}>
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
            </li>
          ))}
        </ul>
      )}
      {renderPagination()}
    </div>
  );
};

export default Search;
