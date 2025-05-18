// pages/driver/Form.tsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useDriverStore } from '../../store/useDriverStore';

interface DriverFormProps {
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: Yup.string()
    .email('Ingrese un email válido')
    .required('El email es requerido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  phone: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]+$/, 'Solo se permiten números')
    .min(7, 'El teléfono debe tener al menos 7 dígitos')
    .max(15, 'El teléfono no puede exceder 15 dígitos'),
  license_number: Yup.string()
    .required('El número de licencia es requerido')
    .max(20, 'La licencia no puede exceder 20 caracteres'),
  status: Yup.string()
    .required('El estado es requerido')
    .oneOf(['available', 'unavailable', 'on-delivery'], 'Estado inválido')
});

const DriverForm: React.FC<DriverFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { 
    currentDriver, 
    fetchDriverById, 
    addDriver, 
    editDriver,
    setCurrentDriver,
    loading,
    error
  } = useDriverStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      fetchDriverById(parseInt(id));
    } else {
      setCurrentDriver(null);
    }
  }, [isEdit, id, fetchDriverById, setCurrentDriver]);

  const initialValues = {
    name: currentDriver?.name || '',
    email: currentDriver?.email || '',
    phone: currentDriver?.phone || '',
    license_number: currentDriver?.license_number || '',
    status: currentDriver?.status || 'available'
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEdit && id) {
        await editDriver(parseInt(id), values);
        showNotification('Conductor actualizado exitosamente', 'success');
      } else {
        await addDriver(values);
        showNotification('Conductor creado exitosamente', 'success');
      }
      navigate('/drivers');
    } catch (err) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage || 'Error al guardar conductor', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/drivers')}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <FiArrowLeft className="mr-1" /> Volver a la lista
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Conductor' : 'Nuevo Conductor'}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
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
                
                <div>
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Licencia *
                  </label>
                  <Field
                    name="license_number"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.license_number && touched.license_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="license_number" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.status && touched.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="available">Disponible</option>
                    <option value="unavailable">No disponible</option>
                    <option value="on-delivery">En entrega</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/drivers')}
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
                  {isEdit ? 'Actualizar Conductor' : 'Crear Conductor'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DriverForm;