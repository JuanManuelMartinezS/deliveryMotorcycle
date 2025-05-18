import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../services/authService';

const RestaurantLayout = () => {
  const { userProfile } = useAuth();

  return (
    <div className="restaurant-layout">
      <header>
        <h1>Panel de Restaurante</h1>
        <p>Bienvenido, {userProfile?.displayName}</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantLayout; 