import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { Product } from '../../models/ProductModel';
import { useProductStore } from '../../store/useProductStore';

interface ProductFormProps {
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { 
    addProduct, 
    editProduct,
    fetchProductById,
    currentProduct,
    setCurrentProduct,
    loading,
    error
  } = useProductStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('El nombre es requerido')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    description: Yup.string()
      .max(500, 'La descripción no puede exceder 500 caracteres'),
    price: Yup.number()
      .required('El precio es requerido')
      .min(0, 'El precio no puede ser negativo')
      .typeError('Debe ser un número válido'),
    category: Yup.string()
      .required('La categoría es requerida')
      .oneOf(['Comida', 'Bebida', 'Postre', 'Otro'], 'Categoría inválida')
  });

  // Cargar datos para edición
  useEffect(() => {
    if (isEdit && id) {
      fetchProductById(parseInt(id));
    } else {
      setCurrentProduct(null);
    }
  }, [isEdit, id, fetchProductById, setCurrentProduct]);

  const initialValues = {
    name: currentProduct?.name || '',
    description: currentProduct?.description || '',
    price: currentProduct?.price || 0,
    category: currentProduct?.category || ''
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEdit && id) {
        await editProduct(parseInt(id), values);
        showNotification('Producto actualizado exitosamente', 'success');
      } else {
        await addProduct(values);
        showNotification('Producto creado exitosamente', 'success');
      }
      navigate('/products');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Volver a la lista
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form className="bg-white shadow-md rounded-lg p-6">
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Field
                  name="name"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Precio *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Field
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      className={`block w-full pl-7 pr-12 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.price && touched.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category && touched.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Comida">Comida</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Postre">Postre</option>
                    <option value="Otro">Otro</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductForm;