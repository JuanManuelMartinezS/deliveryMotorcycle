import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RoleBasedRedirect from "../components/RoleBasedRedirect";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Auth/Login";
import CustomerForm from "../pages/customer/Form";
import CustomerList from "../pages/customer/List";
import CustomerDetail from "../pages/customer/View";
import DriverForm from "../pages/driver/Form";
import DriverList from "../pages/driver/List";
import DriverView from "../pages/driver/View";
import IssueForm from "../pages/issue/Form";
import IssueList from "../pages/issue/List";
import IssueView from "../pages/issue/View";
import MenuForm from "../pages/menu/Form";
import MenuList from "../pages/menu/List";
import MenuView from "../pages/menu/View";
import MotorcycleForm from "../pages/motorcycle/Form";
import MotorcycleList from "../pages/motorcycle/List";
import MotorcycleView from "../pages/motorcycle/View";
import AllOrders from "../pages/order/AllOrders";
import OrderForm from "../pages/order/Form";
import OrderList from "../pages/order/List";
import OrderView from "../pages/order/View";
import ProductForm from "../pages/products/Form";
import ProductList from "../pages/products/List";
import ProductDetail from "../pages/products/View";
import RestaurantForm from "../pages/restaurant/Form";
import RestaurantList from "../pages/restaurant/List";
import RestaurantView from "../pages/restaurant/View";
import ShiftForm from "../pages/shift/Form";
import ShiftList from "../pages/shift/List";
import ShiftView from "../pages/shift/View";
import TrackingPage from "../pages/Tracking/TrackingPage";
import { USER_ROLES } from "../services/authService";
import { Dashboard } from "../components/Dashboard";
// Layouts
const MainLayout = React.lazy(() => import("../layouts/MainLayout"));

// Páginas por rol

// Componente de carga
const Loading = () => (
  <div className="flex justify-center items-center h-screen">Cargando...</div>
);

// Componente para rutas protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const currentRole = localStorage.getItem("currentRole");

  if (loading) return <Loading />;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Rutas protegidas con layout común */}
      <Route
        element={
          <React.Suspense fallback={<Loading />}>
            <MainLayout />
          </React.Suspense>
        }
      >
         <Route path="/dashboard" element={<Dashboard />} />
        {/* Rutas de cliente */}
        <Route
          path="/customers/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
              <React.Suspense fallback={<Loading />}></React.Suspense>
            </ProtectedRoute>
          }
        />

        {/* Rutas de restaurante */}
        <Route
          path="/restaurants/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.RESTAURANT]}>
              <React.Suspense fallback={<Loading />}></React.Suspense>
            </ProtectedRoute>
          }
        />

        {/* Rutas de conductor */}
        <Route
          path="/drivers/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.DRIVER]}>
              <React.Suspense fallback={<Loading />}></React.Suspense>
            </ProtectedRoute>
          }
        />
        {/* Rutas de productos */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/edit/:id" element={<ProductForm isEdit />} />
        {/* Rutas de restaurantes */}
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/new" element={<RestaurantForm />} />
        <Route path="/restaurants/:id" element={<RestaurantView />} />
        <Route
          path="/restaurants/edit/:id"
          element={<RestaurantForm isEdit />}
        />
        {/* Rutas de clientes */}
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="/customers/edit/:id" element={<CustomerForm isEdit />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        {/* Rutas de repartidores */}
        <Route path="/drivers" element={<DriverList />} />
        <Route path="/drivers/new" element={<DriverForm />} />
        <Route path="/drivers/edit/:id" element={<DriverForm isEdit />} />
        <Route path="/drivers/:id" element={<DriverView />} />

        {/* Rutas de motocicletas */}
        <Route path="/motorcycles" element={<MotorcycleList />} />
        <Route path="/motorcycles/new" element={<MotorcycleForm />} />
        <Route
          path="/motorcycles/edit/:id"
          element={<MotorcycleForm isEdit />}
        />
        <Route path="/motorcycles/:id" element={<MotorcycleView />} />

        <Route path="/tracking/:plate" element={<TrackingPage />} />

        {/* Rutas menus*/}
        <Route path="/menus/:restaurantId" element={<MenuList />} />
        <Route path="/menus/:restaurantId/new" element={<MenuForm />} />
        <Route path="/menus/:restaurantId/:id" element={<MenuView />} />
        <Route path="/menus/:restaurantId/edit/:id" element={<MenuForm isEdit />} />

        {/* Rutas órdenes*/}
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/orders/:id" element={<OrderView />} />
        <Route path="/orders/edit/:id" element={<OrderForm isEdit />} />
        <Route path="/customers/:customerId/orders" element={<OrderList />} />
        <Route path="/customers/:customerId/orders/new" element={<OrderForm />} />
        <Route path="/customers/:customerId/orders/:id" element={<OrderView />} />
        <Route 
          path="/customers/:customerId/orders/edit/:id" 
          element={<OrderForm isEdit />} 
        />
       
        {/* Rutas de turnos (shifts) */}
        <Route path="/shifts" element={<ShiftList />} />
        <Route path="/shifts/new" element={<ShiftForm />} />
        <Route path="/shifts/edit/:id" element={<ShiftForm isEdit />} />
        <Route path="/shifts/:id" element={<ShiftView />} />

        {/* Rutas de turnos por conductor */}
        <Route path="/drivers/:driverId/shifts" element={<ShiftList />} />
        <Route path="/drivers/:driverId/shifts/new" element={<ShiftForm />} />

        {/* Rutas de turnos por motocicleta */}
        <Route path="/motorcycles/:motorcycleId/shifts" element={<ShiftList />} />
        <Route path="/motorcycles/:motorcycleId/shifts/new" element={<ShiftForm />} />

        {/* Rutas para Issues */}
      <Route path="/motorcycles/:motorcycleId/issues" element={<IssueList />} />
      <Route path="/motorcycles/:motorcycleId/issues/new" element={<IssueForm />} />
      <Route path="/motorcycles/:motorcycleId/issues/:id" element={<IssueView />} />
      <Route path="/motorcycles/:motorcycleId/issues/edit/:id" element={<IssueForm isEdit />} />
      </Route>

      {/* Rutas especiales */}
      <Route path="/unauthorized" element={<div>Acceso no autorizado</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
