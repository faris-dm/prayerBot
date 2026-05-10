import React, { useState } from "react";
import { motion } from "framer-motion";
// import { findQiblaAngle, getCleanHeading } from "./compassLogic";
import { findQiblaAngle, getCleanHeading } from "./compass";

function App() {
  const [heading, setHeading] = useState(0); // The phone's rotation
  const [qiblaDir, setQiblaDir] = useState(0); // The target angle
  const [isActive, setIsActive] = useState(false);

  // Starts the GPS and the Compass Sensors
  const startSensors = () => {
    // 1. Get GPS Location
    navigator.geolocation.getCurrentPosition(
      (data) => {
        const angle = findQiblaAngle(
          data.coords.latitude,
          data.coords.longitude
        );
        setQiblaDir(angle);
        setIsActive(true);
      },
      (err) => alert("Please enable location to find Makkah")
    );

    // 2. Handle Orientation (Compass)
    const handleMotion = (event) => {
      const actualHeading = getCleanHeading(event);
      setHeading(actualHeading);
    };

    // 3. Request Permission for iOS/Android
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleMotion);
    }
  };
  const displayHeading = Number(heading).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* HEADER */}
      <div className="text-center mt-4">
        <h1 className="text-3xl font-black tracking-tighter text-emerald-400">
          QIBLA<span className="text-white">PRO</span>
        </h1>
        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
          Abu Dream Edition
        </p>
      </div>

      {/* COMPASS VISUAL */}
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        {/* Static Background Glow */}
        <div className="absolute w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

        {/* Outer Directional Ring (Static) */}
        <div className="absolute w-full h-full border-2 border-slate-800 rounded-full flex items-center justify-center">
          <span className="absolute top-4 font-black text-indigo-400">N</span>
          <span className="absolute bottom-4 font-black text-rose-400">S</span>
          <span className="absolute right-4 font-black text-amber-400">E</span>
          <span className="absolute left-4 font-black text-cyan-400">W</span>
        </div>

        {/* Rotating Compass Face */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
          className="relative w-[75%] h-[75%] rounded-full border border-slate-700 bg-slate-900/50 shadow-2xl flex items-center justify-center"
        >
          {/* Simple North Tick */}
          <div className="w-1 h-4 bg-indigo-500 absolute top-0"></div>
        </motion.div>

        {/* The Qibla Needle (Points to Makkah) */}
        <motion.div
          animate={{ rotate: qiblaDir - heading }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute w-full h-full flex items-center justify-center pointer-events-none"
        >
          {/* The icon is wrapped in a container that is 100% height. 
      By putting the 🕋 inside a div and moving it to the top, 
      it orbits the center perfectly without a confusing line.
  */}
          <div className="h-full flex flex-col items-center justify-start pt-2">
            <span className="text-4xl drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">
              🕋
            </span>
          </div>
        </motion.div>
      </div>

      {/* FOOTER DATA & BUTTONS */}
      <div className="w-full max-w-sm space-y-4 mb-4">
        {/* Data Card */}
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
              your Direction
            </p>
            <p className="text-2xl font-mono text-white">{displayHeading}°</p>
          </div>
          <div className="text-center border-l border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
              Makkah
            </p>
            <p className="text-2xl font-mono text-emerald-400">
              {Number(qiblaDir).toFixed(1)}°
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={startSensors}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-2xl font-black text-white shadow-lg shadow-indigo-600/20"
          >
            {isActive ? "SENSORS ACTIVE" : "ACTIVATE COMPASS"}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 text-slate-500 text-xs font-bold uppercase tracking-widest"
          >
            Reset App
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
