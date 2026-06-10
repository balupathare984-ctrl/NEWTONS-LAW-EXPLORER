import { useEffect, useRef, useState } from 'react';
import { Rocket, Gauge } from 'lucide-react';

export function SecondLaw() {
  const [mass, setMass] = useState(10);
  const [force, setForce] = useState(50);
  
  // React state for HUD
  const [hudStats, setHudStats] = useState({ vel: 0, acc: 0 });

  const paramsRef = useRef({ mass, force, isApplying: false });
  const stateRef = useRef({ pos: 50, vel: 0 });
  const boxRef = useRef<HTMLDivElement>(null);
  const forceArrowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number>();

  useEffect(() => {
    paramsRef.current.mass = mass;
    paramsRef.current.force = force;
  }, [mass, force]);

  useEffect(() => {
    let lastTime = performance.now();
    let tickCounter = 0;

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // Cap dt
      lastTime = time;

      let { pos, vel } = stateRef.current;
      const { mass, force, isApplying } = paramsRef.current;
      const width = containerRef.current?.clientWidth || 600;
      
      let acceleration = 0;
      if (isApplying) {
         acceleration = force / mass;
         vel += acceleration * dt * 20; // Scale visual speed
      }

      pos += vel * dt;

      // Wall collision logic
      if (pos > width - Math.max(40, mass * 1.5)) {
          pos = width - Math.max(40, mass * 1.5);
          vel = 0; // Stop at right wall completely
      }

      stateRef.current = { pos, vel };

      if (boxRef.current) {
        boxRef.current.style.transform = `translateX(${pos}px)`;
      }
      
      // Real-time arrow visibility
      if (forceArrowRef.current) {
         forceArrowRef.current.style.opacity = isApplying && vel !== 0 ? '1' : '0';
         forceArrowRef.current.style.width = (isApplying && vel !== 0) ? `${Math.min(force, 300)}px` : '0px';
      }

      tickCounter++;
      // Generic re-render for HUD ~5 times a second to prevent React overload frame drops
      if (tickCounter % 12 === 0) {
          setHudStats({ 
              vel, 
              // Set acceleration to 0 if we've hit the wall and stopped moving
              acc: (isApplying && pos < width - Math.max(40, mass * 1.5)) ? acceleration : 0 
          });
      }

      reqRef.current = requestAnimationFrame(loop);
    };
    
    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  const handleApplyForceDown = () => { paramsRef.current.isApplying = true; };
  const handleApplyForceUp = () => { paramsRef.current.isApplying = false; };
  
  const reset = () => {
      stateRef.current = { pos: 50, vel: 0 };
      paramsRef.current.isApplying = false;
      setHudStats({ acc: 0, vel: 0 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
      {/* Explanation Card */}
      <div className="md:col-span-5 bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 flex flex-col">
        <div className="w-10 h-10 bg-white/20 text-white rounded-lg flex items-center justify-center mb-4">
           <span className="font-bold text-xl">02</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">F = ma</h2>
        <p className="text-indigo-100 leading-relaxed mb-6 flex-grow">
          "The acceleration of an object depends on the mass of the object and the amount of force applied."
        </p>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-sm font-medium">
          <strong>Put simply:</strong> Heavier things are harder to move. If you want to speed up a heavy object, you need to push it much harder than a light object.
        </div>
        <div className="mt-4 flex gap-4 font-mono text-sm bg-black/20 p-4 rounded-2xl border border-white/10 text-indigo-50">
           <span className="flex items-center gap-2 flex-1"><Gauge className="w-4 h-4 text-cyan-300"/> Vel: {Math.round(hudStats.vel)}</span>
           <span className="flex items-center gap-2 flex-1"><Rocket className="w-4 h-4 text-rose-300"/> Acc: {hudStats.acc.toFixed(1)}</span>
        </div>
      </div>

      {/* Interactive Tryout Card */}
      <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Force Calculator Interactive</span>
            <button onClick={reset} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Reset Scenario</button>
        </div>
        
        {/* Stage */}
        <div 
            ref={containerRef}
            className="relative w-full flex-grow min-h-[160px] bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-200 border-dashed"
        >
            {/* The Object */}
            <div 
                ref={boxRef}
                className="absolute bottom-4 left-0 flex flex-col items-center"
            >
                <div 
                    className="bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold border-2 border-amber-300 shadow-sm transition-all duration-300"
                    style={{ width: `${Math.max(48, mass * 1.5)}px`, height: `${Math.max(48, mass * 1.5)}px` }}
                >
                    {mass}kg
                </div>
                {/* Force Arrow Overlay */}
                <div 
                    ref={forceArrowRef}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-3 bg-indigo-500 origin-left transition-all duration-200 ease-out z-10"
                    style={{ width: '0px', opacity: 0 }}
                >
                    {/* Arrow head */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-indigo-500 rotate-45 transform origin-center rounded-sm"/>
                </div>
            </div>
            
            {/* Wall */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-slate-200 border-l border-slate-300"/>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">
                       <label>Mass (m)</label>
                       <span className="text-amber-500">{mass} kg</span>
                   </div>
                   <input type="range" min="10" max="100" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-amber-500" />
                </div>
                <div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">
                       <label>Force (F)</label>
                       <span className="text-indigo-500">{force} N</span>
                   </div>
                   <input type="range" min="10" max="300" value={force} onChange={(e) => setForce(Number(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-indigo-500" />
                </div>
            </div>

            <div className="flex items-center justify-center">
               <button 
                 onMouseDown={handleApplyForceDown}
                 onMouseUp={handleApplyForceUp}
                 onMouseLeave={handleApplyForceUp}
                 onTouchStart={handleApplyForceDown}
                 onTouchEnd={handleApplyForceUp}
                 className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg uppercase tracking-widest transition-colors active:scale-95 active:bg-indigo-700 shadow-lg shadow-indigo-600/30 select-none touch-none h-full border border-indigo-500"
               >
                   Hold to Push
               </button>
            </div>
        </div>
      </div>
    </div>
  );
}
