import axios from 'axios';

const API_BASE_URL = 'http://www.omdbapi.com';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export const searchMovies = async (query, page = 1, type = '') => {
  try {
    const response = await axiosInstance.get('/', {
      params: {
        s: query,
        page,
        type,
      },
      cors: 'no-cors',
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const response = await axiosInstance.get('/', {
      params: {
        i: imdbID,
      },
      cors: 'no-cors',
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
