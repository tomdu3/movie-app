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
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="text-gray-400 text-center p-4">Loading...</div>;
  }

  const { Title, Type, Year, Poster, Genre, Plot, Actors, Ratings } = movie;

  return (
    <div className="bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <button
          onClick={goBack}
          className="mb-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
          <div className="flex flex-col md:flex-row">
            <img
              src={Poster}
              alt={Title}
              className="w-full md:w-1/3 h-auto object-cover rounded-lg"
            />
            <div className="md:ml-6 mt-4 md:mt-0">
              <h2 className="text-3xl font-bold">{Title}</h2>
              <p className="text-gray-400 mt-2 capitalize">Type: <span className="font-bold">{Type}</span></p>
              <p className="text-gray-400 mt-2">Year: {Year}</p>
              <p className="text-gray-400 mt-2">Genre: {Genre}</p>
              <p className="text-gray-400 mt-2">Actors: {Actors}</p>
              <p className="text-gray-400 mt-4">{Plot}</p>
              <h3 className="text-2xl font-bold mt-6">Ratings:</h3>
              <ul className="mt-2">
                {Ratings.map((rating, index) => (
                  <li key={index} className="text-gray-400">
                    {rating.Source}: {rating.Value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;