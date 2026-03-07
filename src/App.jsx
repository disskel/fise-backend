import React, { useEffect, useState } from 'react';
import { 
  getVentas, importarPortal, 
  getAsesoras, getGrupos, getTecnicos, getObsGenerales 
} from './api/ventasApi';

// Importación de componentes (los crearemos en el siguiente paso)
import VentasTable from './components/VentasTable';
import ImportSummaryModal from './components/ImportSummaryModal';

// Iconos para una interfaz profesional
import { LayoutGrid, FileText, Users, UploadCloud, RefreshCw, Settings, Layers, MessageSquare } from 'lucide-react';

function App() {
  const [view, setView] = useState('ventas');
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  const [catalogos, setCatalogos] = useState({
    asesoras: [], grupos: [], tecnicos: [], observaciones: []
  });

  // Función para cargar ventas desde Render [cite: 13]
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (error) { 
      console.error("Error cargando ventas:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  // Función para cargar tablas maestras (Asesoras, Técnicos, etc.)
  const cargarCatalogos = async () => {
    try {
      const [a, g, t, o] = await Promise.all([
        getAsesoras(), getGrupos(), getTecnicos(), getObsGenerales()
      ]);
      setCatalogos({ asesoras: a, grupos: g, tecnicos: t, observaciones: o });
    } catch (e) { 
      console.error("Error cargando catálogos:", e); 
    }
  };

  useEffect(() => {
    cargarDatos();
    cargarCatalogos();
  }, []);

  // Lógica para el Botón Verde de Importar Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // 'file' es el nombre que espera Multer en el backend

    setLoading(true);
    try { 
      const res = await importarPortal(formData);
      setImportSummary({
        total: res.detalles.total,
        procesados: res.detalles.procesados
      });
      setIsSummaryModalOpen(true);
      await cargarDatos(); 
    } catch (error) { 
      alert("Error en importación: " + (error.response?.data?.error || error.message)); 
    } finally { 
      setLoading(false); 
      e.target.value = ''; 
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 bg-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">F</div>
          <h1 className="text-xl font-bold italic">FISE <span className="text-blue-400 text-xs">Cloud</span></h1>
        </div>
        <nav className="flex-1 mt-4">
          <button onClick={() => setView('ventas')} className={`w-full flex items-center gap-3 px-6 py-4 transition-all ${view === 'ventas' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <FileText size={18}/><span>Ventas Total</span>
          </button>
          <div className="px-6 py-2 mt-4 text-[10px] font-bold text-gray-500 uppercase">Configuración</div>
          <button onClick={() => setView('asesoras')} className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-800">
            <Users size={18}/><span>Asesoras</span>
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
            <span>Inicio</span><span>/</span><span className="text-blue-900">{view}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={cargarDatos} className="p-2 text-gray-400 hover:text-blue-600">
              <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
            </button>
            {view === 'ventas' && (
              <label className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded shadow-md hover:bg-green-700 cursor-pointer transition-all">
                <UploadCloud size={16} /> IMPORTAR PORTAL
                <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls" />
              </label>
            )}
          </div>
        </header>

        <section className="flex-1 p-6 overflow-hidden">
          <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {view === 'ventas' ? (
              <VentasTable data={ventas} />
            ) : (
              <div className="p-20 text-center text-gray-400 italic">Módulo de {view} en desarrollo...</div>
            )}
          </div>
        </section>

        {/* MODAL DE RESUMEN */}
        {isSummaryModalOpen && (
          <ImportSummaryModal 
            isOpen={isSummaryModalOpen} 
            onClose={() => setIsSummaryModalOpen(false)} 
            summary={importSummary} 
          />
        )}
      </main>
    </div>
  );
}

export default App;