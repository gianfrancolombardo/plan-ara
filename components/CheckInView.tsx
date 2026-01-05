import React, { useState, useMemo, useEffect } from 'react';
import { CHECKIN_AREAS } from '../constants';
import { CheckInLog } from '../types';
import { saveCheckInLog, getCheckInLogs } from '../services/storage';
import { CheckCircle, HelpCircle, BarChart3, ArrowLeft, Calendar, TrendingUp, ChevronRight, XCircle, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

// Sub-componente para el Dashboard (Visualización pura, recibe logs como prop)
const HistoryDashboard: React.FC<{ logs: CheckInLog[], onBack: () => void }> = ({ logs, onBack }) => {
  
  const stats = useMemo(() => {
    if (logs.length === 0) return null;

    // 1. Promedio General
    const totalScore = logs.reduce((acc, log) => {
      const values = Object.values(log.scores) as number[];
      if (values.length === 0) return acc;
      const dayTotal = values.reduce((a, b) => a + b, 0);
      return acc + (dayTotal / values.length);
    }, 0);
    const globalAverage = (totalScore / logs.length).toFixed(1);

    // 2. Promedio por Categoría
    const catScores: Record<string, { total: number, count: number }> = {};
    CHECKIN_AREAS.forEach(area => { catScores[area.id] = { total: 0, count: 0 } });

    logs.forEach(log => {
      Object.entries(log.scores).forEach(([key, val]: [string, number]) => {
        if (catScores[key]) {
          catScores[key].total += val;
          catScores[key].count += 1;
        }
      });
    });

    const categoryAverages = Object.entries(catScores).map(([id, data]) => ({
      id,
      name: CHECKIN_AREAS.find(a => a.id === id)?.name || id,
      avg: data.count > 0 ? (data.total / data.count) : 0
    })).sort((a, b) => a.avg - b.avg); // Ordenar de menor a mayor

    // 3. Últimos 7 registros para "El Pulso"
    const recentLogs = logs.slice(0, 7).reverse();

    return { globalAverage, categoryAverages, recentLogs };
  }, [logs]);

  const getScoreColor = (score: number) => {
    if (score >= 2.5) return 'bg-emerald-400 text-white';
    if (score >= 1.8) return 'bg-amber-400 text-white';
    return 'bg-rose-400 text-white';
  };
  
  const getScoreColorText = (score: number) => {
    if (score >= 2.5) return 'text-emerald-600';
    if (score >= 1.8) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="animate-fade-in space-y-8 pb-24">
      <header className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-800">Tu Evolución</h2>
          <p className="text-xs text-stone-500">Perspectiva para ajustar, no para juzgar.</p>
        </div>
      </header>

      {!stats ? (
        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-100">
          <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-3 text-stone-400">
            <BarChart3 size={24} />
          </div>
          <p className="text-stone-600 font-medium">Aún no hay registros suficientes</p>
          <p className="text-stone-400 text-sm mt-1">Completa tu primer Check-in para ver estadísticas.</p>
        </div>
      ) : (
        <>
          {/* Tarjeta Resumen */}
          <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-sm text-stone-500 font-bold uppercase tracking-wider">Bienestar General</span>
              <div className="flex items-end gap-2 mt-1">
                <span className={`text-4xl font-serif font-bold ${getScoreColorText(Number(stats.globalAverage))}`}>
                  {stats.globalAverage}
                </span>
                <span className="text-sm text-stone-400 mb-1">/ 3.0</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${getScoreColor(Number(stats.globalAverage))} bg-opacity-10`}>
              <TrendingUp className={`w-8 h-8 ${getScoreColorText(Number(stats.globalAverage))}`} />
            </div>
          </div>

          {/* El Pulso Semanal */}
          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Pulso Reciente (Últimos días)
            </h3>
            <div className="flex justify-between items-end h-32 bg-white p-4 rounded-xl border border-stone-100">
              {stats.recentLogs.map((log, idx) => {
                const values = Object.values(log.scores) as number[];
                const dayAvg = values.length > 0 
                  ? values.reduce((a, b) => a + b, 0) / values.length
                  : 0;
                const heightPercent = (dayAvg / 3) * 100;
                const dateObj = new Date(log.date);
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 2);

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full flex justify-center h-full items-end">
                       {/* Bar tooltip */}
                       <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                        {dayAvg.toFixed(1)}
                       </div>
                       {/* Bar */}
                       <div 
                        className={`w-3 sm:w-4 rounded-t-full transition-all duration-700 ease-out ${getScoreColor(dayAvg)}`}
                        style={{ height: `${heightPercent}%`, opacity: 0.8 }} 
                       />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">{dayName}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Análisis por Áreas */}
          <div>
            <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Balance por Áreas
            </h3>
            <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              {stats.categoryAverages.map((cat, idx) => (
                <div key={cat.id} className="p-4 border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-stone-700">{cat.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 ${getScoreColorText(cat.avg)}`}>
                      {cat.avg.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(cat.avg)}`}
                      style={{ width: `${(cat.avg / 3) * 100}%`, transitionDelay: `${idx * 100}ms` }}
                    />
                  </div>
                  {cat.avg < 1.8 && (
                    <p className="text-[10px] text-rose-500 mt-1.5 italic animate-fade-in">
                      * Prioridad de cuidado esta semana.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Componente Principal
export const CheckInView: React.FC = () => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry');
  const [history, setHistory] = useState<CheckInLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const todayStr = new Date().toISOString().split('T')[0];

  // Cargar historial y verificar si ya se hizo hoy
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const logs = await getCheckInLogs();
      setHistory(logs);
      
      const todayLog = logs.find(l => l.date === todayStr);
      if (todayLog) {
        setSubmitted(true);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [todayStr]);

  const handleScore = (areaId: string, score: number) => {
    setScores(prev => ({ ...prev, [areaId]: score }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const log: CheckInLog = {
      date: todayStr,
      scores: scores
    };
    await saveCheckInLog(log);
    
    // Recargar historial localmente
    const updatedLogs = [log, ...history.filter(l => l.date !== todayStr)].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(updatedLogs);
    
    setSaving(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400">
         <Loader2 className="w-8 h-8 animate-spin mb-2" />
         <p className="text-sm">Cargando reflexiones...</p>
      </div>
    );
  }

  // Si estamos en modo Historial
  if (viewMode === 'history') {
    return <HistoryDashboard logs={history} onBack={() => setViewMode('entry')} />;
  }

  // Si ya se completó hoy (pantalla de éxito)
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in p-6 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-3">¡Check-in Completado!</h2>
        <p className="text-stone-600 mb-8 max-w-sm">
          Recuerda: Si algo salió en rojo, no te castigues. La pregunta es: "¿Qué obstáculo hubo?" (Cansancio, bebé...). Ajusta la intensidad.
        </p>
        
        <div className="space-y-3 w-full max-w-xs">
          <button 
            onClick={() => setViewMode('history')}
            className="w-full py-3 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Ver mi Evolución
          </button>
          
          <button 
             onClick={() => { setSubmitted(false); }} 
             className="text-stone-400 text-sm hover:text-stone-600"
          >
            Editar respuesta de hoy
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = CHECKIN_AREAS.every(area => scores[area.id] && scores[area.id] > 0);

  // Vista de Formulario (Entrada)
  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-800">Check-in Compasivo</h1>
        <p className="text-stone-500 mt-2 text-sm">
          Puntúa del 1 (Rojo) al 3 (Verde) como termómetro de bienestar.
        </p>
      </header>

      {/* Botón de Acceso al Dashboard */}
       <button 
        onClick={() => setViewMode('history')}
        className="w-full mb-6 flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md hover:border-terra-200 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-stone-100 rounded-lg text-stone-500 group-hover:bg-terra-50 group-hover:text-terra-600 transition-colors">
             <BarChart3 size={20} />
          </div>
          <div className="text-left">
            <span className="block font-bold text-stone-700 text-sm">Ver mi Evolución</span>
            <span className="text-xs text-stone-500">Revisa tu historial y tendencias</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-stone-300 group-hover:text-terra-400" />
      </button>

      <div className="space-y-6">
        {CHECKIN_AREAS.map((area, idx) => (
          <div key={area.id} className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm transition-all hover:shadow-md">
            <h3 className="font-bold text-stone-800 mb-2">{area.name}</h3>
            <p className="text-sm text-stone-600 italic mb-4 opacity-80">"{area.question}"</p>
            
            <div className="flex gap-2">
              {[1, 2, 3].map((val) => {
                let icon = null;
                let label = '';
                
                if (val === 1) { 
                  label = 'Bloqueo';
                  icon = <XCircle size={24} className="mb-1" />;
                }
                if (val === 2) { 
                  label = 'Alerta';
                  icon = <AlertTriangle size={24} className="mb-1" />;
                }
                if (val === 3) { 
                  label = 'Fluido';
                  icon = <CheckCircle2 size={24} className="mb-1" />;
                }
                
                const isSelected = scores[area.id] === val;

                return (
                  <button
                    key={val}
                    onClick={() => handleScore(area.id, val)}
                    className={`
                      flex-1 flex flex-col items-center justify-center py-3 rounded-lg border font-medium text-sm transition-all duration-200
                      ${isSelected 
                        ? (val===1 ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200' : val===2 ? 'bg-amber-400 text-white border-amber-500 shadow-amber-200' : 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200') 
                        : (val===1 ? 'bg-white hover:bg-rose-50 border-stone-200 text-stone-400 hover:text-rose-500' : val===2 ? 'bg-white hover:bg-amber-50 border-stone-200 text-stone-400 hover:text-amber-500' : 'bg-white hover:bg-emerald-50 border-stone-200 text-stone-400 hover:text-emerald-500')
                      }
                      ${isSelected ? 'scale-105 shadow-md ring-2 ring-offset-1 ring-white' : 'hover:border-stone-300'}
                    `}
                  >
                    {icon}
                    <span className="text-[10px] uppercase font-bold tracking-wide">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-6 pointer-events-none z-20">
        <button
          disabled={!allAnswered || saving}
          onClick={handleSubmit}
          className={`
            w-full pointer-events-auto py-4 rounded-xl font-bold shadow-lg transition-all duration-500 transform flex items-center justify-center gap-2
            ${allAnswered 
              ? 'bg-stone-800 text-white translate-y-0 opacity-100 hover:bg-stone-700 hover:scale-[1.02]' 
              : 'bg-stone-300 text-stone-500 translate-y-10 opacity-0'
            }
          `}
        >
          {saving ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" /> Guardando...
             </>
          ) : (
            'Guardar Reflexión'
          )}
        </button>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl flex gap-3 items-start border border-blue-100">
        <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-bold mb-1">Guía de Colores:</p>
          <ul className="list-disc list-inside space-y-1 opacity-90 text-xs">
            <li><strong>Verde (3):</strong> Fluido. Sigue así.</li>
            <li><strong>Amarillo (2):</strong> Alerta. Requiere atención leve.</li>
            <li><strong>Rojo (1):</strong> Bloqueo. Pide ayuda o reduce carga.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};