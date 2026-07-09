import React from "react";
import logo1 from "../../assets/images/logo2.png";

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-center w-full mt-12 rounded-2xl shadow-xl overflow-hidden relative">
      {/* Elemento decorativo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500"></div>
      
      <div className="mx-auto w-full max-w-screen-xl p-8 py-10 lg:py-12">
        <div className="md:flex md:justify-between items-center">
          <div className="mb-8 md:mb-0 flex flex-col items-center md:items-start">
            <a href="#" className="flex items-center group">
              <div className="flex justify-center p-2 bg-slate-800/50 rounded-2xl border border-slate-700/50 group-hover:border-teal-500/50 transition-all duration-300">
                <img src={logo1} alt="Logo" className="w-16 h-16 object-contain" />
              </div>
            </a>
            <p className="text-slate-400 mt-4 text-sm max-w-xs text-center md:text-left">
              Soluciones logísticas eficientes y seguras para tu negocio.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3 text-left">
            <div>
              <h2 className="mb-4 text-sm font-bold text-slate-200 uppercase tracking-wider">
                Condiciones servicio
              </h2>
              <ul className="text-slate-400 text-sm space-y-3">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    Embalaje
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    Cobertura
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-bold text-slate-200 uppercase tracking-wider">
                Síguenos
              </h2>
              <ul className="text-slate-400 text-sm space-y-3">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-bold text-slate-200 uppercase tracking-wider">
                Legal
              </h2>
              <ul className="text-slate-400 text-sm space-y-3">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors duration-200 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-slate-500 sm:text-center flex items-center gap-1">
            © {new Date().getFullYear()}
            <a href="#" className="font-semibold text-slate-300 hover:text-white hover:underline transition-colors">
              ITPCARGO™
            </a>
            . Todos los derechos reservados.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <span className="text-xs text-slate-600">v2.0 Dashboard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
