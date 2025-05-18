import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CustomerLayout = () => {
  const { userProfile } = useAuth();

  return (
    <div className="customer-layout">
      <header>
        <h1>Panel de Cliente</h1>
        <p>Bienvenido, {userProfile?.displayName}</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout; 