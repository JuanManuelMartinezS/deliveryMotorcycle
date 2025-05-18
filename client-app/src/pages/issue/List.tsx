import React, { useEffect } from 'react';
import { FiArrowLeft, FiClock, FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useIssueStore } from '../../store/useIssueStore';

const IssueList: React.FC = () => {
  const { motorcycleId } = useParams<{ motorcycleId: string }>();
  const { issues, fetchIssues, removeIssue, loading, error } = useIssueStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (motorcycleId) {
      fetchIssues(parseInt(motorcycleId));
    }
  }, [motorcycleId, fetchIssues]);

  const handleDelete = async (id: number) => {
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
        await removeIssue(id);
        Swal.fire(
          '¡Eliminado!',
          'El problema ha sido eliminado.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'Error',
          (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err)),
          'error'
        );
      }
    }
  };

  return (
    <div className="space-y-6">
              <button
                onClick={() => navigate('/motorcycles')}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FiArrowLeft className="mr-1" /> Volver a la lista
              </button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Problemas Reportados</h1>
        <button
          onClick={() => navigate(`/motorcycles/${motorcycleId}/issues/new`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Reportar Problema
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Reporte
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No hay problemas reportados
                    </td>
                  </tr>
                ) : (
                  issues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{issue.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{issue.issue_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(issue.date_reported).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          issue.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                          issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {issue.status === 'open' ? 'Abierto' :
                           issue.status === 'in_progress' ? 'En progreso' :
                           issue.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/motorcycles/${motorcycleId}/issues/${issue.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/motorcycles/${motorcycleId}/issues/edit/${issue.id}`)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                            title="Editar"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(issue.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Eliminar"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueList;