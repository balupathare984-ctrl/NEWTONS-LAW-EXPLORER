import { useEffect, useRef, useState } from 'react';
import { MoveRight, MoveLeft, Wind, Hexagon } from 'lucide-react';

export function FirstLaw() {
  const [hasFriction, setHasFriction] = useState(false);
  const stateRef = useRef({ pos: 300, vel: 0 });
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>();

  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      let { pos, vel } = stateRef.current;
      const width = containerRef.current?.clientWidth || 600;

      // Apply friction if enabled
      if (hasFriction) {
        if (vel > 0) vel = Math.max(0, vel - 150 * dt);
        else if (vel < 0) vel = Math.min(0, vel + 150 * dt);
      }

      pos += vel * dt;

      // Wrap around the stage constraints
      if (pos > width + 50) pos = -50;
      if (pos < -50) pos = width + 50;

      stateRef.current = { pos, vel };

      if (boxRef.current) {
        boxRef.current.style.transform = `translateX(${pos}px)`;
      }

      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [hasFriction]);

  const applyForce = (amount: number) => {
    stateRef.current.vel += amount;
  };

  const reset = () => {
    stateRef.current = { pos: (containerRef.current?.clientWidth || 600) / 2, vel: 0 };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
      {/* Explanation Card */}
      <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col hover:border-indigo-300 transition-colors">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
           <span className="font-bold text-xl">01</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Law of Inertia</h2>
        <p className="text-slate-600 leading-relaxed mb-4 flex-grow">
          "An object at rest remains at rest, and an object in motion remains in motion at constant speed and in a straight line unless acted on by an unbalanced force."
        </p>
        <div className="p-4 bg-indigo-50 text-indigo-900 rounded-2xl border border-indigo-100 text-sm font-medium">
          <strong>Put simply:</strong> Things like to keep doing what they're already doing. If it's still, it stays still. If it's moving, it keeps moving (until friction or an obstacle stops it).
        </div>
      </div>

      {/* Interactive Tryout Card */}
      <div className="md:col-span-7 bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl text-white">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Interactive Session</span>
            <span className="text-xs bg-white/10 text-white px-2 py-0.5 rounded font-bold">Live</span>
        </div>
        <h3 className="text-xl font-bold mb-4 tracking-tight">Space vs. Earth</h3>
        
        {/* Stage */}
        <div 
          ref={containerRef}
          className={`relative w-full flex-grow min-h-[220px] rounded-2xl overflow-hidden shadow-inner transition-colors duration-700 ${hasFriction ? 'bg-emerald-950/40 border-b-8 border-emerald-800' : 'bg-black border-b-8 border-slate-800'}`}
        >
          {/* Background elements */}
          {!hasFriction && (
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiM1NTUiPjwvcmVjdD4KPC9zdmc+')] opacity-50" />
          )}

          {/* The Object */}
          <div 
            ref={boxRef}
            className="absolute bottom-2 left-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] flex items-center justify-center -ml-8"
          >
            <Hexagon className="text-white w-8 h-8 opacity-80" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto border-t border-white/10 pt-6">
          <div className="flex gap-3">
            <button 
              onClick={() => applyForce(-150)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors active:scale-95 font-bold text-sm"
            >
              <MoveLeft className="w-5 h-5" /> Push Left
            </button>
            <button 
              onClick={() => applyForce(150)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors active:scale-95 font-bold text-sm"
            >
              Push Right <MoveRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setHasFriction(!hasFriction)}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 transition-colors font-bold text-sm active:scale-95 ${hasFriction ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Wind className="w-5 h-5" />
              {hasFriction ? 'Friction ON' : 'Friction OFF'}
            </button>
            <button onClick={reset} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
