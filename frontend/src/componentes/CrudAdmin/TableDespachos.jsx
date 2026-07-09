import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";
import { TrashIcon } from "@heroicons/react/24/outline";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const despacho = async () => {
    await axios
      .get("http://localhost:8081/api/v1/despachos", {
        headers:{
              'Content-Type': 'application/json',
              'Accept': 'application/json'
        }
      })
      .then((response) => {
        console.log(response.data);
        setDespachos(response.data);
      });
  };
  
  useEffect(() => {
    despacho();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  const handleEliminarDespacho = async (idDespacho) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar despacho?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e11d48",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8081/api/v1/despachos/${idDespacho}`);
      setDespachos(despachos.filter((d) => d.idDespacho !== idDespacho));
      Swal.fire({
        title: "Despacho eliminado",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al eliminar despacho:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar eliminar el despacho.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Órdenes de Despacho Activas</h3>
            <p className="text-sm text-slate-500 mt-1">Listado de despachos en curso, entregados o con intentos fallidos.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">N° Despacho</th>
                <th className="px-6 py-4">N° Compra</th>
                <th className="px-6 py-4">Dirección</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Patente</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Intentos</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {despachos.map((despachoItem) => (
                <tr key={despachoItem.idDespacho} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    #{despachoItem.idDespacho}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    #{despachoItem.idCompra}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {despachoItem.direccionCompra}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {despachoItem.fechaDespacho}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono">
                    <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs">{despachoItem.patenteCamion}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${despachoItem.despachado 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                      {despachoItem.despachado ? "Entregado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`font-bold ${despachoItem.intento > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {despachoItem.intento}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleAbrirModal(despachoItem)}
                      disabled={despachoItem.despachado}
                      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        ${despachoItem.despachado 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm transform active:scale-95'
                        }`}
                    >
                      {despachoItem.despachado ? 'Cerrado' : 'Gestionar'}
                    </button>
                    <button
                      onClick={() => handleEliminarDespacho(despachoItem.idDespacho)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar Despacho"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {despachos.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    No hay registros de despachos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        onClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
      >
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              despacho();
            }}
          />
        )}
      </Modal>
    </>
  );
};
