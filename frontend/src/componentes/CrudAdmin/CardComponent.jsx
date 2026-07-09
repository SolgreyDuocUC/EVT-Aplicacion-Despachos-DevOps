import React from "react";

export const CardComponent = ({ title, description, buttonText, icon, onClick, isActive }) => {
  return (
    <div 
      className={`relative p-8 bg-white/80 backdrop-blur-xl border rounded-2xl shadow-sm transition-all duration-300 flex flex-col h-full overflow-hidden group
        ${isActive 
          ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-teal-500/10 shadow-lg scale-[1.02]' 
          : 'border-slate-200 hover:border-teal-300 hover:shadow-xl hover:-translate-y-1'
        }`}
    >
      {/* Icono de fondo decorativo (Marca de agua) */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-teal-900 group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl shadow-sm ${isActive ? 'bg-teal-50' : 'bg-slate-50 group-hover:bg-teal-50 transition-colors'}`}>
          {icon}
        </div>
        <h5 className="text-xl font-bold tracking-tight text-slate-800">
          {title}
        </h5>
      </div>
      
      <p className="mb-8 text-slate-500 leading-relaxed flex-1">
        {description}
      </p>
      
      <div className="mt-auto">
        <button
          onClick={onClick}
          className={`w-full inline-flex items-center justify-center gap-2 h-12 px-5 text-sm font-bold text-white rounded-xl shadow-md transition-all duration-300
            ${isActive 
              ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30' 
              : 'bg-slate-800 hover:bg-teal-500 hover:shadow-teal-500/30'
            }`}
        >
          <span>{buttonText}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
