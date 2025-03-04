const API_BASE_URL = 'http://www.omdbapi.com';
const API_KEY = process.env.OMDB_API_KEY;

exports.handler = async (event, context) => {
  const { queryStringParameters } = event;
  const { query, page, type, imdbID } = queryStringParameters;

  let url = `${API_BASE_URL}/?apikey=${API_KEY}`;

  if (query) {
    url += `&s=${query}&page=${page || 1}&type=${type || ''}`;
  } else if (imdbID) {
    url += `&i=${imdbID}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
