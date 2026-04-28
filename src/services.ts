import { Cattle, MilkRecord, Vaccination, BreedingCycle } from './types';

// Simple PubSub to mimic Firebase onSnapshot behavior
type Listener<T> = (data: T) => void;
const listeners: { [key: string]: Listener<any>[] } = {};

function notify(key: string, data: any) {
  if (listeners[key]) {
    listeners[key].forEach(l => l(data));
  }
}

function sub<T>(key: string, callback: Listener<T>, currentData: T) {
  if (!listeners[key]) listeners[key] = [];
  listeners[key].push(callback);
  callback(currentData);
  return () => {
    listeners[key] = listeners[key].filter(l => l !== callback);
  };
}

// Local Storage Helpers
const getStorage = <T>(key: string, defaultVal: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  notify(key, data);
};

export const CattleService = {
  subscribeToCattle: (userId: string, callback: (cattle: Cattle[]) => void) => {
    const cattle = getStorage<Cattle[]>('gokula_cattle', []);
    return sub('gokula_cattle', callback, cattle);
  },

  addCattle: async (cattle: Omit<Cattle, 'id' | 'createdAt'>) => {
    const current = getStorage<Cattle[]>('gokula_cattle', []);
    const newCow = {
      ...cattle,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setStorage('gokula_cattle', [...current, newCow]);
    return newCow;
  },

  deleteCattle: async (id: string) => {
    const current = getStorage<Cattle[]>('gokula_cattle', []);
    setStorage('gokula_cattle', current.filter(c => c.id !== id));
  }
};

export const MilkService = {
  subscribeToRecords: (cattleId: string, callback: (records: MilkRecord[]) => void) => {
    const allRecords = getStorage<MilkRecord[]>('gokula_milk', []);
    const filtered = allRecords.filter(r => r.cattleId === cattleId);
    return sub(`gokula_milk_${cattleId}`, callback, filtered.sort((a, b) => a.date.localeCompare(b.date)));
  },

  addRecord: async (record: Omit<MilkRecord, 'id'>) => {
    const allRecords = getStorage<MilkRecord[]>('gokula_milk', []);
    const newRecord = { ...record, id: crypto.randomUUID() };
    const nextRecords = [...allRecords, newRecord];
    setStorage('gokula_milk', nextRecords);
    notify(`gokula_milk_${record.cattleId}`, nextRecords.filter(r => r.cattleId === record.cattleId).sort((a, b) => a.date.localeCompare(b.date)));
    return newRecord;
  }
};

export const VaccinationService = {
  subscribeToVaccinations: (cattleId: string, callback: (vaccinations: Vaccination[]) => void) => {
    const all = getStorage<Vaccination[]>('gokula_vax', []);
    const filtered = all.filter(v => v.cattleId === cattleId);
    return sub(`gokula_vax_${cattleId}`, callback, filtered);
  },

  addVaccination: async (vax: Omit<Vaccination, 'id'>) => {
    const all = getStorage<Vaccination[]>('gokula_vax', []);
    const newVax = { ...vax, id: crypto.randomUUID() };
    const next = [...all, newVax];
    setStorage('gokula_vax', next);
    notify(`gokula_vax_${vax.cattleId}`, next.filter(v => v.cattleId === vax.cattleId));
    return newVax;
  },

  completeVaccination: async (id: string) => {
    const all = getStorage<Vaccination[]>('gokula_vax', []);
    const next = all.map(v => v.id === id ? { ...v, status: 'completed' as const, completedAt: Date.now() } : v);
    setStorage('gokula_vax', next);
    // Find the cattleId to notify
    const vax = all.find(v => v.id === id);
    if (vax) notify(`gokula_vax_${vax.cattleId}`, next.filter(v => v.cattleId === vax.cattleId));
  }
};

export const BreedingService = {
  subscribeToCycles: (cattleId: string, callback: (cycles: BreedingCycle[]) => void) => {
    const all = getStorage<BreedingCycle[]>('gokula_breeding', []);
    const filtered = all.filter(c => c.cattleId === cattleId);
    return sub(`gokula_breeding_${cattleId}`, callback, filtered.sort((a, b) => b.dateBred.localeCompare(a.dateBred)));
  },

  addCycle: async (cattleId: string, cycle: Omit<BreedingCycle, 'id'>) => {
    const all = getStorage<BreedingCycle[]>('gokula_breeding', []);
    const newCycle = { ...cycle, id: crypto.randomUUID() };
    const next = [...all, newCycle];
    setStorage('gokula_breeding', next);
    notify(`gokula_breeding_${cattleId}`, next.filter(c => c.cattleId === cattleId).sort((a, b) => b.dateBred.localeCompare(a.dateBred)));
    return newCycle;
  },

  updateCycle: async (cattleId: string, cycleId: string, updates: Partial<BreedingCycle>) => {
    const all = getStorage<BreedingCycle[]>('gokula_breeding', []);
    const next = all.map(c => c.id === cycleId ? { ...c, ...updates } : c);
    setStorage('gokula_breeding', next);
    notify(`gokula_breeding_${cattleId}`, next.filter(c => c.cattleId === cattleId).sort((a, b) => b.dateBred.localeCompare(a.dateBred)));
  }
};
