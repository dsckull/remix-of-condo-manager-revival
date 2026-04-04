import { motion } from "framer-motion";

export function HexCluster() {
  const hexes = [
    { size: 120, top: "10%", left: "15%", duration: 5, delay: 0 },
    { size: 80, top: "25%", left: "80%", duration: 4, delay: 1 },
    { size: 150, top: "60%", left: "10%", duration: 6, delay: 0.5 },
    { size: 60, top: "75%", left: "70%", duration: 3.5, delay: 2 },
    { size: 90, top: "40%", left: "60%", duration: 4.5, delay: 1.5 },
    { size: 200, top: "80%", left: "85%", duration: 7, delay: 0 },
    { size: 110, top: "15%", left: "45%", duration: 5.5, delay: 0.8 },
    { size: 70, top: "50%", left: "30%", duration: 4, delay: 1.2 },
    { size: 130, top: "85%", left: "40%", duration: 6.5, delay: 0.3 },
    { size: 85, top: "35%", left: "20%", duration: 4.2, delay: 1.8 },
    { size: 160, top: "5%", left: "65%", duration: 6.2, delay: 0.7 },
    { size: 95, top: "65%", left: "55%", duration: 4.8, delay: 1.1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {hexes.map((hex, i) => (
        <motion.div
          key={i}
          className="absolute bg-card clip-hex neo-raised opacity-60"
          style={{ width: hex.size, height: hex.size, top: hex.top, left: hex.left }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: hex.duration, repeat: Infinity, ease: "easeInOut", delay: hex.delay }}
        />
      ))}
    </div>
  );
}
