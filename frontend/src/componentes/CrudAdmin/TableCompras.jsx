import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import { FormVenta } from "./FormVenta";
import axios from "axios";
import Swal from "sweetalert2";
import { TrashIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);

  const compras = async () => {
    await axios.get("http://localhost:8082/api/v1/ventas", {
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
  }
    }).then((response) => {
      console.log(response.data);
      setVentas(response.data);
    });
  };

  useEffect(() => {
    compras();
  }, []);

  // Modal para generar despacho a partir de una venta
  const [openModalDespacho, setOpenModalDespacho] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const handleAbrirModalDespacho = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModalDespacho(true);
  };

  // Modal para crear/editar una venta
  const [openModalVenta, setOpenModalVenta] = useState(false);
  const [ventaEnEdicion, setVentaEnEdicion] = useState(null);

  const handleAbrirModalCrearVenta = () => {
    setVentaEnEdicion(null);
    setOpenModalVenta(true);
  };

  const handleAbrirModalEditarVenta = (venta) => {
    setVentaEnEdicion(venta);
    setOpenModalVenta(true);
  };

  const handleEliminarVenta = async (idVenta) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar venta?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e11d48",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8082/api/v1/ventas/${idVenta}`);
      setVentas(ventas.filter((v) => v.idVenta !== idVenta));
      Swal.fire({
        title: "Venta eliminada",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al intentar eliminar la venta.",
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
            <h3 className="text-lg font-bold text-slate-800">Órdenes de Compra</h3>
            <p className="text-sm text-slate-500 mt-1">Gestiona las ventas registradas y genera despachos.</p>
          </div>
          <button
            onClick={handleAbrirModalCrearVenta}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all duration-200 transform active:scale-95"
          >
            <PlusIcon className="w-4 h-4" />
            Nueva Venta
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">N° Orden</th>
                <th className="px-6 py-4">Dirección</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ventas.map((venta) => (
                  <tr key={venta.idVenta} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      #{venta.idVenta}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {venta.direccionCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {venta.fechaCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-emerald-600">
                      ${venta.valorCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${venta.despachoGenerado
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {venta.despachoGenerado ? "Despachada" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleAbrirModalDespacho(venta)}
                        disabled={venta.despachoGenerado}
                        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 transform active:scale-95
                          ${venta.despachoGenerado
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'text-white bg-teal-500 hover:bg-teal-600 shadow-teal-500/20'
                          }`}
                      >
                        Generar Despacho
                      </button>
                      <button
                        onClick={() => handleAbrirModalEditarVenta(venta)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar Venta"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEliminarVenta(venta.idVenta)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar Venta"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No hay ventas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        onClose={() => {
          setOpenModalDespacho(false);
        }}
        open={openModalDespacho}
      >
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => {
              setOpenModalDespacho(false);
              compras();
            }}
          />
        )}
      </Modal>

      <Modal
        onClose={() => {
          setOpenModalVenta(false);
        }}
        open={openModalVenta}
      >
        <FormVenta
          venta={ventaEnEdicion}
          onClose={() => {
            setOpenModalVenta(false);
            compras();
          }}
        />
      </Modal>
    </>
  );
};
