import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  FileText,
  Presentation,
  CheckCircle,
  Clock,
  ShieldCheck,
  Download,
  Copy,
  ChevronRight,
  Eye,
  HelpCircle,
  Video,
  Volume2,
  Workflow,
  RotateCw,
} from 'lucide-react';
import { SubjectMaster, AITeachingPackage, BloomsLevel } from '../../types';

interface CreateViewProps {
  subject: SubjectMaster | null;
  onNavigateTab?: (tab: any) => void;
}

export const CreateView: React.FC<CreateViewProps> = ({ subject, onNavigateTab }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    'Tablet Coating Defects: Mottling, Orange Peel, Capping, Sticking, Blistering'
  );
  const [targetCO, setTargetCO] = useState<string>('CO3');
  const [bloomsLevel, setBloomsLevel] = useState<BloomsLevel>('L4_ANALYZE');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pkg, setPkg] = useState<AITeachingPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'DECK' | 'NOTES' | 'VISUAL' | 'RECALL' | 'MICRO'>(
    'DECK'
  );
  const [isHumanApproved, setIsHumanApproved] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  if (!subject) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center space-y-4 max-w-4xl mx-auto my-8">
        <Sparkles className="w-12 h-12 text-slate-400 mx-auto" />
        <div>
          <h3 className="text-base font-bold text-slate-800">AI Content Studio Awaiting Curriculum</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Deterministic teaching package generation requires a curriculum subject. Please import your course curriculum via Excel/CSV or load the reference regulatory dataset.
          </p>
        </div>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('SETUP')}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs"
          >
            Open Setup & Excel Importer →
          </button>
        )}
      </div>
    );
  }

  // Flashcard flip tracker
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsHumanApproved(false);
    try {
      const res = await fetch('/api/ai/generate-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          subjectTitle: subject.title,
          subjectCode: subject.code,
          unitName: 'Unit 2: Solid Dosage Forms & Tablet Coating Technology',
          targetCO,
          bloomsLevel,
        }),
      });
      const data = await res.json();
      if (data.package) {
        setPkg(data.package);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Philosophy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
            <Sparkles className="w-3 h-3" />
            Deterministic Backend Prompt Orchestration • Zero Raw Prompting
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            AI Content Studio: One Topic → Complete Teaching Package
          </h1>
          <p className="text-xs text-slate-500">
            Select curriculum parameters. The AI Genie automatically coordinates Bloom's taxonomy, MSBTE regulations, and produces verifiable teaching assets.
          </p>
        </div>
      </div>

      {/* Curriculum Context Selectors & Trigger Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-500" />
          Curriculum Hierarchy Context Selection
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Programme & Scheme
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 truncate">
              D.Pharm Year 1 • MSBTE K-Scheme
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Subject & Unit
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 truncate">
              Pharmaceutics-I (20111) • Unit 2
            </div>
          </div>

          <div>
            <label htmlFor="create-target-co" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Target Course Outcome
            </label>
            <select
              id="create-target-co"
              value={targetCO}
              onChange={(e) => setTargetCO(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-1 focus:ring-amber-500"
            >
              <option value="CO1">CO1: Classify dosage forms & calculate posology</option>
              <option value="CO2">CO2: Formulate conventional solid dosage forms</option>
              <option value="CO3">CO3: Analyze manufacturing & coating defects</option>
              <option value="CO4">CO4: Perform quality control tests per IP</option>
            </select>
          </div>

          <div>
            <label htmlFor="create-blooms-level" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Bloom's Cognitive Level
            </label>
            <select
              id="create-blooms-level"
              value={bloomsLevel}
              onChange={(e) => setBloomsLevel(e.target.value as any)}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-1 focus:ring-amber-500"
            >
              <option value="L1_REMEMBER">L1: Remember (Factual recall)</option>
              <option value="L2_UNDERSTAND">L2: Understand (Explanation)</option>
              <option value="L3_APPLY">L3: Apply (Formulation execution)</option>
              <option value="L4_ANALYZE">L4: Analyze (Defect diagnostics)</option>
              <option value="L5_EVALUATE">L5: Evaluate (Critical comparison)</option>
              <option value="L6_CREATE">L6: Create (SOP design)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="create-topic-select" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Topic to Synthesize
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              id="create-topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="flex-1 text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-1 focus:ring-amber-500"
            >
              <option value="Tablet Coating Defects: Mottling, Orange Peel, Capping, Sticking, Blistering">
                Tablet Coating Defects: Mottling, Orange Peel, Capping, Sticking, Blistering (Unit 2)
              </option>
              <option value="Rotary Tablet Compression Principle, Tooling Cycles & Dwell Time">
                Rotary Tablet Compression Principle, Tooling Cycles & Dwell Time (Unit 2)
              </option>
              <option value="IP Friability & Disintegration QC Standards for Coated Tablets">
                IP Friability & Disintegration QC Standards for Coated Tablets (Unit 2)
              </option>
            </select>

            <button
              id="generate-teaching-package-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isGenerating ? 'Synthesizing Package...' : '1-Click Generate Teaching Package'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Package Interactive Review Panel */}
      {pkg && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Mandatory Watermark / Review Strip */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isHumanApproved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck
                className={`w-5 h-5 flex-shrink-0 ${
                  isHumanApproved ? 'text-emerald-600' : 'text-amber-600'
                }`}
              />
              <div>
                <div className="text-xs font-black tracking-wide">
                  {isHumanApproved
                    ? 'AUTHORIZED TEACHING PACKAGE — APPROVED BY FACULTY'
                    : pkg.provisionalWatermark}
                </div>
                <div className="text-[11px] opacity-85">
                  Generated at {pkg.generatedAt} • Target: {pkg.targetCO} ({pkg.bloomsLevel})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isHumanApproved ? (
                <button
                  id="approve-ai-package-btn"
                  onClick={() => setIsHumanApproved(true)}
                  className="px-4 py-1.5 text-xs font-black bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Approve as Authorized Draft
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                  ✓ Faculty Signature Attached
                </span>
              )}
            </div>
          </div>

          {/* Sub-tabs Navigation */}
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('DECK')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'DECK'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              1. Presentation Slides ({pkg.presentationDeck.length})
            </button>

            <button
              onClick={() => setActiveTab('NOTES')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'NOTES'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              2. 4-Tier Academic Notes
            </button>

            <button
              onClick={() => setActiveTab('VISUAL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'VISUAL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-emerald-400" />
              3. Visual Content (Flowchart)
            </button>

            <button
              onClick={() => setActiveTab('RECALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'RECALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-rose-400" />
              4. Active Recall & Flashcards
            </button>

            <button
              onClick={() => setActiveTab('MICRO')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'MICRO'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-purple-400" />
              5. Microlearning Scripts
            </button>
          </div>

          {/* TAB CONTENT */}

          {/* 1. PRESENTATION DECK */}
          {activeTab === 'DECK' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Lecture Slide Deck: {pkg.topic}
                  </h3>
                  <p className="text-xs text-slate-500">
                    4 Structured Slides with Speaker Notes and In-Slide Check-for-Understanding Quizzes
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(pkg.presentationDeck, null, 2),
                      'Slide Deck JSON'
                    )
                  }
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Slides
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.presentationDeck.map((slide) => (
                  <div
                    key={slide.slideNo}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                        Slide {slide.slideNo}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        MSBTE Formatted
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{slide.title}</h4>

                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      {slide.bullets.map((b, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>

                    {slide.speakerNotes && (
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                        <span className="font-bold">Faculty Speaker Note:</span> {slide.speakerNotes}
                      </div>
                    )}

                    {slide.inSlideCheck && (
                      <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200 text-[11px] text-indigo-900 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span>
                          <strong className="font-bold">In-Slide Check:</strong> {slide.inSlideCheck}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. ACADEMIC NOTES */}
          {activeTab === 'NOTES' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Faculty Reference Notes */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Tier 1: Faculty Advanced Reference Notes
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(pkg.academicNotes.facultyReferenceNotes, 'Faculty Notes')
                      }
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {pkg.academicNotes.facultyReferenceNotes}
                  </pre>
                </div>

                {/* Student Study Notes */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Tier 2: Student Structured Study Notes
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(pkg.academicNotes.studentStudyNotes, 'Student Notes')
                      }
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {pkg.academicNotes.studentStudyNotes}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Remedial Notes */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                      Tier 3: Remedial High-Yield Simplified Sheet
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(pkg.academicNotes.remedialSimplifiedNotes, 'Remedial Notes')
                      }
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-56 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {pkg.academicNotes.remedialSimplifiedNotes}
                  </pre>
                </div>

                {/* One Page Revision Sheet */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Tier 4: One-Page Exam Revision Matrix
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(pkg.academicNotes.onePageRevisionSheet, 'Revision Sheet')
                      }
                      className="text-xs text-slate-500 hover:text-slate-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-56 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                    {pkg.academicNotes.onePageRevisionSheet}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 3. VISUAL CONTENT (FLOWCHART & MERMAID) */}
          {activeTab === 'VISUAL' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Visual Defect Diagnostics Decision Tree
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mermaid TD Representation of Root Cause & Corrective Troubleshooting Actions
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(pkg.mermaidDiagram, 'Mermaid Flowchart')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Mermaid
                </button>
              </div>

              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {pkg.mermaidDiagram}
              </div>

              {/* Visual Diagnostic Chart Representation */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900">Mottling</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Unequal dye migration</div>
                  <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Fix: Aluminum Lake Pigments
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900">Orange Peel</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Premature droplet drying</div>
                  <div className="mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Fix: Move gun to 15-20cm & dilute
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900">Sticking / Picking</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Overwetting / slow drying</div>
                  <div className="mt-2 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    Fix: Lower spray rate, raise air temp
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900">Logo Bridging</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Excessive film tension</div>
                  <div className="mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Fix: Add 15% PEG-400 Plasticizer
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ACTIVE RECALL (FLASHCARDS & VIVA) */}
          {activeTab === 'RECALL' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Interactive Mnemonic Flashcards (Click to Flip)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active recall cards with memory mnemonics tailored for pharmaceutical technology exams
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pkg.activeRecall.flashcards.map((card, i) => {
                    const isFlipped = flippedCards[i];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleFlip(i)}
                        className="cursor-pointer min-h-[160px] p-5 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all shadow-xs bg-gradient-to-br from-white to-slate-50 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <span>Card {i + 1}</span>
                            <span className="text-amber-600">Tap to flip ↺</span>
                          </div>
                          {!isFlipped ? (
                            <div className="text-xs font-bold text-slate-900 leading-snug">
                              {card.front}
                            </div>
                          ) : (
                            <div className="space-y-2 animate-in fade-in">
                              <div className="text-xs font-medium text-slate-800">{card.back}</div>
                              {card.mnemonic && (
                                <div className="text-[10px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                  💡 Mnemonic: {card.mnemonic}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                          {isFlipped ? 'Answer Revealed' : 'Question Prompt'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Viva-Voce Question Bank */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900">
                  Viva-Voce Examination Question Bank
                </h3>
                <div className="space-y-3">
                  {pkg.activeRecall.vivaVoceQuestions.map((v, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Q{i + 1}: {v.q}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                          {v.cognitiveLevel}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Model Answer:</strong> {v.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. MICROLEARNING SCRIPTS */}
          {activeTab === 'MICRO' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    Microlearning Video Script & 2-Minute Audio Summary
                  </h3>
                  <p className="text-xs text-slate-500">
                    Formatted for self-paced mobile viewing or pre-class flipped classroom assignment
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg">
                  Est. Duration: {pkg.microlearning.durationEstimate}
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Volume2 className="w-4 h-4" />
                    2-Minute Rapid Audio Review Transcript
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {pkg.microlearning.audioReviewSummary}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    7-Minute Scripted Teleprompter Video Roadmap
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {pkg.microlearning.videoScript}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {copiedNotification && (
            <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in">
              ✓ {copiedNotification}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
