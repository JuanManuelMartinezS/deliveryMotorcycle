// pages/shift/Form.tsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useDriverStore } from '../../store/useDriverStore';
import { useMotorcycleStore } from '../../store/useMotorcycleStore';
import { useShiftStore } from '../../store/useShiftStore';

interface ShiftFormProps {
  isEdit?: boolean;
  driverId?: number;
  motorcycleId?: number;
}

const validationSchema = Yup.object().shape({
  driver_id: Yup.number().required('Se requiere un conductor'),
  motorcycle_id: Yup.number().required('Se requiere una motocicleta'),
  start_time: Yup.date().required('La fecha de inicio es requerida'),
  end_time: Yup.date()
    .required('La fecha de fin es requerida')
    .min(Yup.ref('start_time'), 'La fecha de fin debe ser posterior a la de inicio'),
  status: Yup.string()
    .required('El estado es requerido')
    .oneOf(['active', 'completed', 'canceled'], 'Estado inválido')
});

const ShiftForm: React.FC<ShiftFormProps> = ({ isEdit = false}) => {
    const { id, driverId, motorcycleId } = useParams<{ 
    id?: string;
    driverId?: string;
    motorcycleId?: string;
  }>();
  const { 
    currentShift, 
    fetchShiftById, 
    addShift, 
    editShift,
    setCurrentShift,
    loading,
    error
  } = useShiftStore();
  
  const { drivers, fetchDrivers } = useDriverStore();
  const { motorcycles, fetchMotorcycles } = useMotorcycleStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchDrivers();
    fetchMotorcycles();
    
    if (isEdit && id) {
      fetchShiftById(parseInt(id));
    } else {
      setCurrentShift(null);
    }
    
    setInitialized(true);
  }, [isEdit, id, fetchShiftById, setCurrentShift, fetchDrivers, fetchMotorcycles]);

const initialValues = {
  driver_id: currentShift?.driver_id || driverId || '',
  motorcycle_id: currentShift?.motorcycle_id || motorcycleId || '',
  start_time: currentShift?.start_time ? 
    new Date(currentShift.start_time).toISOString().slice(0, 16) : '',
  end_time: currentShift?.end_time ? 
    new Date(currentShift.end_time).toISOString().slice(0, 16) : '',
  status: currentShift?.status || 'active' as 'active' | 'completed' | 'canceled'
};

  const handleSubmit = async (values: typeof initialValues) => {
  try {
    const formattedValues = {
      ...values,
      driver_id: Number(values.driver_id), // Convertir a número
      motorcycle_id: Number(values.motorcycle_id), // Convertir a número
      start_time: new Date(values.start_time).toISOString(),
      end_time: new Date(values.end_time).toISOString()
    };

    if (isEdit && id) {
      await editShift(parseInt(id), formattedValues);
      showNotification('Turno actualizado exitosamente', 'success');
    } else {
      await addShift(formattedValues);
      showNotification('Turno creado exitosamente', 'success');
    }
    navigate(-1);
  } catch (err) {
    const errorMessage = (err as any)?.response?.data?.message || 
      (err instanceof Error ? err.message : String(err));
    showNotification(errorMessage, 'error');
  }
};

  if (!initialized || (isEdit && !currentShift && !error)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Turno' : 'Nuevo Turno'}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {!driverId && (
                    <div>
                    <label htmlFor="driver_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Conductor *
                    </label>
                    <Field
                        as="select"
                        name="driver_id"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.driver_id && touched.driver_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Seleccione un conductor</option>
                        {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                            {driver.name} ({driver.id})
                        </option>
                        ))}
                    </Field>
                    <ErrorMessage name="driver_id" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                )}

                {driverId && (
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
                    <div className="p-2 bg-gray-100 rounded-md">
                        {drivers.find(d => d.id.toString() === driverId)?.name || `ID: ${driverId}`}
                    </div>
                    <Field type="hidden" name="driver_id" value={driverId} />
                    </div>
                )}
                
                {!motorcycleId && (
                    <div>
                    <label htmlFor="motorcycle_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Motocicleta *
                    </label>
                    <Field
                        as="select"
                        name="motorcycle_id"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.motorcycle_id && touched.motorcycle_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Seleccione una motocicleta</option>
                        {motorcycles.map(motorcycle => (
                        <option key={motorcycle.id} value={motorcycle.id}>
                            {motorcycle.license_plate} ({motorcycle.brand})
                        </option>
                        ))}
                    </Field>
                    <ErrorMessage name="motorcycle_id" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                )}

                {motorcycleId && (
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motocicleta</label>
                    <div className="p-2 bg-gray-100 rounded-md">
                        {motorcycles.find(m => m.id.toString() === motorcycleId)?.license_plate || `ID: ${motorcycleId}`}
                    </div>
                    <Field type="hidden" name="motorcycle_id" value={motorcycleId} />
                    </div>
                )}
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y Hora de Inicio *
                  </label>
                  <Field
                    name="start_time"
                    type="datetime-local"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.start_time && touched.start_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="start_time" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                
                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y Hora de Fin *
                  </label>
                  <Field
                    name="end_time"
                    type="datetime-local"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.end_time && touched.end_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="end_time" component="div" className="text-red-500 text-sm mt-1" />
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
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="canceled">Cancelado</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
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
                  {isEdit ? 'Actualizar Turno' : 'Crear Turno'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ShiftForm;