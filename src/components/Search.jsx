import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMovies, getMovieDetails } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [moviesWithPlot, setMoviesWithPlot] = useState([]);

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
        const data = await searchMovies(query, currentPage, typeFilter === 'all' ? '' : typeFilter);
        if (data.Response === 'True') {
          setResults(data.Search);
          setTotalPages(Math.ceil(data.totalResults / 10));
          setError(null);
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
    } else {
      setResults([]);
      setError(null);
    }
  }, [query, currentPage, typeFilter]);

  useEffect(() => {
    const fetchMoviesWithPlot = async () => {
      const moviesWithPlot = [];
      for (const movie of results) {
        try {
          const movieDetails = await getMovieDetails(movie.imdbID);
          if (movieDetails.Response === 'True') {
            moviesWithPlot.push({ ...movie, Plot: movieDetails.Plot });
          }
        } catch (error) {
          console.error(`Error fetching details for movie ${movie.imdbID}:`, error);
        }
      }
      setMoviesWithPlot(moviesWithPlot);
    };

    if (results.length > 0) {
      fetchMoviesWithPlot();
    } else {
      setMoviesWithPlot([]);
    }
  }, [results]);

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
    if (results.length === 0) return null;

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

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setCurrentPage(1);
    setTypeFilter('all');
    document.querySelector('input[name="query"]').value = '';
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
        {moviesWithPlot.map((movie) => (
          <div key={movie.imdbID} className="flex bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 cursor-pointer">
            <button onClick={() => handleMovieDetailsClick(movie.imdbID)} className="w-full text-center">
              <img src={movie.Poster} alt={movie.Title} className="w-full h-32 object-contain" />
              <div className="p-4">
                <h3 className="text-white font-semibold">{movie.Title}</h3>
                <p className="text-gray-400"><span className="font-semibold capitalize">{movie.Type}</span>: {movie.Year}</p>
                {movie.Plot && (
                  <p className="italic text-white-400 mt-2">{movie.Plot.length > 100 ? `${movie.Plot.substring(0, 100)}...` : movie.Plot}</p>
                )}
              </div>
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center mb-8 items-center">
          <select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className="text-sm md:text-base mr-2 px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
          <div className="flex mt-2 sm:mt-0">
            <input
              type="text"
              name="query"
              placeholder="Search movies."
              className="text-sm md:text-base w-full sm:w-64 px-4 py-2 rounded-l-xl bg-gray-800 text-white focus:outline-none"
            />
            <button
              type="submit"
              className="text-sm md:text-base px-4 py-2 bg-blue-600 rounded-r-xl hover:bg-blue-700"
            >
              Search
            </button>
          </div>
          {query && (
            <button
              onClick={handleClearSearch}
              className="mt-2 text-sm md:text-base sm:mt-0 sm:ml-2 px-3 md:px-4 py-2 bg-gray-600 rounded-xl hover:bg-gray-500"
            >Clear</button>
          )}
        </form>
        {renderResults()}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Search;
