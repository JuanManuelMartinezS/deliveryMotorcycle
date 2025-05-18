// IssueView.tsx
import React, { useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNotification } from '../../hooks/useNotification';
import { useIssueStore } from '../../store/useIssueStore';
// Importaremos el photoStore cuando esté disponible
// import { usePhotoStore } from '../../store/usePhotoStore';

// Asegúrate de que la ruta sea correcta según tu estructura de proyecto
const API_BASE_URL = import.meta.env.VITE_API_URL;
const IssueView: React.FC = () => {
  const { motorcycleId, id } = useParams<{ motorcycleId: string; id: string }>();
  const { currentIssue, fetchIssueById, removeIssue, loading, error } = useIssueStore();
  // Preparación para usar el photoStore
  // const { photos, fetchPhotosByIssueId } = usePhotoStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchIssueById(parseInt(id));
      // Cuando implementemos el photoStore:
      // fetchPhotosByIssueId(parseInt(id));
    }
  }, [id, fetchIssueById /*, fetchPhotosByIssueId */]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await removeIssue(parseInt(id!));
        showNotification('Problema eliminado exitosamente', 'success');
        Swal.fire(
          '¡Eliminado!',
          'El problema ha sido eliminado.',
          'success'
        ).then(() => {
          navigate(`/motorcycles/${motorcycleId}/issues`);
        });
      } catch (err) {
        const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
        showNotification(errorMessage, 'error');
        Swal.fire('Error', errorMessage, 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!currentIssue) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        Problema no encontrado
      </div>
    );
  }

  // Usaremos photos del photoStore cuando esté implementado
  // Por ahora usamos las photos que vienen con el issue
  const photosToShow = currentIssue.photos || [];

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/motorcycles/${motorcycleId}/issues`)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft className="mr-1" /> Volver a problemas
        </button>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Problema #{currentIssue.id}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/motorcycles/${motorcycleId}/issues/edit/${currentIssue.id}`)}
                  className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-50"
                  title="Editar"
                >
                  <FiEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                  title="Eliminar"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">Descripción:</span>
                <p className="text-gray-800 mt-1">{currentIssue.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Tipo:</span>
                  <span className="text-gray-800 capitalize">{currentIssue.issue_type}</span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-500">Estado:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    currentIssue.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                    currentIssue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    currentIssue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentIssue.status === 'open' ? 'Abierto' :
                     currentIssue.status === 'in_progress' ? 'En progreso' :
                     currentIssue.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Fecha Reporte:</span>
                  <span className="text-gray-800">
                    {new Date(currentIssue.date_reported).toLocaleString()}
                  </span>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-500">Creado el:</span>
                  <span className="text-gray-800">
                    {new Date(currentIssue.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {photosToShow.length > 0 && (
                <div>
                  <span className="block text-sm font-medium text-gray-500">Fotos:</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {photosToShow.map((photo) => (
                      <div key={photo.id} className="border rounded-md p-1">
                        <img 
                          src={photo.image_url} 
                          alt={photo.caption || 'Foto del problema'} 
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevenir loop infinito
                            target.src = 'https://via.placeholder.com/150?text=Error+al+cargar+imagen';
                          }}
                        />
                        {photo.caption && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{photo.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueView;