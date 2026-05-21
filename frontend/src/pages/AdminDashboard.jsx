import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMovie, getMovies, deleteMovie, updateMovie, uploadMovieImage } from '../api/movies';
import { createFunction, getAllFunctions, deleteFunction, updateFunction } from '../api/functions';
import { getUsers, deleteUser, updateUserRole, updateUser } from '../api/auth';
import { Film, CalendarPlus, Users, PlusCircle, Trash2, Edit, Search, XCircle } from 'lucide-react';
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
  const initialMovieData = { title: '', description: '', duration_minutes: 120, poster_url: '' };
  const [movieData, setMovieData] = useState(initialMovieData);
  const [imageFile, setImageFile] = useState(null);
  const [editingMovieId, setEditingMovieId] = useState(null);
  
  const initialFunctionData = { movie_id: '', room_id: '1', start_time: '', price: 80 };
  const [functionData, setFunctionData] = useState(initialFunctionData);
  const [editingFunctionId, setEditingFunctionId] = useState(null);

  const initialUserData = { full_name: '', email: '', is_admin: false };
  const [userDataForm, setUserDataForm] = useState(initialUserData);
  const [editingUserId, setEditingUserId] = useState(null);

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
      const fns = await getAllFunctions();
      setFunctionsList(fns);
    } catch (err) {
      console.error(err);
    }
  };

  // --- MOVIE HANDLERS ---
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalPosterUrl = movieData.poster_url;
      if (imageFile) {
        const uploadRes = await uploadMovieImage(imageFile);
        finalPosterUrl = uploadRes.imageUrl;
      }
      
      const dataToSubmit = { ...movieData, poster_url: finalPosterUrl };
      
      if (editingMovieId) {
        await updateMovie(editingMovieId, dataToSubmit);
        setMessage({ type: 'success', text: 'Película actualizada con éxito' });
      } else {
        await createMovie(dataToSubmit);
        setMessage({ type: 'success', text: 'Película agregada con éxito' });
      }
      cancelMovieEdit();
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al procesar película' });
    }
  };

  const handleEditMovie = (m) => {
    setEditingMovieId(m.id);
    setMovieData({ title: m.title, description: m.description, duration_minutes: m.duration_minutes, poster_url: m.poster_url || '' });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelMovieEdit = () => {
    setEditingMovieId(null);
    setMovieData(initialMovieData);
    setImageFile(null);
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

  // --- FUNCTION HANDLERS ---
  const handleFunctionSubmit = async (e) => {
    e.preventDefault();
    try {
      let isoDate = new Date(functionData.start_time).toISOString();
      const dataToSubmit = { ...functionData, start_time: isoDate };
      
      if (editingFunctionId) {
        await updateFunction(editingFunctionId, dataToSubmit);
        setMessage({ type: 'success', text: 'Función actualizada con éxito' });
      } else {
        await createFunction(dataToSubmit);
        setMessage({ type: 'success', text: 'Función programada con éxito' });
      }
      cancelFunctionEdit();
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al procesar función' });
    }
  };

  const handleEditFunction = (f) => {
    setEditingFunctionId(f.id);
    // Convert UTC to local datetime-local format format: YYYY-MM-DDTHH:mm
    const date = new Date(f.start_time);
    const tzOffset = date.getTimezoneOffset() * 60000; 
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    
    setFunctionData({ movie_id: f.movie_id, room_id: f.room_id, start_time: localISOTime, price: f.price });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelFunctionEdit = () => {
    setEditingFunctionId(null);
    setFunctionData(initialFunctionData);
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

  // --- USER HANDLERS ---
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await updateUser(editingUserId, { full_name: userDataForm.full_name, email: userDataForm.email, is_admin: userDataForm.is_admin });
        setMessage({ type: 'success', text: 'Usuario actualizado con éxito' });
      }
      cancelUserEdit();
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar usuario' });
    }
  };

  const handleEditUser = (u) => {
    setEditingUserId(u.id);
    setUserDataForm({ full_name: u.full_name, email: u.email, is_admin: u.is_admin });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelUserEdit = () => {
    setEditingUserId(null);
    setUserDataForm(initialUserData);
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
        <button className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => {setActiveTab('movies'); cancelMovieEdit();}}>
          <Film size={18} /> Películas
        </button>
        <button className={`tab-btn ${activeTab === 'functions' ? 'active' : ''}`} onClick={() => {setActiveTab('functions'); cancelFunctionEdit();}}>
          <CalendarPlus size={18} /> Funciones
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => {setActiveTab('users'); cancelUserEdit();}}>
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
              <h3>{editingMovieId ? <><Edit size={20}/> Editar Película</> : <><PlusCircle size={20}/> Registrar Nueva Película</>}</h3>
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
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" className="btn btn-primary">{editingMovieId ? 'Actualizar Película' : 'Guardar Película'}</button>
                {editingMovieId && <button type="button" onClick={cancelMovieEdit} className="btn btn-secondary"><XCircle size={18}/> Cancelar</button>}
              </div>
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
                          <button onClick={() => handleEditMovie(m)} className="btn btn-primary" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                            <Edit size={14}/> Editar
                          </button>
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
              <h3>{editingFunctionId ? <><Edit size={20}/> Editar Función</> : <><CalendarPlus size={20}/> Programar Nueva Función</>}</h3>
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
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" className="btn btn-primary">{editingFunctionId ? 'Actualizar Función' : 'Crear Función'}</button>
                {editingFunctionId && <button type="button" onClick={cancelFunctionEdit} className="btn btn-secondary"><XCircle size={18}/> Cancelar</button>}
              </div>
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
                          <button onClick={() => handleEditFunction(f)} className="btn btn-primary" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                            <Edit size={14}/> Editar
                          </button>
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
            
            {editingUserId && (
              <form onSubmit={handleUserSubmit} className="admin-form" style={{marginBottom: '30px'}}>
                <h3><Edit size={20}/> Editar Usuario</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" required value={userDataForm.full_name} onChange={e => setUserDataForm({...userDataForm, full_name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" required value={userDataForm.email} onChange={e => setUserDataForm({...userDataForm, email: e.target.value})} />
                  </div>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                  <button type="submit" className="btn btn-primary">Actualizar Usuario</button>
                  <button type="button" onClick={cancelUserEdit} className="btn btn-secondary"><XCircle size={18}/> Cancelar</button>
                </div>
              </form>
            )}

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
                        <button onClick={() => handleEditUser(u)} className="btn btn-primary" style={{padding:'6px 12px', fontSize:'0.8rem'}}>
                          <Edit size={14}/> Editar
                        </button>
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
