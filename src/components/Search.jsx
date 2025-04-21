import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchMovies, getMovieDetails } from '../services/api';
import isImageValid from '../helpers/imageUrlCheck';

const MovieCard = ({ movie, onClick, isLoadingPlot }) => {
  const [isValidImage, setIsValidImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(movie.Poster);

  useEffect(() => {
    const checkImage = async () => {
      if (movie.Poster !== 'N/A') {
        const valid = await isImageValid(movie.Poster);
        setIsValidImage(valid);
        if (!valid) {
          setImageUrl('https://placehold.co/300x450?text=No+Poster'); // Fallback URL
        } else {
          setImageUrl(movie.Poster); // Set the valid image URL
        }
      } else {
        setImageUrl('https://placehold.co/300x450?text=No+Poster'); // Fallback URL
      }
    };

    checkImage();
  }, [movie.Poster]); // Check image when movie.Poster changes

  return (
    <div 
      className="flex bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:bg-gray-700 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <button className="w-full text-center">
        <img 
          src={imageUrl} 
          alt={movie.Title}
          className="w-full h-32 object-contain bg-gray-900"
          loading="lazy"
        />
        <div className="p-4">
          <h3 className="text-white font-semibold">{movie.Title}</h3>
          <p className="text-gray-400">
            <span className="font-semibold capitalize">{movie.Type}</span> • {movie.Year}
          </p>
          {isLoadingPlot ? (
            <div className="h-4 bg-gray-700 animate-pulse mt-2 rounded"></div>
          ) : movie.Plot && (
            <p className="italic text-gray-300 mt-2 text-sm">
              {movie.Plot.length > 100 ? `${movie.Plot.substring(0, 100)}...` : movie.Plot}
            </p>
          )}
        </div>
      </button>
    </div>
  );
};


const Search = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlots, setIsLoadingPlots] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [moviesWithPlot, setMoviesWithPlot] = useState([]);

  // Refs
  const searchInputRef = useRef(null);

  // Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Restore search state on navigation
  useEffect(() => {
    if (location.state?.searchState) {
      const { query, results, currentPage, totalPages } = location.state.searchState;
      setQuery(query);      
      setResults(results);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
      setInputPage(currentPage);
      if (searchInputRef.current) {
        searchInputRef.current.value = query;
      }
    } 
  }, [location.state]);

  // Search movies effect
  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchMovies(query, currentPage, typeFilter === 'all' ? '' : typeFilter);
        if (!isMounted) return;

        if (data.Response === 'True') {
          setResults(data.Search);
          setTotalPages(Math.ceil(Number(data.totalResults) / 10));
          setError(null);
        } else {
          setResults([]);
          setError(data.Error);
        }
      } catch (error) {
        if (!isMounted) return;
        setError('An error occurred while searching for movies.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMovies();
    return () => { isMounted = false; };
  }, [query, currentPage, typeFilter]);

  // Fetch movie plots effect
  useEffect(() => {
    let isMounted = true;

    const fetchMoviesWithPlot = async () => {
      if (!results.length) return;
      
      setIsLoadingPlots(true);
      
      try {
        const moviesWithPlot = await Promise.all(
          results.map(async (movie) => {
            try {
              const details = await getMovieDetails(movie.imdbID);
              return details.Response === 'True' 
                ? { ...movie, Plot: details.Plot }
                : { ...movie, Plot: '' };
            } catch {
              return { ...movie, Plot: '' };
            }
          })
        );
        
        if (!isMounted) return;
        setMoviesWithPlot(moviesWithPlot);
      } finally {
        if (isMounted) setIsLoadingPlots(false);
      }
    };

    fetchMoviesWithPlot();
    return () => { isMounted = false; };
  }, [results]);

  // Handlers
  const handleSearch = (event) => {
    event.preventDefault();
    const newQuery = event.target.elements.query.value.trim();
    if (!newQuery) return;
    
    setCurrentPage(1);
    setInputPage(1);
    setQuery(newQuery);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setCurrentPage(1);
    setInputPage(1);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setMoviesWithPlot([]);
    setError(null);
    setCurrentPage(1);
    setInputPage(1);
    setTypeFilter('all');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
      searchInputRef.current.focus();
    }
  };

  const handlePageChange = (pageNumber) => {
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
    setInputPage(page);
  };

  const handleInputPageChange = (event) => {
    setInputPage(event.target.value);
  };

  const handleInputPageKeyDown = (event) => {
    if (event.key === 'Enter') {
      const newPage = parseInt(event.target.value, 10);
      if (newPage >= 1 && newPage <= totalPages) {
        handlePageChange(newPage);
      }
    }
  };

  const handleMovieDetailsClick = (imdbID) => {
    navigate(`/movie/${imdbID}`, {
      state: {
        goBack: location.pathname,
        searchState: { query, results, currentPage, totalPages }
      }
    });
  };

  // Render functions
  const renderPagination = () => {
    if (!results.length) return null;

    return (
      <div className="flex flex-wrap justify-center items-center space-x-2 my-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={handleInputPageChange}
            onKeyDown={handleInputPageKeyDown}
            className="w-16 px-2 py-2 text-center border border-gray-600 rounded bg-gray-800 text-white"
            disabled={isLoading}
          />
          <span className="ml-2 text-gray-400">of {totalPages}</span>
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Last
        </button>
      </div>
    );
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2">Searching...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    if (!query) {
      return <div className="text-gray-400 text-center py-8">Enter a search term to find movies</div>;
    }

    if (!results.length) {
      return <div className="text-gray-400 text-center py-8">No results found</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {moviesWithPlot.map((movie) => (
          <MovieCard 
            key={movie.imdbID}
            movie={movie}
            onClick={() => handleMovieDetailsClick(movie.imdbID)}
            isLoadingPlot={isLoadingPlots}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center mb-8 items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="all">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>

          <div className="flex w-full sm:w-auto">
            <input
              ref={searchInputRef}
              type="text"
              name="query"
              placeholder="Search movies..."
              className="flex-1 px-4 py-2 rounded-l-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>

          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          )}
        </form>

        {renderResults()}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Search;
