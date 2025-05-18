import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../services/authService';

const OperatorLayout = () => {
  const { userProfile } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="operator-layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Panel de Operador</h2>
          <p>Bienvenido, {userProfile?.displayName}</p>
        </div>
        
        <ul className="nav-links">
          <li className={location.pathname === '/operator/dashboard' ? 'active' : ''}>
            <Link to="/operator/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === '/operator/users' ? 'active' : ''}>
            <Link to="/operator/users">Gestión de Usuarios</Link>
          </li>
          <li className={location.pathname === '/operator/restaurants' ? 'active' : ''}>
            <Link to="/operator/restaurants">Restaurantes</Link>
          </li>
          <li className={location.pathname === '/operator/drivers' ? 'active' : ''}>
            <Link to="/operator/drivers">Conductores</Link>
          </li>
          <li className={location.pathname === '/operator/settings' ? 'active' : ''}>
            <Link to="/operator/settings">Configuración</Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <style jsx>{`
        .operator-layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 250px;
          background-color: #1a1a1a;
          color: white;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
          margin-bottom: 20px;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .sidebar-header p {
          margin: 5px 0 0;
          color: #888;
        }

        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          flex-grow: 1;
        }

        .nav-links li {
          margin-bottom: 10px;
        }

        .nav-links a {
          color: #fff;
          text-decoration: none;
          padding: 10px;
          display: block;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .nav-links a:hover {
          background-color: #333;
        }

        .nav-links li.active a {
          background-color: #007bff;
        }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .logout-button {
          width: 100%;
          padding: 10px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .logout-button:hover {
          background-color: #c82333;
        }

        .main-content {
          flex-grow: 1;
          padding: 20px;
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default OperatorLayout; 