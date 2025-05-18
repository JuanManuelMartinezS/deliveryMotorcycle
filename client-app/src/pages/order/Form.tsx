import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useNotification } from '../../hooks/useNotification';
import { useOrderNotification } from '../../hooks/useOrderNotification';
import { OrderStatus } from '../../models/OrderModel';
import { useMenuStore } from '../../store/useMenuStore';
import { useMotorcycleStore } from '../../store/useMotorcycleStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useRestaurantStore } from '../../store/useRestaurantStore';
import { useAddressStore } from '../../store/useAddressStore';
import { Address } from '../../models/AddressModel';
import Swal from 'sweetalert2';

interface OrderFormProps {
  isEdit?: boolean;
}

interface AddressFormValues {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  additional_info?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ isEdit = false }) => {
  const { customerId, id } = useParams<{ customerId: string; id: string }>();
  const { 
    addOrder, 
    editOrder,
    fetchOrderById,
    currentOrder,
    setCurrentOrder,
    loading,
    error
  } = useOrderStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const { menus, fetchMenus } = useMenuStore();
  const { motorcycles, fetchMotorcycles } = useMotorcycleStore();
  const { addresses, fetchAddresses, addAddress, loading: addressLoading } = useAddressStore();
  const { showNotification } = useNotification();
  const { notifyNewOrder } = useOrderNotification();
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | ''>('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const addressValidationSchema = Yup.object().shape({
    street: Yup.string().required('La calle es requerida'),
    city: Yup.string().required('La ciudad es requerida'),
    state: Yup.string().required('El estado es requerido'),
    postal_code: Yup.string()
      .required('El código postal es requerido')
      .matches(/^\d+$/, 'El código postal debe contener solo números')
      .min(4, 'El código postal debe tener al menos 4 dígitos'),
    additional_info: Yup.string()
  });

  const orderValidationSchema = Yup.object().shape({
    menu_id: Yup.number()
      .required('El menú es requerido')
      .min(1, 'Seleccione un menú válido'),
    quantity: Yup.number()
      .required('La cantidad es requerida')
      .min(1, 'La cantidad debe ser al menos 1')
      .integer('La cantidad debe ser un número entero'),
    motorcycle_id: Yup.number()
      .nullable(),
    notes: Yup.string()
      .nullable()
      .max(500, 'Las notas no pueden exceder los 500 caracteres')
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchOrderById(parseInt(id));
    } else {
      setCurrentOrder(null);
    }
    fetchRestaurants();
    fetchMotorcycles();
    fetchAddresses();
  }, [isEdit, id, fetchOrderById, setCurrentOrder, fetchRestaurants, fetchMotorcycles, fetchAddresses]);

  useEffect(() => {
    if (currentOrder?.menu?.restaurant?.id) {
      setSelectedRestaurant(currentOrder.menu.restaurant.id);
      fetchMenus(currentOrder.menu.restaurant.id);
    }
  }, [currentOrder, fetchMenus]);

  const initialValues = {
    menu_id: currentOrder?.menu_id || 0,
    quantity: currentOrder?.quantity || 1,
    motorcycle_id: currentOrder?.motorcycle_id || null,
    customer_id: customerId ? parseInt(customerId) : 0
  };

  const handleOrderSubmit = async (values: {
    menu_id: number;
    quantity: number;
    motorcycle_id: number | null;
    customer_id: number;
  }) => {
    try {
      // Encontrar el menú seleccionado para calcular el precio total
      const selectedMenu = menus.find(menu => menu.id === values.menu_id);
      if (!selectedMenu) {
        throw new Error('No se encontró el menú seleccionado');
      }

      const orderData = {
        menu_id: values.menu_id,
        quantity: values.quantity,
        motorcycle_id: values.motorcycle_id,
        customer_id: values.customer_id,
        total_price: selectedMenu.price * values.quantity,
        status: 'pending' as OrderStatus
      };

      if (isEdit && id) {
        await editOrder(parseInt(id), orderData);
        showNotification('Orden actualizada exitosamente', 'success');
        navigate(`/customers/${customerId}/orders`);
      } else {
        // Crear la orden primero
        const newOrder = await addOrder(orderData);
        // Guardar el ID de la orden y mostrar el modal de dirección
        setOrderData({ ...orderData, id: newOrder.id });
        setShowAddressModal(true);
      }
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  const handleAddressSubmit = async (values: AddressFormValues) => {
    if (!orderData?.id) {
      showNotification('Error: No se encontró la orden', 'error');
      return;
    }

    try {
      const newAddress = await addAddress({
        ...values,
        order_id: orderData.id,
        postal_code: parseInt(values.postal_code)
      });
      setSelectedAddress(newAddress);
      setShowAddressModal(false);

      // Notificar sobre el nuevo pedido si tiene motociclista asignado
      if (orderData.motorcycle_id) {
        const motorcycle = motorcycles.find(m => m.id === orderData.motorcycle_id);
        const menu = menus.find(m => m.id === orderData.menu_id);
        const message = `Nuevo pedido #${orderData.id} asignado a ${motorcycle?.brand} ${motorcycle?.license_plate} - ${menu?.product?.name} x${orderData.quantity} - Dirección: ${values.street}, ${values.city}`;
        notifyNewOrder(orderData.id, message);
      }

      showNotification('Dirección agregada exitosamente', 'success');
      navigate(`/customers/${customerId}/orders`);
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
      showNotification(errorMessage, 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Modal de dirección
  const AddressModal = () => {
    const [tempSelectedAddress, setTempSelectedAddress] = useState<Address | null>(null);

    // Función para obtener direcciones únicas basadas en calle, ciudad y estado
    const getUniqueAddresses = () => {
      const uniqueAddresses = new Map<string, Address>();
      
      addresses.forEach(address => {
        // Crear una clave única basada en calle, ciudad y estado
        const key = `${address.street.toLowerCase()}-${address.city.toLowerCase()}-${address.state.toLowerCase()}`;
        
        // Solo guardar la primera ocurrencia de esta dirección
        if (!uniqueAddresses.has(key)) {
          uniqueAddresses.set(key, address);
        }
      });
      
      return Array.from(uniqueAddresses.values());
    };

    const uniqueAddresses = getUniqueAddresses();

    const handleConfirmAddress = async () => {
      if (!tempSelectedAddress || !orderData?.id) {
        showNotification('Error: No se encontró la dirección o la orden', 'error');
        return;
      }

      try {
        // Crear una nueva dirección basada en la seleccionada pero con el nuevo order_id
        const newAddress = await addAddress({
          street: tempSelectedAddress.street,
          city: tempSelectedAddress.city,
          state: tempSelectedAddress.state,
          postal_code: tempSelectedAddress.postal_code,
          additional_info: tempSelectedAddress.additional_info,
          order_id: orderData.id
        });
        setSelectedAddress(newAddress);
        setShowAddressModal(false);

        // Notificar sobre el nuevo pedido si tiene motociclista asignado
        if (orderData.motorcycle_id) {
          const motorcycle = motorcycles.find(m => m.id === orderData.motorcycle_id);
          const menu = menus.find(m => m.id === orderData.menu_id);
          const message = `Nuevo pedido #${orderData.id} asignado a ${motorcycle?.brand} ${motorcycle?.license_plate} - ${menu?.product?.name} x${orderData.quantity} - Dirección: ${tempSelectedAddress.street}, ${tempSelectedAddress.city}`;
          notifyNewOrder(orderData.id, message);
        }

        showNotification('Dirección agregada exitosamente', 'success');
        navigate(`/customers/${customerId}/orders`);
      } catch (err) {
        const errorMessage = (err as any)?.response?.data?.message || (err instanceof Error ? err.message : String(err));
        showNotification(errorMessage, 'error');
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {uniqueAddresses.length > 0 ? 'Seleccionar o crear dirección' : 'Crear nueva dirección'}
            </h3>

            {uniqueAddresses.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Direcciones existentes
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={tempSelectedAddress?.id || ''}
                  onChange={(e) => {
                    const addressId = parseInt(e.target.value);
                    if (addressId) {
                      const address = uniqueAddresses.find(a => a.id === addressId);
                      setTempSelectedAddress(address || null);
                    } else {
                      setTempSelectedAddress(null);
                    }
                  }}
                >
                  <option value="">Seleccione una dirección</option>
                  {uniqueAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.street}, {address.city}, {address.state}
                    </option>
                  ))}
                </select>

                {tempSelectedAddress && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Dirección seleccionada:</h4>
                    <p className="text-sm text-gray-600">{tempSelectedAddress.street}</p>
                    <p className="text-sm text-gray-600">{tempSelectedAddress.city}, {tempSelectedAddress.state}</p>
                    <p className="text-sm text-gray-600">Código Postal: {tempSelectedAddress.postal_code}</p>
                    {tempSelectedAddress.additional_info && (
                      <p className="text-sm text-gray-600">Info adicional: {tempSelectedAddress.additional_info}</p>
                    )}
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setTempSelectedAddress(null)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmAddress}
                        className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Confirmar Dirección
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(!tempSelectedAddress && uniqueAddresses.length > 0) && (
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  O crear una nueva dirección
                </h4>
                <Formik
                  initialValues={{
                    street: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    additional_info: ''
                  }}
                  validationSchema={addressValidationSchema}
                  onSubmit={handleAddressSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                          Calle *
                        </label>
                        <Field
                          name="street"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.street && touched.street ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="street" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          Ciudad *
                        </label>
                        <Field
                          name="city"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          Estado *
                        </label>
                        <Field
                          name="state"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                          Código Postal *
                        </label>
                        <Field
                          name="postal_code"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.postal_code && touched.postal_code ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="postal_code" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700">
                          Información Adicional
                        </label>
                        <Field
                          name="additional_info"
                          as="textarea"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={addressLoading}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {addressLoading ? 'Guardando...' : 'Guardar Dirección'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {!uniqueAddresses.length && (
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Nueva dirección
                </h4>
                <Formik
                  initialValues={{
                    street: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    additional_info: ''
                  }}
                  validationSchema={addressValidationSchema}
                  onSubmit={handleAddressSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                          Calle *
                        </label>
                        <Field
                          name="street"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.street && touched.street ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="street" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          Ciudad *
                        </label>
                        <Field
                          name="city"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          Estado *
                        </label>
                        <Field
                          name="state"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                          Código Postal *
                        </label>
                        <Field
                          name="postal_code"
                          type="text"
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                            errors.postal_code && touched.postal_code ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <ErrorMessage name="postal_code" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700">
                          Información Adicional
                        </label>
                        <Field
                          name="additional_info"
                          as="textarea"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={addressLoading}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {addressLoading ? 'Guardando...' : 'Guardar Dirección'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressModal(false);
                    setTempSelectedAddress(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/customers/${customerId}/orders`)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Volver a órdenes
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar Orden' : 'Nueva Orden'}
        </h1>
        
        {isEdit && currentOrder && (
          <div className="mb-6 bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Estado actual:</h2>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status === 'pending' && 'Pendiente'}
                {currentOrder.status === 'preparing' && 'Preparando'}
                {currentOrder.status === 'ready' && 'Listo'}
                {currentOrder.status === 'delivered' && 'Entregado'}
                {currentOrder.status === 'cancelled' && 'Cancelado'}
              </span>
            </div>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={orderValidationSchema}
          onSubmit={handleOrderSubmit}
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
                <label htmlFor="restaurant" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurante *
                </label>
                <select
                  name="restaurant"
                  value={selectedRestaurant}
                  onChange={(e) => {
                    const restaurantId = e.target.value ? parseInt(e.target.value) : '';
                    setSelectedRestaurant(restaurantId);
                    setFieldValue('menu_id', '');
                    if (restaurantId) {
                      fetchMenus(restaurantId);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    !selectedRestaurant && touched.menu_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione un restaurante</option>
                  {restaurants.map((restaurant) => (
                    <option key={`restaurant-${restaurant.id}`} value={restaurant.id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                {!selectedRestaurant && touched.menu_id && (
                  <div className="text-red-500 text-sm mt-1">Debe seleccionar un restaurante</div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="menu_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Menú *
                </label>
                <Field
                  as="select"
                  name="menu_id"
                  disabled={!selectedRestaurant}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.menu_id && touched.menu_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={values.menu_id}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue('menu_id', Number(e.target.value));
                  }}
                >
                  <option value="0">Seleccione un menú</option>
                  {menus.map((menu) => (
                    <option key={`menu-${menu.id}`} value={menu.id}>
                      {menu.product?.name} - ${menu.price}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="menu_id" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad *
                </label>
                <Field
                  name="quantity"
                  type="number"
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="motorcycle_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Motocicleta (opcional)
                </label>
                <Field
                  as="select"
                  name="motorcycle_id"
                  value={values.motorcycle_id || ''}
                  onChange={(e) => {
                    setFieldValue('motorcycle_id', e.target.value ? Number(e.target.value) : null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione una motocicleta (opcional)</option>
                  {motorcycles.map((motorcycle) => (
                    <option key={`motorcycle-${motorcycle.id}`} value={motorcycle.id}>
                      {motorcycle.brand} {motorcycle.year} - {motorcycle.license_plate}
                    </option>
                  ))}
                </Field>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(`/customers/${customerId}/orders`)}
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
                  {isEdit ? 'Actualizar Orden' : 'Crear Orden'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {showAddressModal && <AddressModal />}
    </div>
  );
};

export default OrderForm;