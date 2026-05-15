import { motion, useSpring, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';
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

  return <span className="tabular-nums">{val}%</span>;
};

export default function TopSkills({ skills }) {
  if (!skills || !Array.isArray(skills)) return null;

  return (
    <div className="apple-card p-6 md:p-8 group">
      <h3 className="section-title mb-5 md:mb-6">
        <Zap size={16} /> Core Competencies
      </h3>
      <div className="space-y-5 md:space-y-6">
        {skills.map((skill, i) => {
          const isString = typeof skill === 'string';
          const name = isString ? skill : skill.name;
          const level = isString ? (95 - (i * 5)) : (skill.level || 90);

          return (
            <div key={name || i}>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-zinc-800 text-sm font-semibold">{name}</span>
                <span className="text-zinc-500 text-sm font-medium">
                  <AnimatedNumber value={level} />
                </span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${level}%` }}
                  transition={{ type: "spring", stiffness: 40, damping: 15, delay: i * 0.15 }}
                  className="h-full bg-zinc-900 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}