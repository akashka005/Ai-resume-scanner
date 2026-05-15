import { motion, useSpring, useTransform } from 'framer-motion';
import { PieChart } from 'lucide-react';
import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [val, setVal] = useState(0);

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on("change", setVal);
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span className="tabular-nums">{val}</span>;
};

const fields = [
  { key: 'impact', label: 'Impact' },
  { key: 'brevity', label: 'Brevity' },
  { key: 'style', label: 'Style' },
  { key: 'structure', label: 'Structure' },
];

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="apple-card p-6 md:p-8 group">
      <h3 className="section-title mb-5 md:mb-6">
        <PieChart size={16} /> Evaluation Breakdown
      </h3>
      <div className="space-y-6">
        {fields.map((field, i) => {
          const score = breakdown[field.key] || 0;
          return (
            <div key={field.key}>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-zinc-700 text-sm font-semibold">{field.label}</span>
                <span className="text-zinc-900 text-sm font-bold bg-zinc-100 px-2.5 py-0.5 rounded-md">
                  <AnimatedNumber value={score} />/100
                </span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ type: "spring", stiffness: 40, damping: 15, delay: i * 0.1 }}
                  className="h-full bg-zinc-800 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}