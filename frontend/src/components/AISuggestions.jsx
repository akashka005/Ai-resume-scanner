import { Lightbulb } from 'lucide-react';

export default function AISuggestions({ suggestions }) {
  return (
    <div className="apple-card p-6 md:p-8 group">
      <h3 className="section-title mb-5 md:mb-6">
        <Lightbulb size={16} /> Strategic Insights
      </h3>
      <div className="space-y-5 md:space-y-6">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-4 md:gap-5">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-zinc-200 shadow-sm">
              <span className="text-zinc-600 text-xs md:text-sm font-bold">{i + 1}</span>
            </div>
            <p className="text-zinc-700 text-xs md:text-sm leading-relaxed mt-1 font-medium">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}