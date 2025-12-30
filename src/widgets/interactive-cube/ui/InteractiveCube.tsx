import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Poster1 from '../../shared/assets/images/poster1.jpg'; // Pending assets setup

/**
 * Temporary interface for anime posters
 */
interface Poster {
  id: number;
  src: string;
  alt: string;
}

/**
 * Interactive cube widget.
 * Animates a 3D-like panel with a texture when triggered.
 */
export const InteractiveCube = () => {
  // We keep activePoster to control visibility during the test phase
  const [activePoster] = useState<Poster | null>(null);

  return (
    <AnimatePresence>
      {activePoster && (
        <motion.div
          // Fly-in and rotate effect
          initial={{
            scale: 0.5,
            opacity: 0,
            rotateY: 90,
            x: "-50%",
            y: "-50%",
          }}
          animate={{ scale: 1, opacity: 1, rotateY: 0, x: "-50%", y: "-50%" }}
          exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed z-50 w-64 h-64 shadow-[0_0_50px_rgba(79,70,229,0.4)] rounded-2xl overflow-hidden border border-white/20"
          style={{
            top: "50%",
            left: "50%",
            perspective: "1000px",
          }}
        >
          <img
            src={activePoster.src}
            alt={activePoster.alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
