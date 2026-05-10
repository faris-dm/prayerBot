import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { findQiblaAngle, getCleanHeading } from "./compass";

function App() {
  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleMotion = (event) => {
    const actualHeading = getCleanHeading(event);
    if (actualHeading !== null) setHeading(actualHeading);
  };

  const startSensors = async () => {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        const angle = findQiblaAngle(
          data.coords.latitude,
          data.coords.longitude
        );
        setQiblaDir(angle);
        setIsActive(true);
      },
      (err) => alert("Please enable location")
    );

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      const state = await DeviceOrientationEvent.requestPermission();
      if (state === "granted")
        window.addEventListener("deviceorientation", handleMotion, true);
    } else {
      window.addEventListener("deviceorientation", handleMotion, true);
    }
  };

  // 3-Digit Decimal Logic for Abu Dream
  const currentHeading = Number(heading) || 0;

  // 2. Format it to 1 decimal place (e.g., 10.4)
  const displayHeading = currentHeading.toFixed(0);

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

        {/* Outer Directional Ring */}
        <div className="absolute w-full h-full border-2 border-slate-800 rounded-full flex items-center justify-center">
          <span className="absolute top-4 font-black text-indigo-400">N</span>
          <span className="absolute bottom-4 font-black text-rose-400">S</span>
          <span className="absolute right-4 font-black text-amber-400">E</span>
          <span className="absolute left-4 font-black text-cyan-400">W</span>
        </div>

        {/* 1. THE CENTER POINT (Stationary) */}
        <div className="absolute flex items-center justify-center z-30">
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        </div>

        {/* 2. THE ROTATING COMPASS FACE */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
          className="relative w-[75%] h-[75%] rounded-full border border-slate-700 bg-slate-900/50 shadow-2xl flex items-center justify-center"
        >
          <div className="w-1 h-4 bg-indigo-500 absolute top-0"></div>
        </motion.div>

        {/* 3. THE QIBLA LINE & ICON (Points to Makkah) */}
        <motion.div
          animate={{ rotate: qiblaDir - heading }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute w-full h-full flex items-center justify-center pointer-events-none"
        >
          <div className="h-full flex flex-col items-center justify-start pt-2">
            <span className="text-4xl drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] z-20">
              🕋
            </span>
            {/* THE LINE ADDED HERE */}
            <div className="w-[1.5px] h-64 bg-gradient-to-b from-emerald-400 via-emerald-500/20 to-transparent -mt-1 opacity-90"></div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER DATA */}
      <div className="w-full max-w-sm space-y-4 mb-4">
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
              Your Direction
            </p>
            <p className="text-2xl font-mono text-white">{displayHeading}°</p>
          </div>
          <div className="text-center border-l border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
              Makkah
            </p>
            <p className="text-2xl font-mono text-emerald-400">
              {Number(qiblaDir).toFixed(0)}°
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={startSensors}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all rounded-2xl font-black text-white"
          >
            {isActive ? "SENSORS ACTIVE" : "ACTIVATE COMPASS"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
