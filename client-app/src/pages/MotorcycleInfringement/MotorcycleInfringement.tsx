import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInfringements, createMotorcycleInfringement } from '../../services/motorcycleInfringementService';
import { useNotification } from '../../hooks/useNotification';
import { infringement } from '../../models/Infringement';
import Swal from 'sweetalert2';

const MotorcycleInfringementForm: React.FC = () => {
  const { id, license_plate, year } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [infringements, setInfringements] = useState<infringement[]>([]);
  const [selectedInfringement, setSelectedInfringement] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInfringements().then(setInfringements).catch(() => setInfringements([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedInfringement || !fecha) {
    showNotification('Todos los campos son obligatorios', 'error');
    return;
  }
  setLoading(true);
  try {
    if (!id) {
      showNotification('ID de motocicleta no válido', 'error');
      setLoading(false);
      return;
    }
    
    const result = await createMotorcycleInfringement({
      idMotorcycle: Number(id),
      idInfringement: Number(selectedInfringement),
      fecha,
    });
    
    await Swal.fire({
      title: '¡Éxito!',
      text: 'La infracción ha sido registrada correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
    
    showNotification('Infracción creada exitosamente', 'success');
    navigate(-1);
  } catch (err) {
    const errorMessage = (err as any)?.message || 'Error al crear la infracción';
    
    await Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    
    showNotification(errorMessage, 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registrar Infracción</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Placa</label>
          <input type="text" value={license_plate} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block text-gray-700">Año</label>
          <input type="text" value={year} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block text-gray-700">Fecha</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={e => setFecha(e.target.value)} 
            className="w-full border rounded px-3 py-2" 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700">Infracción</label>
          <select 
            value={selectedInfringement} 
            onChange={e => setSelectedInfringement(e.target.value)} 
            className="w-full border rounded px-3 py-2" 
            required
          >
            <option value="">Seleccione una infracción</option>
            {infringements.map((inf) => (
              <option key={inf.id} value={inf.id}>{inf.name}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Guardando...' : 'Registrar Infracción'}
        </button>
      </form>
    </div>
  );
};

export default MotorcycleInfringementForm;