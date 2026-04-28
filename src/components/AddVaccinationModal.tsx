import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Syringe, Calendar } from 'lucide-react';
import { VaccinationService } from '../services';

interface Props {
  cattleId: string;
  ownerId: string;
  onClose: () => void;
}

const COMMON_VACCINES = [
  'FMD (Foot & Mouth)',
  'Anthrax',
  'Brucellosis',
  'HS (Haemorrhagic Septicaemia)',
  'Black Quarter (BQ)',
  'Lumpy Skin Disease'
];

export default function AddVaccinationModal({ cattleId, ownerId, onClose }: Props) {
  const [type, setType] = useState(COMMON_VACCINES[0]);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) return;

    setIsSubmitting(true);
    try {
      await VaccinationService.addVaccination({
        cattleId,
        ownerId,
        vaccineType: type,
        dueDate: new Date(dueDate).getTime(),
        status: 'pending'
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-serif font-bold text-gray-900">Health Alert</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Vaccine Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary"
            >
              {COMMON_VACCINES.map(v => <option key={v} value={v}>{v}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Due Date
            </label>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-opacity-90 disabled:opacity-50 transition-all text-lg"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Reminder'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
