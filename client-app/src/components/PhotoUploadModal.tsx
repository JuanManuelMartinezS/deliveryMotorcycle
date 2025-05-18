import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useNotification } from '../hooks/useNotification';
import { uploadPhoto, updatePhoto, deletePhoto, Photo } from '../services/photoService';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: number;
  onPhotoUploaded: () => void;
  existingPhotos?: Photo[];
  isEdit?: boolean;
}

interface PhotoFormData {
  id?: number;
  imageUrl: string;
  caption: string;
  isValidating?: boolean;
  isValid?: boolean;
}

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/');
  } catch {
    return false;
  }
};

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  issueId,
  onPhotoUploaded,
  existingPhotos = [],
  isEdit = false
}) => {
  const [photos, setPhotos] = useState<PhotoFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const validationTimersRef = useRef<{ [key: string]: number }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar fotos cuando el modal se abre
  useEffect(() => {
    if (isOpen && !isInitialized) {
      if (isEdit && existingPhotos.length > 0) {
        setPhotos(existingPhotos.map(photo => ({
          id: photo.id,
          imageUrl: photo.image_url,
          caption: photo.caption || '',
          isValid: true
        })));
      } else {
        setPhotos([{ imageUrl: '', caption: '', isValid: false }]);
      }
      setIsInitialized(true);
    } else if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen, isEdit, existingPhotos, isInitialized]);

  // Limpiar timers cuando el componente se desmonta
  useEffect(() => {
    return () => {
      Object.values(validationTimersRef.current).forEach(timer => window.clearTimeout(timer));
    };
  }, []);

  const validateImage = useCallback((url: string, index: number) => {
    // Limpiar el timer anterior si existe
    if (validationTimersRef.current[index]) {
      window.clearTimeout(validationTimersRef.current[index]);
    }

    // Si la URL está vacía, solo actualizar el estado
    if (!url) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[index] = { ...newPhotos[index], isValid: false, isValidating: false };
        return newPhotos;
      });
      return;
    }

    // Si la URL no es válida, actualizar el estado y salir
    if (!isValidUrl(url)) {
      setPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[index] = { ...newPhotos[index], isValid: false, isValidating: false };
        return newPhotos;
      });
      return;
    }

    // Marcar como validando
    setPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], isValidating: true };
      return newPhotos;
    });

    // Crear un nuevo timer
    const timer = window.setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        setPhotos(prev => {
          const newPhotos = [...prev];
          newPhotos[index] = { ...newPhotos[index], isValid: true, isValidating: false };
          return newPhotos;
        });
      };
      img.onerror = () => {
        setPhotos(prev => {
          const newPhotos = [...prev];
          newPhotos[index] = { ...newPhotos[index], isValid: false, isValidating: false };
          return newPhotos;
        });
        showNotification('No se pudo cargar la imagen. Verifica la URL.', 'error');
      };
      img.src = url;
    }, 1000);

    validationTimersRef.current[index] = timer;
  }, [showNotification]);

  const addPhotoField = () => {
    setPhotos(prevPhotos => [...prevPhotos, { imageUrl: '', caption: '', isValid: false }]);
  };

  const removePhotoField = async (index: number) => {
    const photo = photos[index];
    try {
      if (photo.id) {
        await deletePhoto(photo.id);
        showNotification('Foto eliminada exitosamente', 'success');
      }
      // Limpiar el timer si existe
      if (validationTimersRef.current[index]) {
        window.clearTimeout(validationTimersRef.current[index]);
        delete validationTimersRef.current[index];
      }
      setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    } catch (error) {
      showNotification('Error al eliminar la foto', 'error');
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos];
      newPhotos[index] = { ...newPhotos[index], imageUrl: value };
      return newPhotos;
    });
    validateImage(value, index);
  };

  const handleCaptionChange = (index: number, value: string) => {
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos];
      newPhotos[index] = { ...newPhotos[index], caption: value };
      return newPhotos;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validPhotos = photos.filter(p => p.imageUrl.trim() !== '' && p.isValid);
    
    if (validPhotos.length === 0) {
      showNotification('Por favor ingresa al menos una URL de imagen válida', 'error');
      return;
    }

    setLoading(true);
    try {
      for (const photo of validPhotos) {
        const photoData = {
          issue_id: issueId,
          image_url: photo.imageUrl,
          caption: photo.caption || undefined,
          taken_at: new Date().toISOString()
        };

        if (isEdit && photo.id) {
          await updatePhoto(photo.id, photoData);
        } else {
          await uploadPhoto(photoData);
        }
      }
      
      showNotification(
        isEdit ? 'Fotos actualizadas exitosamente' : 'Fotos subidas exitosamente', 
        'success'
      );
      onPhotoUploaded();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar las fotos';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            {isEdit ? 'Editar Fotos' : 'Subir Fotos'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {photos.map((photo, index) => (
              <div key={`${photo.id || 'new'}-${index}`} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    Foto {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removePhotoField(index)}
                    className="text-red-600 hover:text-red-800"
                    title={photo.id ? "Eliminar foto" : "Quitar campo"}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de la Imagen *
                  </label>
                  <input
                    type="url"
                    value={photo.imageUrl}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      photo.imageUrl && !photo.isValidating && !photo.isValid ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {photo.isValidating && (
                    <p className="mt-1 text-sm text-gray-500">
                      Validando imagen...
                    </p>
                  )}
                  {photo.imageUrl && !photo.isValidating && !photo.isValid && (
                    <p className="mt-1 text-sm text-red-600">
                      La URL no es válida o la imagen no se pudo cargar
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={photo.caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe la foto (opcional)"
                  />
                </div>

                {photo.imageUrl && !photo.isValidating && photo.isValid && (
                  <div className="mt-2">
                    <img
                      src={photo.imageUrl}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addPhotoField}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Agregar otra foto
            </button>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || photos.every(p => !p.imageUrl || !p.isValid)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isEdit ? 'Actualizar Fotos' : 'Subir Fotos'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default PhotoUploadModal; 