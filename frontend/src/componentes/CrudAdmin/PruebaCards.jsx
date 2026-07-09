import { useState } from "react";
import { CardComponent } from "./CardComponent";
import { TableCompras } from "./TableCompras";
import { TableDespachos } from "./TableDespachos";
import { ShoppingCartIcon, TruckIcon } from "@heroicons/react/24/outline";

export const PruebaCards = () => {
  const [tablaCompras, setTablaCompras] = useState(false);
  const [tablaOrdenes, setTablaOrdenes] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="animate-fade-in-up">
      {/* Contenedor de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <CardComponent
          title="Órdenes de Compra"
          description="Revisa las últimas órdenes realizadas y genera nuevos despachos."
          buttonText="Consultar Compras"
          icon={<ShoppingCartIcon className="w-8 h-8 text-teal-500" />}
          isActive={tablaCompras}
          onClick={() => {
            setTablaCompras(true);
            setTablaOrdenes(false);
            setRefreshKey((prev) => prev + 1);
          }}
        />
        <CardComponent
          title="Órdenes de Despacho"
          description="Consulta despachos activos, modifica intentos o cierra órdenes."
          buttonText="Consultar Despachos"
          icon={<TruckIcon className="w-8 h-8 text-emerald-500" />}
          isActive={tablaOrdenes}
          onClick={() => {
            setTablaCompras(false);
            setTablaOrdenes(true);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      </div>

      {/* Contenedor de Tablas con transición simple */}
      <section className="transition-all duration-500 ease-in-out">
        {tablaCompras && (
          <div className="animate-fade-in">
            <TableCompras key={`compras-${refreshKey}`} />
          </div>
        )}
        {tablaOrdenes && (
          <div className="animate-fade-in">
            <TableDespachos key={`despachos-${refreshKey}`} />
          </div>
        )}
      </section>
    </section>
  );
};
