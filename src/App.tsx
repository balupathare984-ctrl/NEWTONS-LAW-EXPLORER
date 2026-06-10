import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FirstLaw } from './components/FirstLaw';
import { SecondLaw } from './components/SecondLaw';
import { ThirdLaw } from './components/ThirdLaw';
import { Atom, Wind, Rocket, ArrowRightLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="min-h-[100dvh] bg-slate-100 text-slate-900 font-sans selection:bg-indigo-500/30 overflow-x-hidden flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-end mb-6 max-w-6xl mx-auto w-full">
         <div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Newton's Laws Lab</h1>
             <p className="text-slate-500 font-medium mt-1">Master the mechanics of the universe</p>
         </div>
         <div className="hidden md:flex gap-4">
             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
               <span className="text-xs font-bold text-slate-400 uppercase block">Level</span>
               <span className="text-lg font-bold text-indigo-600">Beginner Physics</span>
             </div>
             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
               <span className="text-xs font-bold text-slate-400 uppercase block">Mastery</span>
               <span className="text-lg font-bold text-indigo-600">45%</span>
             </div>
         </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
         {/* Tab Navigation - Restyled */}
         <div className="flex w-full gap-4 mb-6 overflow-x-auto hide-scrollbar pb-2">
             <button 
                onClick={() => setActiveTab(1)}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border-2 ${activeTab === 1 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
             >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${activeTab === 1 ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-600'}`}>01</div>
                Law of Inertia
             </button>
             <button 
                onClick={() => setActiveTab(2)}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border-2 ${activeTab === 2 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
             >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${activeTab === 2 ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-600'}`}>02</div>
                F = ma
             </button>
             <button 
                onClick={() => setActiveTab(3)}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border-2 ${activeTab === 3 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
             >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${activeTab === 3 ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-600'}`}>03</div>
                Action & Reaction
             </button>
         </div>

         {/* Tab Content Area */}
         <div className="relative flex-grow flex flex-col">
           <AnimatePresence mode="wait">
               <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.2 }}
                   className="flex-grow flex flex-col"
               >
                   {activeTab === 1 && <FirstLaw />}
                   {activeTab === 2 && <SecondLaw />}
                   {activeTab === 3 && <ThirdLaw />}
               </motion.div>
           </AnimatePresence>
         </div>
      </main>

      {/* Footer Stats */}
      <footer className="mt-8 max-w-6xl mx-auto w-full flex justify-between items-center py-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-bold text-slate-500">Server: Kinetic-1 Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Community Activity: 1,402 Active Learners</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 uppercase tracking-wider">Built by ARNAV PATHARE</span>
          </div>
        </div>
        <div className="text-xs text-slate-400 italic font-medium hidden md:block">
          "Nature and Nature's laws lay hid in night: God said, Let Newton be! and all was light." — Alexander Pope
        </div>
      </footer>

      {/* Hide Scrollbar util */}
      <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
