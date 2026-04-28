import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Beef, Tag, Sparkles } from 'lucide-react';
import { CattleService } from '../services';

interface Props {
  userId: string;
  onClose: () => void;
}

export default function AddCattleForm({ userId, onClose }: Props) {
  const [name, setName] = useState('');
  const [earTagId, setEarTagId] = useState('');
  const [breed, setBreed] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !earTagId) return;

    setIsSubmitting(true);
    try {
      await CattleService.addCattle({
        name,
        earTagId,
        breed,
        photoUrl: photoUrl || `https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=200&h=200`,
        ownerId: userId,
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
        className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-serif font-bold text-gray-900">Add New Animal</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Beef className="w-4 h-4 text-primary" /> Cow Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lakshmi, Ganga"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Ear Tag ID
            </label>
            <input 
              type="text" 
              value={earTagId}
              onChange={(e) => setEarTagId(e.target.value)}
              placeholder="e.g. IN-123456"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Breed (Optional)
            </label>
            <input 
              type="text" 
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Gir, Jersey, Sahiwal"
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Photo URL (Optional)
            </label>
            <input 
              type="url" 
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-opacity-90 disabled:opacity-50 transition-all text-lg"
          >
            {isSubmitting ? 'Registering...' : 'Register Cattle'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
