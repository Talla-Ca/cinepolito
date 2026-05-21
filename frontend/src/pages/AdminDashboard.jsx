import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMovie, getMovies, deleteMovie, uploadMovieImage } from '../api/movies';
import { createFunction, getFunctionsByMovie, deleteFunction } from '../api/functions';
import { getUsers, deleteUser, updateUserRole } from '../api/auth';
import { Film, CalendarPlus, Users, PlusCircle, Trash2, Edit, Search, Image as ImageIcon } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies');
  const [moviesList, setMoviesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [functionsList, setFunctionsList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // States for forms
  const [movieData, setMovieData] = useState({
    title: '', description: '', duration_minutes: 120, poster_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  
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
      // Fetch all functions by hitting a general endpoint if we change it or just loading them (we will fetch per movie but for admin maybe we need all. Wait, getFunctionsByMovie without param returns all in backend)
      const fns = await getFunctionsByMovie(''); // If movie_id is empty, backend ignores it
      setFunctionsList(fns);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalPosterUrl = movieData.poster_url;
      if (imageFile) {
        const uploadRes = await uploadMovieImage(imageFile);
        finalPosterUrl = uploadRes.imageUrl;
      }
      
      await createMovie({ ...movieData, poster_url: finalPosterUrl });
      setMessage({ type: 'success', text: 'Película agregada con éxito' });
      setMovieData({ title: '', description: '', duration_minutes: 120, poster_url: '' });
      setImageFile(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al agregar película' });
    }
  };

  const handleDeleteMovie = async (id) => {
    if(window.confirm('¿Eliminar esta película?')) {
      try {
        await deleteMovie(id);
        setMessage({ type: 'success', text: 'Película eliminada' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'error', text: 'Error al eliminar película' });
      }
    }
  };

  const handleFunctionSubmit = async (e) => {
    e.preventDefault();
    try {
      let isoDate = new Date(functionData.start_time).toISOString();
      await createFunction({
        ...functionData,
        start_time: isoDate
      });
      setMessage({ type: 'success', text: 'Función programada con éxito' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al programar función' });
    }
  };

  const handleDeleteFunction = async (id) => {
    if(window.confirm('¿Eliminar esta función?')) {
      try {
        await deleteFunction(id);
        setMessage({ type: 'success', text: 'Función eliminada' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'error', text: 'Error al eliminar función' });
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if(window.confirm('¿Eliminar este usuario?')) {
      try {
        await deleteUser(id);
        setMessage({ type: 'success', text: 'Usuario eliminado' });
        fetchData();
      } catch (err) {
        setMessage({ type: 'error', text: 'Error al eliminar usuario' });
      }
    }
  };

  const handleToggleAdmin = async (u) => {
    try {
      await updateUserRole(u.id, !u.is_admin);
      setMessage({ type: 'success', text: 'Rol actualizado' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar rol' });
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.full_name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

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
          <Film size={18} /> Películas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'functions' ? 'active' : ''}`}
          onClick={() => setActiveTab('functions')}
        >
          <CalendarPlus size={18} /> Funciones
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

        {/* --- TAB: PELICULAS --- */}
        {activeTab === 'movies' && (
          <div>
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
                  <label>Subir Póster</label>
                  <input type="file" accept="image/*" onChange={e => {
                    setImageFile(e.target.files[0]);
                    setMovieData({...movieData, poster_url: ''});
                  }} />
                  <small style={{display:'block', marginTop:'5px', color:'var(--text-muted)'}}>O ingresa una URL web:</small>
                  <input type="text" placeholder="https://..." value={movieData.poster_url} onChange={e => {
                    setMovieData({...movieData, poster_url: e.target.value});
                    setImageFile(null);
                  }} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Guardar Película</button>
            </form>

            <div className="admin-users-list" style={{marginTop: '40px'}}>
              <h3>Películas Existentes</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Duración</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moviesList.map(m => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.title}</td>
                        <td>{m.duration_minutes} min</td>
                        <td style={{display:'flex', gap:'10px'}}>
                          <button onClick={() => handleDeleteMovie(m.id)} className="btn btn-danger" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                            <Trash2 size={14}/> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: FUNCIONES --- */}
        {activeTab === 'functions' && (
          <div>
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

            <div className="admin-users-list" style={{marginTop: '40px'}}>
              <h3>Funciones Existentes</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Película</th>
                      <th>Sala</th>
                      <th>Fecha y Hora</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {functionsList.map(f => (
                      <tr key={f.id}>
                        <td>{f.id}</td>
                        <td>{moviesList.find(m => m.id === f.movie_id)?.title || f.movie_id}</td>
                        <td>Sala {f.room_id}</td>
                        <td>{new Date(f.start_time).toLocaleString()}</td>
                        <td style={{display:'flex', gap:'10px'}}>
                          <button onClick={() => handleDeleteFunction(f.id)} className="btn btn-danger" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                            <Trash2 size={14}/> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: USUARIOS --- */}
        {activeTab === 'users' && (
          <div className="admin-users-list">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
              <h3>Gestión de Usuarios</h3>
              <div className="search-box" style={{display:'flex', alignItems:'center', background:'#fff', padding:'5px 15px', borderRadius:'20px', border:'1px solid #ccc'}}>
                <Search size={16} color="#666" />
                <input 
                  type="text" 
                  placeholder="Buscar usuario..." 
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{border:'none', outline:'none', marginLeft:'10px', background:'transparent'}}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.is_admin ? <span className="badge-admin">Admin</span> : <span className="badge-user">Usuario</span>}
                      </td>
                      <td style={{display:'flex', gap:'10px'}}>
                        <button onClick={() => handleToggleAdmin(u)} className="btn btn-secondary" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                          {u.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                          <Trash2 size={14}/>
                        </button>
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
