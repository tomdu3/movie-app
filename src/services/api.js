import axios from 'axios';

const API_BASE_URL = 'http://www.omdbapi.com';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const searchMovies = async (query, page = 1, type = '') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/?apikey=${API_KEY}&s=${query}&page=${page}&type=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/?apikey=${API_KEY}&i=${imdbID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
