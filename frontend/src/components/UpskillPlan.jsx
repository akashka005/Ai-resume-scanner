import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, ChevronRight, ExternalLink, Book, Github, Play, FileText, X } from 'lucide-react';

export default function UpskillPlan({ plan }) {
  const [selectedWeek, setSelectedWeek] = useState(null);

  if (!plan) return null;

  return (
    <div className="relative">
      <div className="apple-card p-6 md:p-8 group">
        <h3 className="section-title mb-5 md:mb-6">
          <Rocket size={16} /> 30-Day Accelerated Upskill Roadmap
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {plan.map((day, i) => (
            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={i}
              onClick={() => setSelectedWeek(day)}
              className="p-5 md:p-6 bg-zinc-50 border border-zinc-100 rounded-2xl relative overflow-hidden text-left hover:border-zinc-900 transition-all flex flex-col h-full group/card shadow-sm"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity">
                <Target size={40} />
              </div>

              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{day.day}</p>
              <p className="text-zinc-900 font-semibold text-lg leading-tight mb-5">{day.focus}</p>

              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 group-hover/card:text-zinc-900 transition-colors uppercase tracking-[0.2em] mt-auto">
                Resources <ChevronRight size={12} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedWeek && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWeek(null)}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[110] border-l border-zinc-200 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-2">{selectedWeek.day}</p>
                    <h4 className="text-2xl font-bold text-zinc-900 tracking-tight">{selectedWeek.focus}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedWeek(null)}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-zinc-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  <section>
                    <h5 className="section-title mb-4">Milestones</h5>
                    <ul className="space-y-4">
                      {selectedWeek.action_items.map((item, j) => (
                        <li key={j} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-700 text-sm leading-relaxed flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h5 className="section-title mb-4">Curated Resources</h5>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedWeek.resources && selectedWeek.resources.length > 0 ? (
                        selectedWeek.resources.map((res, k) => (
                          <a
                            key={k}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-900 hover:shadow-lg transition-all group/link"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500 group-hover/link:bg-zinc-900 group-hover/link:text-white transition-colors">
                                {res.type === 'GitHub' && <Github size={20} />}
                                {res.type === 'Video' && <Play size={20} />}
                                {res.type === 'Docs' && <Book size={20} />}
                                {res.type === 'Article' && <FileText size={20} />}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{res.type}</p>
                                <p className="text-sm font-semibold text-zinc-900">{res.title}</p>
                              </div>
                            </div>
                            <ExternalLink size={14} className="text-zinc-300 group-hover/link:text-zinc-900 transition-colors" />
                          </a>
                        ))
                      ) : (
                        <div className="p-10 text-center bg-zinc-50 rounded-2xl border border-zinc-100">
                          <p className="text-zinc-400 text-sm italic">Standard resources being curated...</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>

              <div className="sticky bottom-0 p-8 bg-gradient-to-t from-white via-white pt-10">
                <button
                  onClick={() => setSelectedWeek(null)}
                  className="btn-apple w-full"
                >
                  Close Roadmap
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}