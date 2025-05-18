// pages/motorcycle/Form.tsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useMotorcycleStore } from '../../store/useMotorcycleStore';

interface MotorcycleFormProps {
  isEdit?: boolean;
}

const currentYear = new Date().getFullYear();

const validationSchema = Yup.object().shape({
  brand: Yup.string()
    .required('La marca es requerida')
    .max(50, 'La marca no puede exceder 50 caracteres'),
  license_plate: Yup.string()
    .required('La placa es requerida')
    .max(10, 'La placa no puede exceder 10 caracteres'),
  year: Yup.number()
    .required('El año es requerido')
    .min(1900, 'El año debe ser mayor a 1900')
    .max(currentYear, `El año no puede ser mayor a ${currentYear}`),
  status: Yup.string()
    .required('El estado es requerido')
    .oneOf(['available', 'unavailable', 'in-maintenance'], 'Estado inválido')
});

const MotorcycleForm: React.FC<MotorcycleFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const { 
    currentMotorcycle, 
    fetchMotorcycleById, 
    addMotorcycle, 
    editMotorcycle,
    setCurrentMotorcycle,
    loading,
    error
  } = useMotorcycleStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      fetchMotorcycleById(parseInt(id));
    } else {
      setCurrentMotorcycle(null);
    }
  }, [isEdit, id, fetchMotorcycleById, setCurrentMotorcycle]);

  const initialValues = {
    brand: currentMotorcycle?.brand || '',
    license_plate: currentMotorcycle?.license_plate || '',
    year: currentMotorcycle?.year || currentYear,
    status: currentMotorcycle?.status || 'available'
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEdit && id) {
        await editMotorcycle(parseInt(id), values);
        showNotification('Motocicleta actualizada exitosamente', 'success');
      } else {
        await addMotorcycle(values);
        showNotification('Motocicleta creada exitosamente', 'success');
      }
      navigate('/motorcycles');
    } catch (err) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage || 'Error al guardar motocicleta', 'error');
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Motocicleta' : 'Nueva Motocicleta'}
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
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <Field
                  name="brand"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.brand && touched.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-1">
                    Placa *
                  </label>
                  <Field
                    name="license_plate"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.license_plate && touched.license_plate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="license_plate" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Año *
                  </label>
                  <Field
                    name="year"
                    type="number"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.year && touched.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="year" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
              
              <div className="mb-4">
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
                  <option value="in-maintenance">En mantenimiento</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/motorcycles')}
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
                  {isEdit ? 'Actualizar Motocicleta' : 'Crear Motocicleta'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MotorcycleForm;