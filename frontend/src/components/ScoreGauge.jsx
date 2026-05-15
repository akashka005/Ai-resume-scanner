import { motion, useSpring, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useEffect } from 'react';

export default function ScoreGauge({ score, label = 'ATS Score' }) {
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const springScore = useSpring(0, { stiffness: 40, damping: 15 });
  const displayScore = useTransform(springScore, (v) => Math.round(v));

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  return (
    <div className="apple-card p-8 flex flex-col items-center justify-center h-full relative group">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400">
        <Activity size={16} />
      </div>

      <div className="relative mt-4">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] drop-shadow-sm">
          <circle
            stroke="#f4f4f5"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke="url(#gradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.2 }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-5xl font-light text-zinc-900 tracking-tighter tabular-nums">
            {displayScore}
          </motion.span>
        </div>
      </div>
      <div className="text-center mt-6">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}