// components/restaurants/RestaurantForm.tsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useRestaurantStore } from '../../store/useRestaurantStore';

interface RestaurantFormProps {
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: Yup.string()
    .email('Ingrese un email válido')
    .required('El email es requerido'),
  phone: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos'),
  address: Yup.string()
    .required('La dirección es requerida')
    .max(200, 'La dirección no puede exceder 200 caracteres')
});

const RestaurantForm: React.FC<RestaurantFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { 
    currentRestaurant, 
    fetchRestaurantById, 
    createRestaurant, 
    updateRestaurant,
    resetCurrent,
    loading,
    error
  } = useRestaurantStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      fetchRestaurantById(parseInt(id));
    } else {
      resetCurrent();
    }
  }, [isEdit, id, fetchRestaurantById, resetCurrent]);

  const initialValues = {
    name: currentRestaurant?.name || '',
    email: currentRestaurant?.email || '',
    phone: currentRestaurant?.phone || '',
    address: currentRestaurant?.address || ''
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEdit && id) {
        await updateRestaurant(parseInt(id), values);
        showNotification('Restaurante actualizado exitosamente', 'success');
      } else {
        await createRestaurant(values);
        showNotification('Restaurante creado exitosamente', 'success');
      }
      navigate('/restaurants');
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/restaurants')}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <FiArrowLeft className="mr-1" /> Volver a la lista
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Restaurante' : 'Nuevo Restaurante'}
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Field
                  name="email"
                  type="email"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <Field
                  name="phone"
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <Field
                  name="address"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/restaurants')}
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
                  {isEdit ? 'Actualizar Restaurante' : 'Crear Restaurante'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RestaurantForm;