import { useEffect, useRef, useState } from 'react';
import { Play, Square } from 'lucide-react';

export function ThirdLaw() {
  const [activeBalls, setActiveBalls] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const numBalls = 5;

  const ballsRef = useRef<(HTMLDivElement | null)[]>([]);
  const reqRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) {
      ballsRef.current.forEach((ball, i) => {
        if (ball) {
          const isLeftGroup = i < activeBalls;
          ball.style.transform = `rotate(${isLeftGroup ? 35 : 0}deg)`;
        }
      });
      return;
    }

    startTimeRef.current = performance.now();
    const cycleDuration = 800; // Fast and energetic kinetics

    const loop = (time: number) => {
      const elapsed = time - startTimeRef.current;
      const phase = (elapsed % cycleDuration) / cycleDuration;
      
      const maxAngle = 35;
      const PI2 = Math.PI / 2;
      
      let leftAngle = 0;
      let rightAngle = 0;

      if (phase < 0.25) {
        // Swing down
        leftAngle = maxAngle * Math.cos(phase * 4 * PI2);
      } else if (phase < 0.5) {
        // Swing up (right side)
        rightAngle = -maxAngle * Math.sin((phase - 0.25) * 4 * PI2);
      } else if (phase < 0.75) {
        // Swing down (right side)
        rightAngle = -maxAngle * Math.cos((phase - 0.5) * 4 * PI2);
      } else {
        // Swing up (left side)
        leftAngle = maxAngle * Math.sin((phase - 0.75) * 4 * PI2);
      }

      ballsRef.current.forEach((ball, i) => {
        if (!ball) return;
        const isLeftGroup = i < activeBalls;
        const isRightGroup = i >= numBalls - activeBalls;
        
        let ballAngle = 0;
        if (isLeftGroup && leftAngle > 0.001) {
          ballAngle = leftAngle;
        } else if (isRightGroup && rightAngle < -0.001) {
          ballAngle = rightAngle;
        }

        ball.style.transform = `rotate(${ballAngle}deg)`;
      });

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isRunning, activeBalls]);

  const toggleSimulation = () => {
      setIsRunning(!isRunning);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
      {/* Explanation Card */}
      <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col hover:border-indigo-300 transition-colors">
        <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-4">
           <span className="font-bold text-xl">03</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Action & Reaction</h2>
        <p className="text-slate-600 leading-relaxed mb-4 flex-grow">
          "Whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first."
        </p>
        <div className="p-4 bg-rose-50 text-rose-900 rounded-2xl border border-rose-100 text-sm font-medium leading-relaxed">
          <strong>Newton's Cradle:</strong> This classic device perfectly demonstrates conservation of momentum and energy across forces. Pull varying numbers of balls on the left to witness symmetrical reactions on the right!
        </div>
      </div>

      {/* Interactive Tryout Card */}
      <div className="md:col-span-7 bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl text-white">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-[0.2em]">Kinetic Interaction</span>
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? 'bg-rose-500' : 'bg-slate-600'}`}></span>
                </span>
                <span className="text-xs font-bold text-slate-400">{isRunning ? 'Running' : 'Paused'}</span>
            </div>
        </div>
        <h3 className="text-xl font-bold mb-4 tracking-tight">Newton's Cradle</h3>
        
        {/* Stage */}
        <div className="relative w-full flex-grow min-h-[240px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 grid place-items-center">
            {/* The Cradle Frame */}
            <div className="relative h-48 w-full flex justify-center mt-8 pt-4">
                {/* Horizontal Top Bar */}
                <div className="absolute top-0 w-[240px] h-4 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 border-t border-slate-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-20" />
                
                {/* Balls Container */}
                <div className="flex z-10">
                  {Array.from({ length: numBalls }).map((_, i) => (
                     <div 
                       key={i}
                       ref={el => { ballsRef.current[i] = el; }}
                       className="relative origin-top"
                       style={{ width: '40px', height: '180px' }}
                     >
                        {/* String - Double line pattern for structure */}
                        <div className="mx-auto w-[2px] h-[140px] bg-slate-500/80 shadow-sm" />
                        
                        {/* Chrome Ball */}
                        <div className="absolute bottom-0 left-0 w-[40px] h-[40px] rounded-full bg-gradient-to-br from-slate-100 via-slate-400 to-slate-600 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.6),inset_2px_2px_5px_rgba(255,255,255,0.8),0_10px_10px_rgba(0,0,0,0.4)]" />
                     </div>
                  ))}
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 mt-auto border-t border-white/10">
            <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <label>Balls to Drop</label>
                    <span className="text-rose-400 font-mono text-sm">{activeBalls}</span>
                </div>
                <input 
                   type="range" 
                   min="1" 
                   max="4" 
                   step="1"
                   value={activeBalls} 
                   onChange={(e) => {
                       if (isRunning) setIsRunning(false);
                       setActiveBalls(Number(e.target.value));
                   }} 
                   className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-rose-500 hover:accent-rose-400 transition-colors" 
                />
            </div>

            <div className="flex items-center justify-center">
               <button 
                 onClick={toggleSimulation}
                 className={`w-full py-5 rounded-xl font-bold text-lg uppercase tracking-widest transition-colors flex items-center justify-center gap-3 active:scale-95 border shadow-lg h-full ${isRunning ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-rose-900/40'}`}
               >
                   {isRunning ? (
                       <><Square className="w-5 h-5"/> Stop</>
                   ) : (
                       <><Play className="w-5 h-5 ml-1"/> Drop</>
                   )}
               </button>
            </div>
        </div>
      </div>
    </div>
  );
}
