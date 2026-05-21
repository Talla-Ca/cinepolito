import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <Film color="var(--secondary)" size={32} />
          Cinépolis
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link active">Cartelera</Link>
          
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="nav-link">
                  <Settings size={18} style={{marginRight: '5px', verticalAlign: 'text-bottom'}} />
                  Admin
                </Link>
              )}
              <span className="nav-link" style={{color: 'white', cursor: 'default'}}>Hola, {user.full_name}</span>
              <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none', padding: 0}}>
                <LogOut size={18} style={{marginRight: '5px', verticalAlign: 'text-bottom'}} />
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
               <User size={18} style={{marginRight: '5px', verticalAlign: 'text-bottom'}} />
               Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
