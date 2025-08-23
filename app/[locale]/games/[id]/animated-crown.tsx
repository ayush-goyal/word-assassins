"use client";

import { Crown } from "lucide-react";
import { motion } from "framer-motion";

export function AnimatedCrown() {
  return (
    <motion.div
      animate={{
        rotate: [-2, 2, -2],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: [0, 0.8, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Crown className="w-4 h-4 text-yellow-300 blur-[2px]" />
      </motion.div>
      <Crown className="w-4 h-4 text-yellow-500 drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]" />
    </motion.div>
  );
}
