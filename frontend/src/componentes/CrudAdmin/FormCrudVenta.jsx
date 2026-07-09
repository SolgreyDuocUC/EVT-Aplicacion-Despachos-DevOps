import { useState, useEffect } from "react";
import axios from "axios";

export const FormCrudVenta = ({ onSuccess, onClose, ventaAEditar }) => {
  const isEditing = !!ventaAEditar;
  
  const [formData, setFormData] = useState({
    direccionCompra: "",
    valorCompra: "",
    fechaCompra: new Date().toISOString().split('T')[0],
    despachoGenerado: false
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        direccionCompra: ventaAEditar.direccionCompra,
        valorCompra: ventaAEditar.valorCompra,
        fechaCompra: ventaAEditar.fechaCompra,
        despachoGenerado: ventaAEditar.despachoGenerado
      });
    }
  }, [ventaAEditar, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/v1/ventas/${ventaAEditar.idVenta}`, formData, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert("Venta actualizada con éxito");
      } else {
        await axios.post("/api/v1/ventas", formData, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert("Venta creada con éxito");
      }
      onSuccess();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar la venta.");
    }
  };

  return (
    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
          <h3 className="text-xl font-bold leading-6 text-slate-900 mb-6 border-b pb-2 border-slate-100">
            {isEditing ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccionCompra"
                value={formData.direccionCompra}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Ej. Av. Siempreviva 742"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 text-left mb-1">
                Valor Total ($)
              </label>
              <input
                type="number"
                name="valorCompra"
                value={formData.valorCompra}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Ej. 25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 text-left mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="fechaCompra"
                value={formData.fechaCompra}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="despachoGenerado"
                checked={formData.despachoGenerado}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Despacho ya generado
              </label>
            </div>

            <div className="mt-8 sm:flex sm:flex-row-reverse border-t border-slate-100 pt-4">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-500 sm:ml-3 sm:w-auto"
              >
                {isEditing ? "Guardar Cambios" : "Crear Compra"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
