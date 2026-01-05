import { DayConfig, QuarterConfig, CheckInArea, DailyTask } from './types';

export const DAYS_CONFIG: Record<number, DayConfig> = {
  1: { // Monday
    name: 'Lunes',
    focus: 'Arranque',
    mantra: 'Aterrizar y organizar',
    description: 'No te exijas máxima creatividad. Organiza la semana, correos y ofertas.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  2: { // Tuesday
    name: 'Martes',
    focus: 'Estudio Puro',
    mantra: 'Proteger el Bloque Roca',
    description: 'Día fuerte. Tu hora de estudio/CV es sagrada como una cita médica.',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  3: { // Wednesday
    name: 'Miércoles',
    focus: 'Logística',
    mantra: 'Sostener la casa',
    description: 'Mitad de semana. Abastecer nevera y Batch Cooking ligero.',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  4: { // Thursday
    name: 'Jueves',
    focus: 'Relaciones',
    mantra: 'Conexión mental',
    description: 'Día fuerte de estudio, pero la prioridad mental es la cita con G.',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  5: { // Friday
    name: 'Viernes',
    focus: 'Cierre',
    mantra: 'Bajar la persiana',
    description: 'Cierre administrativo. Descanso real sin sustancias.',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  6: { // Saturday
    name: 'Sábado',
    focus: 'Familia / Ocio',
    mantra: 'Presencia plena',
    description: 'Comer fuera o libre. Paseo largo.',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  0: { // Sunday
    name: 'Domingo',
    focus: 'Reset & Plan',
    mantra: 'Preparar el terreno',
    description: 'Cocinar y agenda para una semana tranquila. Check-in compasivo.',
    color: 'bg-stone-200 text-stone-800 border-stone-300',
  },
};

export const QUARTERS: QuarterConfig[] = [
  {
    id: 'Q1',
    name: 'Q1: ENE - MAR',
    months: 'Enero - Marzo',
    focus: 'Siembre Autonomía',
    goals: [
      'Empleo: CV listo, LinkedIn activo, 3 ofertas/semana',
      'Estudio: 45 min/día enfocados',
      'Claridad: Eliminar CBD y Alcohol'
    ],
    habits: ['Medicación + Agua (AM)', 'Bloque de Estudio/CV', 'Ritual nocturno sin sustancias']
  },
  {
    id: 'Q2',
    name: 'Q2: ABR - JUN',
    months: 'Abril - Junio',
    focus: 'Expansión y Movimiento',
    goals: [
      'Economía: Entrevistas y curso',
      'Cuerpo: Caminatas y fuerza',
      'Social: Citas con G. sin alcohol'
    ],
    habits: ['Ejercicio de Fuerza (2x semana)', 'Citas quincenales', 'Yoga diario']
  },
  {
    id: 'Q3',
    name: 'Q3: JUL - SEP',
    months: 'Julio - Septiembre',
    focus: 'Nutrición y Presencia',
    goals: [
      'Comida: Menús familiares refinados',
      'Mente: Lectura profunda',
      'Trabajo: Estabilización nuevo rol'
    ],
    habits: ['Alimentación Intuitiva', 'Mindfulness en la comida', 'Hobbies creativos']
  },
  {
    id: 'Q4',
    name: 'Q4: OCT - DIC',
    months: 'Octubre - Diciembre',
    focus: 'Integración y Placer',
    goals: [
      'Yo: Reconexión interna',
      'Hobbies: Pintar/cocinar por placer',
      'Cierre: Celebrar logros'
    ],
    habits: ['Práctica de "No juzgar"', 'Disfrute sin culpa', 'Ritual de cierre anual']
  },
];

export const CHECKIN_AREAS: CheckInArea[] = [
  {
    id: 'empleo',
    name: 'Empleo / Estudio',
    question: '¿Respeté mi "Bloque Roca" la mayoría de los días (aunque fuera breve)?',
    score: 0
  },
  {
    id: 'claridad',
    name: 'Claridad (Sustancias)',
    question: '¿Gestioné mi ansiedad/insomnio con herramientas (respiración) en lugar de CBD/Alcohol?',
    score: 0
  },
  {
    id: 'cuerpo',
    name: 'Cuerpo (Autocuidado)',
    question: '¿Me moví y alimenté desde el autocuidado y no desde el castigo?',
    score: 0
  },
  {
    id: 'maternidad',
    name: 'Maternidad',
    question: '¿Me sentí presente con Pax (aunque fuera en ratos cortos)?',
    score: 0
  },
  {
    id: 'gestion',
    name: 'Gestión / Casa',
    question: '¿El Batch Cooking me facilitó la vida o me estresó?',
    score: 0
  },
];

export const DAILY_ROUTINE_TEMPLATE: DailyTask[] = [
  { id: 'am_meds', text: 'Mañana: Agua + Medicación', category: 'fisiologia', completed: false },
  { id: 'am_yoga', text: 'Micro-Yoga / Estirar (5-10 min)', category: 'fisiologia', completed: false },
  { id: 'rock_block', text: 'Bloque Roca: Estudio/Trabajo (45m)', category: 'trabajo', completed: false },
  { id: 'noon_food', text: 'Mediodía: Comida Real (Sentada)', category: 'logistica', completed: false },
  { id: 'pm_walk', text: 'Tarde: Caminata + Podcast', category: 'oxigenacion', completed: false },
  { id: 'pm_play', text: 'Juego con Pax', category: 'vinculo', completed: false },
  { id: 'night_ritual', text: 'Noche: Cena ligera + Higiene sueño', category: 'fisiologia', completed: false },
];

export const GOLDEN_RULE = "La flexibilidad es la estructura. Si el bebé demanda, el horario se adapta, no se rompe.";
