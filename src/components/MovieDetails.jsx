import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';

const MovieDetails = ({ goBack }) => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(imdbID);
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error);
        }
      } catch (error) {
        setError('An error occurred while fetching movie details.');
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>Loading...</div>;
  }

  const { Title, Year, Poster, Genre, Plot, Actors, Ratings } = movie;

  return (
    <div>
      <button onClick={goBack}>Go Back</button>
      <h2>{Title}</h2>
      <p>Year: {Year}</p>
      <img src={Poster} alt={Title} />
      <p>Genre: {Genre}</p>
      <p>Plot: {Plot}</p>
      <p>Actors: {Actors}</p>
      <h3>Ratings:</h3>
      <ul>
        {Ratings.map((rating, index) => (
          <li key={index}>
            {rating.Source}: {rating.Value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;