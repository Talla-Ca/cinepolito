import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectMovie = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div className="movie-card fade-in">
      <div className="movie-poster-wrapper">
        <img 
          src={movie.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Poster'} 
          alt={`Poster de ${movie.title}`} 
          className="movie-poster"
          loading="lazy"
        />
        <div className="movie-overlay glass">
          <button onClick={handleSelectMovie} className="btn btn-primary">
            Ver Detalles y Horarios
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-duration">
            <Clock size={16} /> {movie.duration_minutes} min
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
