import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ progress, className = "", colorClass = "bg-primary" }: ProgressBarProps) {
  return (
    <div className={`h-2 w-full bg-secondary overflow-hidden rounded-full ${className}`}>
      <motion.div
        className={`h-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
