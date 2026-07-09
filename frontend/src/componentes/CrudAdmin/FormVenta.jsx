import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormVenta = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();
  const esEdicion = Boolean(venta);

  const onSubmit = async (data) => {
    const jsonData = {
      ...venta,
      direccionCompra: data.direccionCompra,
      valorCompra: data.valorCompra,
      fechaCompra: data.fechaCompra,
      despachoGenerado: esEdicion ? venta.despachoGenerado : false,
    };

    try {
      if (esEdicion) {
        await axios.put(
          `http://localhost:8082/api/v1/ventas/${venta.idVenta}`,
          jsonData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      } else {
        await axios.post("http://localhost:8082/api/v1/ventas", jsonData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }
      Swal.fire({
        title: esEdicion ? "Venta actualizada 📝" : "Venta registrada 🛒",
        text: esEdicion
          ? "La venta se actualizó exitosamente"
          : "La venta se registró exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la venta. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center text-center px-24 text-xl"
    >
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">
        {esEdicion ? "Editar venta" : "Registrar nueva venta"}
      </div>
      <div className="mb-5">
        <label className="block font-bold mb-2">Dirección de compra</label>
        <input
          type="text"
          placeholder="Ingresa la dirección de entrega"
          defaultValue={venta?.direccionCompra}
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("direccionCompra", { required: true })}
        />
      </div>
      <div className="mb-5">
        <label className="block font-bold mb-2">Valor de compra</label>
        <input
          type="number"
          placeholder="Ingresa el valor de la compra"
          defaultValue={venta?.valorCompra}
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("valorCompra", { required: true, valueAsNumber: true })}
        />
      </div>
      <div className="mb-5">
        <label className="block font-bold mb-2">Fecha de compra</label>
        <input
          type="date"
          defaultValue={venta?.fechaCompra}
          className="border border-gray-300 rounded-lg block w-full p-1"
          {...register("fechaCompra", { required: true })}
        />
      </div>

      <button
        className="py-6 px-14 rounded-lg bg-teal-600 text-white font-bold mb-14"
        type="submit"
      >
        {esEdicion ? "Guardar cambios" : "Registrar venta"}
      </button>
    </form>
  );
};
