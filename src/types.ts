export interface Cattle {
  id: string;
  name: string;
  earTagId: string;
  photoUrl?: string;
  breed?: string;
  ownerId: string;
  createdAt: number;
}

export interface MilkRecord {
  id: string;
  cattleId: string;
  date: string; // YYYY-MM-DD
  morningYield: number;
  eveningYield: number;
  ownerId: string;
}

export interface Vaccination {
  id: string;
  cattleId: string;
  vaccineType: string;
  dueDate: number;
  completedAt?: number;
  status: 'pending' | 'completed';
  ownerId: string;
}

export interface BreedingCycle {
  id: string;
  cattleId: string;
  dateBred: string;
  dueDate: string;
  status: 'open' | 'pregnant' | 'calved';
  ownerId: string;
}
