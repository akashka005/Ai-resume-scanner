import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [val, setVal] = useState(0);

  useEffect(() => {
    spring.set(Number(value) || 0);
    const unsubscribe = display.on("change", setVal);
    return () => unsubscribe();
  }, [value, spring, display]);
  if (isNaN(Number(value))) {
    return <span>{value}</span>;
  }
  return <span className="tabular-nums">{val}</span>;
};

export default function StatBar({ ats_score, match_score, skills_found_count, readability }) {
  const stats = [
    { label: 'ATS Score', value: ats_score, suffix: '' },
    { label: 'Match Score', value: match_score, suffix: '%' },
    { label: 'Skills Found', value: skills_found_count, suffix: '' },
    { label: 'Readability', value: readability.label, suffix: '' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="apple-card p-5 md:p-7 flex flex-col justify-center group"
        >
          <p className="section-title mb-2.5">{s.label}</p>
          <div className="flex items-baseline gap-1">
            <p className="font-light text-3xl md:text-5xl text-zinc-900 tracking-tighter">
              <AnimatedNumber value={s.value} />
            </p>
            {s.suffix && <span className="text-lg md:text-xl text-zinc-400 font-medium">{s.suffix}</span>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}