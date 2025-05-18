import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DriverLayout = () => {
  const { userProfile } = useAuth();

  return (
    <div className="driver-layout">
      <header>
        <h1>Panel de Conductor</h1>
        <p>Bienvenido, {userProfile?.displayName}</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout; 