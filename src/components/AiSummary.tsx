import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { getAlbumAnalysis } from '../services/geminiService';

interface AiSummaryProps {
  artist: string;
  album: string;
}

const AiSummary: React.FC<AiSummaryProps> = ({ artist, album }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnalyze = async () => {
    if (analysis) {
        setIsOpen(!isOpen);
        return;
    }
    
    setLoading(true);
    setIsOpen(true);
    const result = await getAlbumAnalysis(artist, album);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 overflow-hidden">
      <button 
        onClick={handleAnalyze}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-indigo-300">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">AI 평론가의 분석</span>
          {!analysis && !loading && <span className="text-xs bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">Click to Generate</span>}
        </div>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
        ) : (
          isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="h-px w-full bg-indigo-500/20 mb-4"></div>
          {loading ? (
            <div className="py-8 text-center text-sm text-indigo-300/70 animate-pulse">
              Gemini가 앨범을 분석하고 있습니다...
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-line leading-relaxed">
              {analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiSummary;