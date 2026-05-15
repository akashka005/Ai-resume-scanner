import { Target } from 'lucide-react';

export default function MissingKeywords({ keywords }) {
  if (!keywords || !Array.isArray(keywords)) return null;

  return (
    <div className="apple-card p-6 md:p-8 group">
      <h3 className="section-title mb-4 md:mb-5">
        <Target size={16} /> Skill Gaps Detected
      </h3>
      <div className="flex flex-wrap gap-2 md:gap-2.5">
        {keywords.map((kw, i) => (
          <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs md:text-sm font-medium rounded-full hover:bg-zinc-100 hover:border-zinc-300 transition-colors cursor-default">
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}