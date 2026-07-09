import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import { PruebaCards } from "./CrudAdmin/PruebaCards";

export const CrudAdmin = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar fijo */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden relative">
        {/* Fondo decorativo opcional */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none -z-10"></div>
        
        <main className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Panel de <span className="text-teal-600">Control</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Gestiona los despachos y compras de ITPCARGO.
            </p>
          </header>

          <PruebaCards />
        </main>
        
        <div className="px-8 md:px-12 pb-8 max-w-7xl mx-auto w-full mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
};
