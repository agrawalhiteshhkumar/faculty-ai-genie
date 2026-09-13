import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Award,
  Users,
  CheckCircle,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface SearchAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const SearchAssistantModal: React.FC<SearchAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sampleQueries = [
    'Show students with attendance < 75% in D.Pharm Pharmaceutics',
    'Which CO had the lowest attainment in Sessional 1?',
    'Generate ATR draft for CO3 attainment deficit',
    'How does MSBTE CIAAN-2023 calculate Best-of-Two sessional marks?',
  ];

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/search-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setResult(data.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (actionType: string) => {
    if (actionType === 'NAVIGATE_STUDENTS') {
      onNavigateTab('STUDENTS');
    } else if (actionType === 'NAVIGATE_OUTCOMES') {
      onNavigateTab('OUTCOMES');
    } else if (actionType === 'NAVIGATE_ASSESS') {
      onNavigateTab('ASSESS');
    } else {
      onNavigateTab('HOME');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Search Bar Input */}
        <div className="p-4 bg-slate-900 text-white flex items-center gap-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            id="academic-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && query && handleSearch(query)}
            placeholder="Ask Genie anything: defaulters, CO attainments, syllabus velocity, ATRs..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={!query || loading}
            className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 disabled:opacity-40 transition"
          >
            {loading ? 'Consulting...' : 'Ask'}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Verified Regulatory Queries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSearch(sq)}
                className="text-xs bg-white text-slate-700 hover:text-slate-950 hover:border-amber-400 border border-slate-200 px-2.5 py-1 rounded-lg transition shadow-2xs font-medium text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-medium">
                Contextualizing query with institutional master ontology & PCI / MSBTE regulations...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Genie Operational Intelligence
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  {result.directAnswer}
                </p>
              </div>

              {result.dataHighlights && result.dataHighlights.length > 0 && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-amber-900">Verified Institutional Data Evidence:</div>
                  <ul className="space-y-1 text-xs text-amber-950">
                    {result.dataHighlights.map((dh: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{dh}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendedAction && (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-indigo-700">Recommended 1-Click Action:</div>
                    <div className="text-xs font-semibold text-indigo-950 mt-0.5">
                      {result.recommendedAction}
                    </div>
                  </div>
                  <button
                    onClick={() => handleActionClick(result.actionType)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition flex items-center gap-1.5 flex-shrink-0"
                  >
                    Take Action
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Search any academic indicator or select one of the suggested regulatory queries above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
