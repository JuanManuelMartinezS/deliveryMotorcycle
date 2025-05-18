import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FloatingChat from "../components/chat/FloatingChat";


const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 bg-orange-50">
          <Outlet />
        </main>
      </div>
      
      {/* Componentes de asistencia */}
      <FloatingChat />

    </div>
  );
};

export default MainLayout;