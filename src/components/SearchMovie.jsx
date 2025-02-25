import React, { useState } from 'react';
import { searchMovies } from '../services/api';

const SearchMovie = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await searchMovies(query);
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

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
    </div>
  );
};

export default SearchMovie;
