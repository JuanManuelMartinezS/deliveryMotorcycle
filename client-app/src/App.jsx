import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './components/Dashboard';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/** Dashboard Routes */}
          
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/restaurant" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/driver" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
