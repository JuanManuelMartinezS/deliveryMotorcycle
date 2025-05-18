import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useMenuStore } from '../../store/useMenuStore';
import { useProductStore } from '../../store/useProductStore';

interface MenuFormProps {
  isEdit?: boolean;
}

const MenuForm: React.FC<MenuFormProps> = ({ isEdit = false }) => {
  const { restaurantId, id } = useParams<{ restaurantId: string; id: string }>();
  const { 
    addMenu, 
    editMenu,
    fetchMenuById,
    currentMenu,
    setCurrentMenu,
    loading,
    error
  } = useMenuStore();
  const { products, fetchProducts } = useProductStore();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    product_id: Yup.number()
      .required('El producto es requerido')
      .min(1, 'Seleccione un producto válido'),
    price: Yup.number()
      .required('El precio es requerido')
      .min(0, 'El precio no puede ser negativo')
      .typeError('Debe ser un número válido'),
    availability: Yup.boolean()
      .required('La disponibilidad es requerida')
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchMenuById(parseInt(id));
    } else {
      setCurrentMenu(null);
    }
    fetchProducts();
  }, [isEdit, id, fetchMenuById, setCurrentMenu, fetchProducts]);

  const initialValues = {
    product_id: currentMenu?.product_id || '',
    price: currentMenu?.price || 0,
    availability: currentMenu?.availability ?? true,
    restaurant_id: restaurantId ? parseInt(restaurantId) : 0
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEdit && id) {
        await editMenu(parseInt(id), { ...values, product_id: Number(values.product_id) });
        showNotification('Ítem del menú actualizado exitosamente', 'success');
      } else {
        await addMenu({ ...values, product_id: Number(values.product_id) });
        showNotification('Ítem del menú creado exitosamente', 'success');
      }
      navigate(`/menus/${restaurantId}`);
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/menus/${restaurantId}`)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Volver al menú
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Ítem del Menú' : 'Nuevo Ítem del Menú'}
        </h1>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="bg-white shadow-md rounded-lg p-6">
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <Field
                  as="select"
                  name="product_id"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.product_id && touched.product_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${product.price})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="product_id" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
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
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilidad *
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <Field 
                      type="radio" 
                      name="availability" 
                      checked={values.availability === true}
                      onChange={() => setFieldValue("availability", true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Disponible</span>
                  </label>
                  <label className="inline-flex items-center">
                    <Field 
                      type="radio" 
                      name="availability" 
                      checked={values.availability === false}
                      onChange={() => setFieldValue("availability", false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No disponible</span>
                  </label>
                </div>
                <ErrorMessage name="availability" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/menus/${restaurantId}`)}
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
                  {isEdit ? 'Actualizar Ítem' : 'Crear Ítem'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MenuForm;