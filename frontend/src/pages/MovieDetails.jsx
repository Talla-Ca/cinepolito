import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovie } from '../api/movies';
import { getFunctionsByMovie } from '../api/functions';
import { Clock, CalendarDays } from 'lucide-react';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, functionsData] = await Promise.all([
          getMovie(id),
          getFunctionsByMovie(id)
        ]);
        setMovie(movieData);
        setFunctions(functionsData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!movie) return <div className="container">Película no encontrada</div>;

  return (
    <div className="container fade-in">
      <div className="movie-details-layout">
        <div className="movie-poster-large">
          <img 
            src={movie.poster_url || 'https://via.placeholder.com/400x600'} 
            alt={movie.title} 
          />
        </div>
        
        <div className="movie-info-large">
          <h1 className="text-gradient">{movie.title}</h1>
          <div className="movie-meta-large">
            <span><Clock size={18} /> {movie.duration_minutes} minutos</span>
          </div>
          
          <div className="movie-description">
            <h3>Sinopsis</h3>
            <p>{movie.description}</p>
          </div>

          <div className="functions-section">
            <h3>Horarios Disponibles</h3>
            {functions.length > 0 ? (
              <div className="functions-list">
                {functions.map(fn => (
                  <div key={fn.id} className="function-card glass">
                    <div className="function-time">
                      <CalendarDays size={18} />
                      {new Date(fn.start_time).toLocaleString('es-MX', {
                        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                      })}
                    </div>
                    <div className="function-details">
                      Sala {fn.room_id} • ${fn.price}
                    </div>
                    <Link to={`/book/${fn.id}`} className="btn btn-primary">
                      Comprar Boletos
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-functions">No hay horarios programados para esta película.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
