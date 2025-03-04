const API_BASE_URL = 'http://www.omdbapi.com';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const searchMovies = async (query, page = 1, type = '') => {
  try {
    const url = `${API_BASE_URL}/?apikey=${API_KEY}&s=${query}&page=${page}&type=${type}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const url = `${API_BASE_URL}/?apikey=${API_KEY}&i=${imdbID}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
