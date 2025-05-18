import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiX, FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { USER_ROLES } from "../services/authService";

export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('currentRole'));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Cierra el sidebar al cambiar a desktop si estaba abierto
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Actualizar el rol cuando cambie en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentRole(localStorage.getItem('currentRole'));
    };

    window.addEventListener('storage', handleStorageChange);
    // También verificar el rol inicial
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Admin';
      case USER_ROLES.CUSTOMER:
        return 'Cliente';
      case USER_ROLES.RESTAURANT:
        return 'Restaurante';
      case USER_ROLES.DRIVER:
        return 'Repartidor';
      default:
        return 'Usuario';
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Restaurantes", path: "/restaurants", icon: "🍽️" },
    { name: "Productos", path: "/products", icon: "🍔" },
    { name: "Todos los Pedidos", path: "/orders", icon: "📦" },
    { name: "Clientes", path: "/customers", icon: "👤" },
    { name: "Repartidores", path: "/drivers", icon: "🏍️" },
    { name: "Motos", path: "/motorcycles", icon: "🛵" },
  ];

  return (
    <>
      {/* Botón de hamburguesa (solo móvil) */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed z-50 p-2 m-2 text-red-800 bg-white rounded-md shadow-md md:hidden"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}
      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed z-40 w-64" : "relative"} 
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          h-screen bg-red-800 text-white transition-transform duration-300 ease-in-out
          md:relative md:w-64
        `}
      >
        <div className="p-4 text-xl font-bold border-b border-red-700">Gestión de envios</div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? "bg-red-600 font-medium" : "hover:bg-red-700"
                }`
              }
              onClick={() => isMobile && setIsOpen(false)} // Cierra sidebar al seleccionar en móvil
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-red-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3 overflow-hidden">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <div className="font-medium">{currentUser?.displayName || 'Usuario'}</div>
              <div className="text-xs text-red-200">
                {getRoleLabel(currentRole)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;