import React, { useEffect, useState } from 'react';
import { getMovies } from '../api/movies';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="home-header">
        <h1 className="text-gradient">En Cartelera</h1>
        <p>Las mejores películas, ahora en Cinépolis</p>
      </div>
      
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p>No hay películas disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
