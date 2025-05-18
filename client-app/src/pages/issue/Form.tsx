import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState, useCallback } from 'react';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useIssueStore } from '../../store/useIssueStore';
import { useMotorcycleStore } from '../../store/useMotorcycleStore';
import PhotoUploadModal from '../../components/PhotoUploadModal';

interface IssueFormProps {
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  description: Yup.string()
    .required('La descripción es requerida')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  issue_type: Yup.string()
    .required('El tipo es requerido')
    .oneOf(['maintenance', 'accident', 'technical', 'other'], 'Tipo inválido'),
  date_reported: Yup.date()
    .required('La fecha de reporte es requerida'),
  status: Yup.string()
    .required('El estado es requerido')
    .oneOf(['open', 'in_progress', 'resolved', 'closed'], 'Estado inválido')
});

const IssueForm: React.FC<IssueFormProps> = ({ isEdit = false }) => {
  const { motorcycleId, id } = useParams<{ motorcycleId: string; id: string }>();
  const { 
    currentIssue, 
    fetchIssueById, 
    addIssue, 
    editIssue,
    setCurrentIssue,
    loading,
    error
  } = useIssueStore();
  
  const { currentMotorcycle } = useMotorcycleStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newIssueId, setNewIssueId] = useState<number | null>(null);
  const [isPhotoEdit, setIsPhotoEdit] = useState(false);

  useEffect(() => {
    const initializeIssue = async () => {
      if (isEdit && id) {
        await fetchIssueById(parseInt(id));
      } else {
        setCurrentIssue(null);
      }
      setInitialized(true);
    };
    
    initializeIssue();
  }, [isEdit, id, fetchIssueById, setCurrentIssue]);

  const initialValues = {
    description: currentIssue?.description || '',
    issue_type: currentIssue?.issue_type || 'maintenance',
    date_reported: currentIssue?.date_reported ? 
      new Date(currentIssue.date_reported).toISOString().slice(0, 16) : 
      new Date().toISOString().slice(0, 16),
    status: currentIssue?.status || 'open',
    motorcycle_id: motorcycleId ? parseInt(motorcycleId) : 0
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formattedValues = {
        ...values,
        date_reported: new Date(values.date_reported).toISOString(),
        motorcycle_id: parseInt(motorcycleId!)
      };

      if (isEdit && id) {
        await editIssue(parseInt(id), { ...formattedValues, id: parseInt(id) });
        showNotification('Problema actualizado exitosamente', 'success');
        navigate(`/motorcycles/${motorcycleId}/issues`);
      } else {
        const createdIssue = await addIssue(formattedValues);
        showNotification('Problema reportado exitosamente', 'success');
        if (createdIssue?.id) {
          setNewIssueId(createdIssue.id);
          setShowPhotoModal(true);
        } else {
          navigate(`/motorcycles/${motorcycleId}/issues`);
        }
      }
    } catch (err) {
      console.error('Error al crear/editar issue:', err);
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  const handlePhotoModalClose = useCallback(() => {
    setShowPhotoModal(false);
    setNewIssueId(null);
    setIsPhotoEdit(false);
    if (!isEdit) {
      navigate(`/motorcycles/${motorcycleId}/issues`);
    }
  }, [isEdit, motorcycleId, navigate]);

  const handlePhotoUploaded = useCallback(() => {
    if (isEdit && id) {
      fetchIssueById(parseInt(id));
    }
    handlePhotoModalClose();
  }, [isEdit, id, fetchIssueById, handlePhotoModalClose]);

  const handleEditPhotos = useCallback(() => {
    setIsPhotoEdit(true);
    setShowPhotoModal(true);
  }, []);

  if (!initialized || (isEdit && !currentIssue && !error)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/motorcycles/${motorcycleId}/issues`)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <FiArrowLeft className="mr-1" /> Volver a problemas
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Problema' : 'Reportar Nuevo Problema'}
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="issue_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <Field
                    as="select"
                    name="issue_type"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.issue_type && touched.issue_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="maintenance">Mantenimiento</option>
                    <option value="accident">Accidente</option>
                    <option value="technical">Técnico</option>
                    <option value="other">Otro</option>
                  </Field>
                  <ErrorMessage name="issue_type" component="div" className="text-red-500 text-sm mt-1" />
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
                    <option value="open">Abierto</option>
                    <option value="in_progress">En progreso</option>
                    <option value="resolved">Resuelto</option>
                    <option value="closed">Cerrado</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="date_reported" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Reporte *
                </label>
                <Field
                  name="date_reported"
                  type="datetime-local"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date_reported && touched.date_reported ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="date_reported" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motocicleta
                </label>
                <div className="p-2 bg-gray-100 rounded-md">
                  {currentMotorcycle?.license_plate || `ID: ${motorcycleId}`}
                </div>
                <Field type="hidden" name="motorcycle_id" value={motorcycleId} />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {isEdit && currentIssue?.photos && currentIssue.photos.length > 0 && (
                  <button
                    type="button"
                    onClick={handleEditPhotos}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                  >
                    <FiEdit2 className="h-4 w-4 mr-2" />
                    Editar Fotos
                  </button>
                )}
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
                  {isEdit ? 'Actualizar Problema' : 'Reportar Problema'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {showPhotoModal && (
        <PhotoUploadModal
          key={`photo-modal-${newIssueId || id}`}
          isOpen={showPhotoModal}
          onClose={handlePhotoModalClose}
          issueId={newIssueId || parseInt(id!)}
          onPhotoUploaded={handlePhotoUploaded}
          existingPhotos={isPhotoEdit ? currentIssue?.photos : undefined}
          isEdit={isPhotoEdit}
        />
      )}
    </div>
  );
};

export default IssueForm;