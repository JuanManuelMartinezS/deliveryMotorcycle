// components/products/ProductList.tsx
import React, { useEffect } from 'react';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useProductStore } from '../../store/useProductStore';


const ProductList: React.FC = () => {
  const { products, fetchProducts, removeProduct, loading, error } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
       await removeProduct(id);
       Swal.fire(
         '¡Eliminado!',
         'El producto ha sido eliminado.',
         'success'
       );
     } catch (err) {
       Swal.fire(
         'Error',
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
       (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err)),
         'error'
       );
     }
   }
 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Productos</h1>
        <button
          onClick={() => navigate('/products/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <FiPlus className="mr-2" />
          Nuevo Producto
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
                    Id
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/products/edit/${product.id}`)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-50"
                          title="Editar"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

export default ProductList;