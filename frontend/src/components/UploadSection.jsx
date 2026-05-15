import { useState, useRef } from 'react';
import { Upload, ChevronDown, FileCheck, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MODELS = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
];

export default function UploadSection({ onScan, isLoading }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [targetRole, setTargetRole] = useState('');
  const [modelOpen, setModelOpen] = useState(false);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') setFile(f);
  };

  const handleScan = () => {
    if (file && targetRole.trim()) onScan(file, selectedModel.id, targetRole);
  };

  return (
    <div className="apple-card p-6 md:p-8 h-full flex flex-col gap-5 md:gap-6 relative overflow-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-24px p-6"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-full h-full rounded-full border-4 border-zinc-100 border-t-zinc-900"
              />
              <Sparkles className="absolute inset-0 m-auto text-zinc-900" size={16} />
            </div>
            <p className="mt-4 md:mt-6 text-zinc-900 font-semibold tracking-tight text-center">Extracting Intelligence...</p>
            <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Analyzing multi-dimensional skill vectors</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <p className="text-xs md:text-sm font-semibold text-zinc-900 mb-2">Target Position</p>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. ML Engineer"
          className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl px-4 py-3 md:py-3.5 text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all"
        />
      </div>
      <div className="relative">
        <p className="text-xs md:text-sm font-semibold text-zinc-900 mb-2">Processing Engine</p>
        <button
          onClick={() => setModelOpen(!modelOpen)}
          className="w-full flex items-center justify-between px-4 py-3 md:py-3.5 bg-zinc-50/50 border border-zinc-200 rounded-2xl hover:bg-zinc-100 transition-colors text-sm"
        >
          <span className="text-zinc-900 font-medium truncate">{selectedModel.name}</span>
          <ChevronDown size={16} className="text-zinc-500 flex-shrink-0" />
        </button>
        <AnimatePresence>
          {modelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              className="absolute top-full mt-2 w-full bg-white border border-zinc-200 rounded-2xl overflow-hidden z-20 shadow-2xl"
            >
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-sm hover:bg-zinc-50 transition-colors text-zinc-700"
                >
                  <span className={selectedModel.id === m.id ? 'font-semibold text-zinc-900' : 'font-medium'}>{m.name}</span>
                  {selectedModel.id === m.id && <div className="w-2 h-2 rounded-full bg-zinc-900" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileRef.current?.click()}
        className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 min-h-[140px] md:min-h-[160px]
          ${isDragging ? 'border-zinc-900 bg-zinc-50 scale-105' : 'border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50/50'}`}
      >
        {file ? (
          <div className="text-center p-4 flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center mb-2 md:mb-3">
              <FileCheck size={18} className="text-green-600" />
            </div>
            <p className="text-zinc-900 font-semibold text-xs md:text-sm truncate max-w-[200px]">{file.name}</p>
            <p className="text-zinc-500 text-[10px] md:text-xs mt-1">Ready • {(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="text-center p-4 flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-2 md:mb-3 border border-zinc-100 shadow-sm">
              <FileText size={18} className="text-zinc-600" />
            </div>
            <p className="text-zinc-800 text-xs md:text-sm font-semibold">Drop resume here</p>
            <p className="text-zinc-400 text-[10px] md:text-xs mt-1">PDF format up to 5MB</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
      </motion.div>
      <button
        onClick={handleScan}
        disabled={!file || isLoading || !targetRole.trim()}
        className="btn-apple w-full py-3 md:py-4 text-xs md:text-sm font-semibold tracking-wide"
      >
        Execute Analysis
      </button>
    </div>
  );
}