import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { CheckInLog } from '../types';

// Colecciones
const COLL_DAILY = 'daily_tasks';
const COLL_CHECKINS = 'checkins';

/**
 * Obtiene el estado de las tareas para una fecha específica.
 * Retorna un objeto { [taskId]: boolean }
 */
export const getStoredTasks = async (dateStr: string): Promise<Record<string, boolean>> => {
  try {
    const docRef = doc(db, COLL_DAILY, dateStr);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().tasks || {};
    } else {
      return {};
    }
  } catch (e) {
    console.error("Error fetching tasks:", e);
    return {};
  }
};

/**
 * Guarda el estado de una tarea específica para una fecha.
 * Usa { merge: true } para no sobrescribir otras tareas del mismo día.
 */
export const saveTaskStatus = async (dateStr: string, taskId: string, completed: boolean) => {
  try {
    const docRef = doc(db, COLL_DAILY, dateStr);
    // Usamos notación de punto "tasks.taskId" para actualizar solo ese campo dentro del mapa
    await setDoc(docRef, {
      tasks: {
        [taskId]: completed
      }
    }, { merge: true });
  } catch (e) {
    console.error("Error saving task:", e);
  }
};

/**
 * Obtiene el historial de Check-ins ordenados por fecha descendente.
 */
export const getCheckInLogs = async (): Promise<CheckInLog[]> => {
  try {
    const q = query(collection(db, COLL_CHECKINS), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as CheckInLog);
  } catch (e) {
    console.error("Error fetching checkins:", e);
    return [];
  }
};

/**
 * Guarda un log de Check-in.
 * Usa la fecha como ID del documento para asegurar idempotencia (un log por día).
 */
export const saveCheckInLog = async (log: CheckInLog) => {
  try {
    const docRef = doc(db, COLL_CHECKINS, log.date);
    await setDoc(docRef, log);
  } catch (e) {
    console.error("Error saving checkin:", e);
  }
};