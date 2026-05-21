import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMovie } from '../api/movies';
import { createFunction } from '../api/functions';
import { getUsers } from '../api/auth';
import { getMovies } from '../api/movies';
import { Film, CalendarPlus, Users, PlusCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [moviesList, setMoviesList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // States for forms
  const [movieData, setMovieData] = useState({
    title: '', description: '', duration_minutes: 120, poster_url: ''
  });
  
  const [functionData, setFunctionData] = useState({
    movie_id: '', room_id: '1', start_time: '', price: 80
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const mvs = await getMovies();
      setMoviesList(mvs);
      const usr = await getUsers();
      setUsersList(usr);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMovie(movieData);
      setMessage({ type: 'success', text: 'Película agregada con éxito' });
      setMovieData({ title: '', description: '', duration_minutes: 120, poster_url: '' });
      fetchData(); // Refresh list
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al agregar película' });
    }
  };

  const handleFunctionSubmit = async (e) => {
    e.preventDefault();
    try {
      // Formato datetime esperado por FastAPI: 2026-05-25T14:30:00
      let isoDate = new Date(functionData.start_time).toISOString();
      await createFunction({
        ...functionData,
        start_time: isoDate
      });
      setMessage({ type: 'success', text: 'Función programada con éxito' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al programar función' });
    }
  };

  if (!user || !user.is_admin) return null;

  return (
    <div className="admin-container fade-in">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona películas, funciones y supervisa las cuentas.</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          <Film size={18} /> Agregar Película
        </button>
        <button 
          className={`tab-btn ${activeTab === 'functions' ? 'active' : ''}`}
          onClick={() => setActiveTab('functions')}
        >
          <CalendarPlus size={18} /> Programar Función
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Usuarios
        </button>
      </div>

      <div className="admin-content glass">
        {message.text && (
          <div className={`admin-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* --- TAB: AGREGAR PELICULA --- */}
        {activeTab === 'movies' && (
          <form onSubmit={handleMovieSubmit} className="admin-form">
            <h3><PlusCircle size={20}/> Registrar Nueva Película</h3>
            <div className="form-group">
              <label>Título</label>
              <input type="text" required value={movieData.title} onChange={e => setMovieData({...movieData, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Descripción (Sinopsis)</label>
              <textarea required rows="4" value={movieData.description} onChange={e => setMovieData({...movieData, description: e.target.value})}></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Duración (minutos)</label>
                <input type="number" required value={movieData.duration_minutes} onChange={e => setMovieData({...movieData, duration_minutes: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>URL o Ruta local del Póster</label>
                <input type="text" required placeholder="https://... o /assets/images/..." value={movieData.poster_url} onChange={e => setMovieData({...movieData, poster_url: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Guardar Película</button>
          </form>
        )}

        {/* --- TAB: PROGRAMAR FUNCION --- */}
        {activeTab === 'functions' && (
          <form onSubmit={handleFunctionSubmit} className="admin-form">
            <h3><CalendarPlus size={20}/> Programar Nueva Función</h3>
            <div className="form-group">
              <label>Película</label>
              <select required value={functionData.movie_id} onChange={e => setFunctionData({...functionData, movie_id: parseInt(e.target.value)})}>
                <option value="">Selecciona una película</option>
                {moviesList.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sala</label>
                <select required value={functionData.room_id} onChange={e => setFunctionData({...functionData, room_id: parseInt(e.target.value)})}>
                  <option value="1">Sala 1 MacroXE</option>
                  <option value="2">Sala 2 VIP</option>
                  <option value="3">Sala 3 Tradicional</option>
                </select>
              </div>
              <div className="form-group">
                <label>Precio (MXN)</label>
                <input type="number" required value={functionData.price} onChange={e => setFunctionData({...functionData, price: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="form-group">
              <label>Fecha y Hora</label>
              <input type="datetime-local" required value={functionData.start_time} onChange={e => setFunctionData({...functionData, start_time: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Crear Función</button>
          </form>
        )}

        {/* --- TAB: USUARIOS --- */}
        {activeTab === 'users' && (
          <div className="admin-users-list">
            <h3>Lista de Usuarios y Administradores</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.is_admin ? <span className="badge-admin">Admin</span> : <span className="badge-user">Usuario</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
