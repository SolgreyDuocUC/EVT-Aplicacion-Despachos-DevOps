import { HomeIcon, CubeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

function Navbar() {
  return (
    <nav className="w-[280px] min-h-screen bg-slate-900 text-slate-300 sticky top-0 flex flex-col shadow-2xl z-10">
      {/* Contenedor del Logo */}
      <div className="p-6 bg-slate-950/50 border-b border-slate-800">
        <h2 className="text-2xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          ITPCARGO
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Dashboard</p>
      </div>

      {/* Menú de navegación */}
      <div className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 font-medium py-3 px-4 hover:bg-teal-500/10 hover:text-teal-400 rounded-xl transition-all duration-300 group"
            >
              <HomeIcon className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              Inicio / Usuarios
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 font-medium py-3 px-4 hover:bg-teal-500/10 hover:text-teal-400 rounded-xl transition-all duration-300 group"
            >
              <CubeIcon className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              Productos
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 font-medium py-3 px-4 hover:bg-teal-500/10 hover:text-teal-400 rounded-xl transition-all duration-300 group"
            >
              <Cog6ToothIcon className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
              Configuración
            </a>
          </li>
        </ul>
      </div>
      
      {/* Perfil Usuario (opcional) */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
            AD
          </div>
          <div>
            <p className="text-sm font-bold text-white">Admin</p>
            <p className="text-xs text-slate-500">admin@itpcargo.cl</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
