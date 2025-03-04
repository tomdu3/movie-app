const searchMovies = async (query, page = 1, type = '') => {
  try {
    const response = await fetch(`/.netlify/functions/omdb?query=${query}&page=${page}&type=${type}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

const getMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(`/.netlify/functions/omdb?imdbID=${imdbID}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
