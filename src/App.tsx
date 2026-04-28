/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Beef, 
  Milk, 
  Syringe, 
  Plus, 
  History, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  AlertCircle,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cattle, MilkRecord, Vaccination } from './types';
import { CattleService } from './services';
import CattleProfile from './components/CattleProfile';
import AddCattleForm from './components/AddCattleForm';

interface LocalUser {
  uid: string;
  displayName: string | null;
}

export default function App() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);
  const [isAddingCattle, setIsAddingCattle] = useState(false);
  const [farmName, setFarmName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('gokula_farm_name');
    if (savedName) {
      setUser({ uid: 'local-user', displayName: savedName });
      setFarmName(savedName);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = CattleService.subscribeToCattle(user.uid, setCattle);
      return () => unsubscribe();
    } else {
      setCattle([]);
    }
  }, [user]);

  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn || !farmName.trim()) return;
    
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const newUser = { uid: 'local-user', displayName: farmName };
      setUser(newUser);
      localStorage.setItem('gokula_farm_name', farmName);
    } catch (error: any) {
      console.error('Login failed', error);
      setAuthError('Unable to start. Please check your settings and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('gokula_farm_name');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-secondary)]">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Beef className="w-12 h-12 text-primary" />
          </motion.div>
          <p className="text-gray-500 font-medium font-serif italic">Gokula Health Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-secondary)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Beef className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Gokula-Health</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Electronic health card for your cattle. No email or phone required.
          </p>

          <AnimatePresence>
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3 border border-red-100"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-left">{authError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                Farm or Owner Name
              </label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input 
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Krishna Dairy"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-primary transition-all font-medium"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isLoggingIn || !farmName.trim()}
              className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
              {isLoggingIn ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Beef className="w-5 h-5" />
                </motion.div>
              ) : null}
              {isLoggingIn ? 'Setting up...' : 'Get Started'}
            </button>
          </form>
          <p className="mt-6 text-[10px] text-gray-400 font-medium leading-tight">
            * Your data is saved locally on this device. Clearing browser history may remove records.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-secondary)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-bottom border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Beef className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 leading-none">
              {selectedCattle ? selectedCattle.name : (user.displayName || "My Farm")}
            </h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter mt-1 opacity-60">
              Gokula Health
            </p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {!selectedCattle ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Total Cattle</span>
                  </div>
                  <div className="text-3xl font-bold font-serif">{cattle.length}</div>
                </div>
                <div className="bg-primary p-6 rounded-3xl shadow-lg shadow-primary/20 text-white">
                  <div className="flex items-center gap-2 mb-1 opacity-80">
                    <Milk className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Daily Avg</span>
                  </div>
                  <div className="text-3xl font-bold font-serif">12.4 L</div>
                </div>
              </div>

              {/* Cattle Grid */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Beef className="w-5 h-5 text-gray-400" />
                  Your Herd
                </h3>
                <button 
                  onClick={() => setIsAddingCattle(true)}
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              <div className="grid gap-4">
                {cattle.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 mb-4">No cattle registered yet.</p>
                    <button 
                      onClick={() => setIsAddingCattle(true)}
                      className="bg-primary text-white py-2 px-6 rounded-full font-bold shadow-md"
                    >
                      Add Your First Cow
                    </button>
                  </div>
                ) : (
                  cattle.map((cow) => (
                    <motion.div
                      key={cow.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCattle(cow)}
                      className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                        {cow.photoUrl ? (
                          <img src={cow.photoUrl} alt={cow.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <Beef className="w-8 h-8 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{cow.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium italic">
                            Tag: {cow.earTagId}
                          </span>
                          {cow.breed && (
                            <span className="text-xs text-gray-400 font-medium">• {cow.breed}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CattleProfile 
                cattle={selectedCattle} 
                onBack={() => setSelectedCattle(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal for adding cattle */}
      <AnimatePresence>
        {isAddingCattle && (
          <AddCattleForm 
            userId={user.uid} 
            onClose={() => setIsAddingCattle(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
