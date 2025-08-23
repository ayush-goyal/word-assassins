"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface BloodSplatterProps {
  show: boolean;
}

const BLOOD_COLORS = [
  "#8B0000", // Dark red
  "#800000", // Maroon
  "#A91B0D", // Blood red
  "#960018", // Carmine
  "#710C04", // Dark blood
];

export function BloodSplatter({ show }: BloodSplatterProps) {
  // Add global styles for blood effects only on client side
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .blood-drop {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      }
      .blood-splatter {
        clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove styles when component unmounts
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Create multiple blood drops with varying properties
  const drops = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.3,
    scale: 0.5 + Math.random() * 2,
    rotation: Math.random() * 360,
    color: BLOOD_COLORS[Math.floor(Math.random() * BLOOD_COLORS.length)],
    type: Math.random() > 0.5 ? "drop" : "splatter",
  }));

  // Create drip trails
  const drips = Array.from({ length: 10 }, (_, i) => ({
    id: `drip-${i}`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    height: 50 + Math.random() * 150,
    color: BLOOD_COLORS[Math.floor(Math.random() * BLOOD_COLORS.length)],
  }));

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Blood overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: `radial-gradient(circle at 50% 0%, ${BLOOD_COLORS[0]} 0%, transparent 70%)`,
            }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Drip trails */}
          {drips.map((drip) => (
            <motion.div
              key={drip.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: drip.height,
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 2.5,
                delay: drip.delay,
                ease: "easeOut",
              }}
              style={{
                left: drip.left,
                background: `linear-gradient(to bottom, ${drip.color} 0%, transparent 100%)`,
                width: "2px",
                position: "absolute",
                top: 0,
                filter: "blur(1px)",
              }}
            />
          ))}

          {/* Blood drops and splatters */}
          {drops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{
                opacity: 0,
                y: -50,
                x: drop.left,
                scale: drop.scale,
                rotate: drop.rotation,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [
                  -50,
                  window.innerHeight * (0.2 + Math.random() * 0.8),
                  window.innerHeight * (0.3 + Math.random() * 0.7),
                  window.innerHeight,
                ],
                scaleY: [1, 1.5, 2, 2.2],
                rotate: drop.rotation + (Math.random() > 0.5 ? 180 : -180),
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: drop.delay,
                ease: [0.23, 0.96, 0.58, 1],
              }}
              className={`absolute top-0 ${
                drop.type === "drop" ? "blood-drop" : "blood-splatter"
              }`}
              style={{
                left: drop.left,
                backgroundColor: drop.color,
                width: drop.type === "drop" ? "8px" : "12px",
                height: drop.type === "drop" ? "8px" : "12px",
                filter: `blur(${drop.type === "drop" ? "1px" : "2px"})`,
                boxShadow: `0 0 10px ${drop.color}66`,
                borderRadius:
                  drop.type === "drop"
                    ? "50% 50% 50% 50% / 60% 60% 40% 40%"
                    : "50% 0% 50% 50%",
              }}
            >
              {/* Additional splatter details for more realism */}
              {drop.type === "splatter" && (
                <>
                  <motion.div
                    className="absolute"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    style={{
                      width: "100%",
                      height: "100%",
                      background: drop.color,
                      borderRadius: "50% 0% 50% 50%",
                      transform: "rotate(45deg)",
                      opacity: 0.7,
                    }}
                  />
                  <motion.div
                    className="absolute"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.1, 0.9] }}
                    style={{
                      width: "70%",
                      height: "70%",
                      background: drop.color,
                      borderRadius: "50%",
                      left: "15%",
                      top: "15%",
                      opacity: 0.8,
                    }}
                  />
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
