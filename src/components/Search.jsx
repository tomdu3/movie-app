import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      <div className="flex justify-center items-center space-x-2 my-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Prev
        </button>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={handleInputPageChange}
          className="w-16 px-2 py-2 text-center border border-gray-600 rounded bg-gray-800 text-white"
        />
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
        >
          Last ({totalPages})
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
      return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!results.length) {
      return <div className="text-gray-400 text-center">No results found.</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {results.map((movie) => (
          <div key={movie.imdbID} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button onClick={() => handleMovieDetailsClick(movie.imdbID)} className="w-full text-left">
              <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-white font-semibold">{movie.Title}</h3>
                <p className="text-gray-400">{movie.Year}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="flex justify-center mb-8">
          <input
            type="text"
            name="query"
            placeholder="Search movies..."
            className="w-64 px-4 py-2 rounded-l-lg bg-gray-800 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-r-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        {renderResults()}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Search;