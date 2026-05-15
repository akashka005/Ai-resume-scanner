import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-zinc-200 shadow-2xl rounded-2xl px-5 py-4 text-sm z-50">
        <p className="text-zinc-500 mb-1 font-medium">{payload[0].payload.dimension}</p>
        <p className="text-zinc-900 font-bold text-2xl tracking-tight">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function SkillsRadar({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    dimension: key,
    score: value,
    fullMark: 100,
  }));

  return (
    <div className="apple-card p-6 md:p-8 group relative">
      <h3 className="section-title mb-4 md:mb-6">
        <Crosshair size={16} /> Capability Radar
      </h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        className="h-56 md:h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <PolarGrid stroke="#e4e4e7" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#71717a', fontSize: 8, fontWeight: 600 }}
            />
            <Radar
              name="Skills"
              dataKey="score"
              stroke="#171717"
              strokeWidth={2.5}
              fill="#171717"
              fillOpacity={0.03}
              activeDot={{ r: 5, fill: '#171717', stroke: '#fff', strokeWidth: 2 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}