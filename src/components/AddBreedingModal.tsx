import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Heart } from 'lucide-react';
import { BreedingService } from '../services';

interface Props {
  cattleId: string;
  ownerId: string;
  onClose: () => void;
}

export default function AddBreedingModal({ cattleId, ownerId, onClose }: Props) {
  const [dateBred, setDateBred] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'open' | 'pregnant' | 'calved'>('open');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Approximate gestation for cows is 283 days
  const calculateDueDate = (bredDate: string) => {
    const date = new Date(bredDate);
    date.setDate(date.getDate() + 283);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await BreedingService.addCycle(cattleId, {
        cattleId,
        ownerId,
        dateBred,
        dueDate: calculateDueDate(dateBred),
        status
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
          <h3 className="text-2xl font-serif font-bold text-gray-900">Add Breeding Record</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Breeding Date
            </label>
            <input 
              type="date" 
              value={dateBred}
              onChange={(e) => setDateBred(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Initial Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary"
            >
              <option value="open">Open (Just bred)</option>
              <option value="pregnant">Confirmed Pregnant</option>
              <option value="calved">Calved (Historical record)</option>
            </select>
          </div>

          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <p className="text-xs font-bold text-primary uppercase mb-1">Estimated Due Date</p>
            <p className="font-bold text-gray-900">{new Date(calculateDueDate(dateBred)).toLocaleDateString()}</p>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-opacity-90 disabled:opacity-50 transition-all text-lg"
          >
            {isSubmitting ? 'Saving...' : 'Add Record'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
