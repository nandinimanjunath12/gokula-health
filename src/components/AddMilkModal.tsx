import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Milk, Sun, Moon } from 'lucide-react';
import { MilkService } from '../services';

interface Props {
  cattleId: string;
  ownerId: string;
  onClose: () => void;
}

export default function AddMilkModal({ cattleId, ownerId, onClose }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [morning, setMorning] = useState('0');
  const [evening, setEvening] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await MilkService.addRecord({
        cattleId,
        ownerId,
        date,
        morningYield: parseFloat(morning),
        eveningYield: parseFloat(evening),
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
          <h3 className="text-2xl font-serif font-bold text-gray-900">Milk Yield</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Record Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Sun className="w-4 h-4 text-orange-400" /> Morning
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={morning}
                  onChange={(e) => setMorning(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pr-10 focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs uppercase">L</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-400" /> Evening
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={evening}
                  onChange={(e) => setEvening(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pr-10 focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs uppercase">L</span>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-opacity-90 disabled:opacity-50 transition-all text-lg"
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
