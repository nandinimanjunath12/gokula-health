import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Milk, 
  Syringe, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Calendar,
  AlertCircle,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cattle, MilkRecord, Vaccination, BreedingCycle } from '../types';
import { MilkService, VaccinationService, CattleService, BreedingService } from '../services';
import MilkChart from './MilkChart';
import AddMilkModal from './AddMilkModal';
import AddVaccinationModal from './AddVaccinationModal';
import AddBreedingModal from './AddBreedingModal';

interface Props {
  cattle: Cattle;
  onBack: () => void;
}

export default function CattleProfile({ cattle, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'milk' | 'health' | 'breeding'>('milk');
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [breedingCycles, setBreedingCycles] = useState<BreedingCycle[]>([]);
  const [isAddingMilk, setIsAddingMilk] = useState(false);
  const [isAddingVax, setIsAddingVax] = useState(false);
  const [isAddingBreeding, setIsAddingBreeding] = useState(false);

  useEffect(() => {
    const unsubMilk = MilkService.subscribeToRecords(cattle.id, setRecords);
    const unsubVax = VaccinationService.subscribeToVaccinations(cattle.id, setVaccinations);
    const unsubBreeding = BreedingService.subscribeToCycles(cattle.id, setBreedingCycles);
    return () => {
      unsubMilk();
      unsubVax();
      unsubBreeding();
    };
  }, [cattle.id]);

  const now = new Date();
  const currentMonthRecords = records.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const avgYield = currentMonthRecords.length > 0 
    ? (currentMonthRecords.reduce((acc, r) => acc + r.morningYield + r.eveningYield, 0) / currentMonthRecords.length).toFixed(1)
    : '0';

  const pendingVax = vaccinations.filter(v => v.status === 'pending');
  const overdueVax = pendingVax.filter(v => v.dueDate < Date.now());

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-primary font-bold text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Herd
      </button>

      {/* Hero Card */}
      <div className="health-card-gradient rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center text-4xl font-bold overflow-hidden border-2 border-white/30 shadow-lg">
            {cattle.photoUrl ? (
              <img src={cattle.photoUrl} alt={cattle.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              cattle.name[0]
            )}
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1">{cattle.name}</h2>
            <div className="flex flex-wrap gap-2 text-sm font-medium opacity-90">
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">ID: {cattle.earTagId}</span>
              {cattle.breed && <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{cattle.breed}</span>}
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm italic">Joined {new Date(cattle.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Avg Yield</p>
            <p className="text-2xl font-bold">{avgYield} <span className="text-sm font-medium">L/day</span></p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Health Status</p>
            <div className="text-2xl font-bold flex items-center gap-2">
              {overdueVax.length > 0 ? (
                <div className="flex items-center gap-2 text-white">
                  <AlertCircle className="w-5 h-5 text-red-500 fill-red-500/20" />
                  <span className="text-sm font-bold">Overdue ({overdueVax.length})</span>
                </div>
              ) : pendingVax.length > 0 ? (
                <div className="flex items-center gap-2 text-white">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-bold">Pending ({pendingVax.length})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5 text-green-400 fill-green-400/20" />
                  <span className="text-sm font-bold">Healthy</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl overflow-x-auto">
        <button 
          onClick={() => setActiveTab('milk')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'milk' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
        >
          <Milk className="w-4 h-4" /> Milk
        </button>
        <button 
          onClick={() => setActiveTab('health')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'health' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
        >
          <Syringe className="w-4 h-4" /> Health
        </button>
        <button 
          onClick={() => setActiveTab('breeding')}
          className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'breeding' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
        >
          <Heart className="w-4 h-4" /> Breeding
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'milk' ? (
          <motion.div
            key="milk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Progress Chart
                </h3>
                <button 
                  onClick={() => setIsAddingMilk(true)}
                  className="bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary/20 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64 w-full">
                <MilkChart records={records} />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider px-2">Recent Logs</h4>
              {records.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-white rounded-3xl border border-gray-100">
                  No milk records yet.
                </div>
              ) : (
                records.slice().reverse().map(record => (
                  <div key={record.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      <p className="text-xs text-gray-400 font-medium">Recorded Daily</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-400">AM</p>
                        <p className="font-bold text-primary">{record.morningYield}L</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-400">PM</p>
                        <p className="font-bold text-primary">{record.eveningYield}L</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : activeTab === 'health' ? (
          <motion.div
            key="health"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Vaccination Schedule</h3>
              <button 
                onClick={() => setIsAddingVax(true)}
                className="bg-primary/10 text-primary p-2 rounded-xl"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {vaccinations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-400">No vaccination records found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vaccinations.sort((a, b) => a.dueDate - b.dueDate).map(vax => {
                  const isOverdue = vax.status === 'pending' && vax.dueDate < Date.now();
                  return (
                    <div 
                      key={vax.id} 
                      className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
                        vax.status === 'completed' 
                          ? 'bg-gray-50 border-gray-100 opacity-60' 
                          : isOverdue 
                            ? 'bg-red-50/50 border-red-200 shadow-sm' 
                            : 'bg-white border-primary/10 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${
                          vax.status === 'completed' 
                            ? 'bg-gray-200 text-gray-500' 
                            : isOverdue 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-primary/10 text-primary'
                        }`}>
                          <Syringe className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-gray-900">{vax.vaccineType}</h5>
                            {isOverdue && (
                              <span className="bg-red-100 text-red-600 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">Overdue</span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {vax.status === 'completed' 
                              ? `Completed on ${new Date(vax.completedAt!).toLocaleDateString()}` 
                              : `Due: ${new Date(vax.dueDate).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      {vax.status === 'pending' && (
                        <button 
                          onClick={() => VaccinationService.completeVaccination(vax.id)}
                          className={`${isOverdue ? 'bg-red-600' : 'bg-primary'} text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform`}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="breeding"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Breeding Cycles</h3>
              <button 
                onClick={() => setIsAddingBreeding(true)}
                className="bg-primary/10 text-primary p-2 rounded-xl"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {breedingCycles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-400">No breeding history recorded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {breedingCycles.map(cycle => (
                  <div 
                    key={cycle.id} 
                    className="p-4 bg-white rounded-3xl border border-primary/10 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-50 text-pink-500 rounded-xl">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                          <p className="font-bold text-gray-900 capitalize">{cycle.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">Bred On</p>
                        <p className="font-bold text-gray-900">{new Date(cycle.dateBred).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Expected Due: {new Date(cycle.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        {cycle.status === 'open' && (
                          <button 
                            onClick={() => BreedingService.updateCycle(cattle.id, cycle.id, { status: 'pregnant' })}
                            className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full"
                          >
                            Mark Pregnant
                          </button>
                        )}
                        {cycle.status === 'pregnant' && (
                          <button 
                            onClick={() => BreedingService.updateCycle(cattle.id, cycle.id, { status: 'calved' })}
                            className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full"
                          >
                            Mark Calved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isAddingMilk && (
          <AddMilkModal 
            cattleId={cattle.id} 
            ownerId={cattle.ownerId}
            onClose={() => setIsAddingMilk(false)} 
          />
        )}
        {isAddingVax && (
          <AddVaccinationModal 
            cattleId={cattle.id} 
            ownerId={cattle.ownerId}
            onClose={() => setIsAddingVax(false)} 
          />
        )}
        {isAddingBreeding && (
          <AddBreedingModal 
            cattleId={cattle.id} 
            ownerId={cattle.ownerId}
            onClose={() => setIsAddingBreeding(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
