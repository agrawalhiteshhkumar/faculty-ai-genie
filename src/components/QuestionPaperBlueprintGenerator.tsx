import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  RefreshCw,
  Layers,
  HelpCircle,
  Award,
  Sliders,
  Calendar,
  Clock,
  Eye,
  BookOpen,
} from 'lucide-react';
import { InstitutionProfile, SubjectMaster } from '../types';
import { InstitutionSeal } from './InstitutionSeal';
import { DPK_COLLEGE_IDENTITY } from '../data/msbteProformasData';

interface QuestionPaperBlueprintGeneratorProps {
  institution: InstitutionProfile | null;
  subject: SubjectMaster | null;
}

interface QuestionItem {
  id: string;
  section: 'A' | 'B' | 'C';
  question: string;
  marks: number;
  unit: string;
  bloomsLevel: 'Remembering' | 'Understanding' | 'Applying' | 'Analyzing';
  mappedCO: string;
  modelAnswer: string;
  markingScheme: { step: string; marks: number }[];
}

const QUESTION_BANK: QuestionItem[] = [
  // SECTION A (10 x 1 Mark)
  {
    id: 'QA-1',
    section: 'A',
    question: 'Define the term "Pharmacopoeia" and state the publication year of the First Edition of the Indian Pharmacopoeia.',
    marks: 1,
    unit: 'Unit 1',
    bloomsLevel: 'Remembering',
    mappedCO: 'CO1',
    modelAnswer: 'Pharmacopoeia is an official book containing a list of medicinal drugs with their standards, descriptions, dosage, and tests for purity. First Edition of IP was published in 1955.',
    markingScheme: [
      { step: 'Accurate definition of Pharmacopoeia', marks: 0.5 },
      { step: 'Correct year of First Edition (1955)', marks: 0.5 },
    ],
  },
  {
    id: 'QA-2',
    section: 'A',
    question: 'Which test is prescribed by IP to determine the chemical durability and alkalinity of Type-I borosilicate glass containers?',
    marks: 1,
    unit: 'Unit 1',
    bloomsLevel: 'Remembering',
    mappedCO: 'CO1',
    modelAnswer: 'The Powdered Glass Test (Water Attack Test) with dilute acid titration using methyl red indicator.',
    markingScheme: [
      { step: 'Mentioning Powdered Glass Test & indicator', marks: 1.0 },
    ],
  },
  {
    id: 'QA-3',
    section: 'A',
    question: 'State the formula for calculating child dose according to Young’s Rule based on age.',
    marks: 1,
    unit: 'Unit 2',
    bloomsLevel: 'Applying',
    mappedCO: 'CO1',
    modelAnswer: 'Young’s Rule: Child Dose = [Age in years / (Age in years + 12)] × Adult Dose (applicable for children up to 12 years).',
    markingScheme: [
      { step: 'Correct formula with age limits', marks: 1.0 },
    ],
  },
  {
    id: 'QA-4',
    section: 'A',
    question: 'Define "Displacement Value" as applied to the formulation of suppositories.',
    marks: 1,
    unit: 'Unit 3',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO2',
    modelAnswer: 'Displacement value is the number of parts by weight of a medicament that displaces one part by weight of the theobroma oil (cocoa butter) suppository base.',
    markingScheme: [
      { step: 'Complete scientific definition with reference base', marks: 1.0 },
    ],
  },
  {
    id: 'QA-5',
    section: 'A',
    question: 'What is the concentration of sucrose (w/w) in Simple Syrup IP 2022?',
    marks: 1,
    unit: 'Unit 3',
    bloomsLevel: 'Remembering',
    mappedCO: 'CO2',
    modelAnswer: 'Simple Syrup IP contains 66.7% w/w of Sucrose in Purified Water (self-preserving due to high osmotic pressure).',
    markingScheme: [
      { step: 'Exact concentration: 66.7% w/w', marks: 1.0 },
    ],
  },
  {
    id: 'QA-6',
    section: 'A',
    question: 'State the primary difference between flocculated and deflocculated suspensions in terms of sediment redispersibility.',
    marks: 1,
    unit: 'Unit 3',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO2',
    modelAnswer: 'Flocculated suspension forms loose, porous flocs that settle rapidly but redisperse readily upon mild shaking. Deflocculated suspension forms a dense, non-redispersible hard cake upon prolonged storage.',
    markingScheme: [
      { step: 'Comparison of sediment properties and redispersibility', marks: 1.0 },
    ],
  },
  {
    id: 'QA-7',
    section: 'A',
    question: 'Define "Angle of Repose" and state the mathematical relationship between tan θ, height (h), and radius (r).',
    marks: 1,
    unit: 'Unit 4',
    bloomsLevel: 'Applying',
    mappedCO: 'CO3',
    modelAnswer: 'Angle of repose (θ) is the maximum angle possible between the surface of a powder pile and the horizontal plane. tan θ = h / r. Values < 25° indicate excellent flow.',
    markingScheme: [
      { step: 'Definition & formula tan θ = h/r', marks: 1.0 },
    ],
  },
  {
    id: 'QA-8',
    section: 'A',
    question: 'Name any two disintegration mechanisms exhibited by superdisintegrants (e.g., Croscarmellose sodium) in fast-dissolving tablets.',
    marks: 1,
    unit: 'Unit 4',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO3',
    modelAnswer: '1) Rapid capillary action / water wicking into porous matrix; 2) Rapid swelling upon contact with aqueous gastrointestinal fluid.',
    markingScheme: [
      { step: 'Two correct mechanisms (wicking, swelling)', marks: 1.0 },
    ],
  },
  {
    id: 'QA-9',
    section: 'A',
    question: 'What is the permitted bacterial endotoxin limit for Sterile Water for Injections (SWFI) as per IP?',
    marks: 1,
    unit: 'Unit 5',
    bloomsLevel: 'Remembering',
    mappedCO: 'CO4',
    modelAnswer: 'Not more than 0.25 Endotoxin Units (EU) per mL when tested by Limulus Amebocyte Lysate (LAL) gel-clot assay.',
    markingScheme: [
      { step: 'Limit 0.25 EU/mL and reference LAL test', marks: 1.0 },
    ],
  },
  {
    id: 'QA-10',
    section: 'A',
    question: 'Define "HEPA Filter" and state its minimum particle retention efficiency at 0.3 microns.',
    marks: 1,
    unit: 'Unit 5',
    bloomsLevel: 'Remembering',
    mappedCO: 'CO5',
    modelAnswer: 'High Efficiency Particulate Air filter; retains at least 99.97% of airborne particles with an aerodynamic diameter of 0.3 microns or larger.',
    markingScheme: [
      { step: 'Full form & retention specification (99.97% at 0.3 µm)', marks: 1.0 },
    ],
  },

  // SECTION B (Attempt 5 of 6 x 3 Marks = 15 Marks)
  {
    id: 'QB-1',
    section: 'B',
    question: 'Describe the method of preparation, container sealing, and statutory labeling requirements for Simple Syrup IP.',
    marks: 3,
    unit: 'Unit 3',
    bloomsLevel: 'Applying',
    mappedCO: 'CO2',
    modelAnswer: 'Weigh 667g of pure sucrose. Dissolve in heated purified water (sufficient quantity), boil gently with stirring until dissolved. Cool, filter hot through clean cotton cloth, add purified water to make 1000g. Store in well-closed, amber glass bottles at a temperature not exceeding 25°C. Label must state sucrose percentage and precautionary instruction not to freeze.',
    markingScheme: [
      { step: 'Composition & calculation (66.7% w/w)', marks: 1.0 },
      { step: 'Compounding procedure & hot filtration', marks: 1.0 },
      { step: 'Storage & statutory label details', marks: 1.0 },
    ],
  },
  {
    id: 'QB-2',
    section: 'B',
    question: 'Explain the principle, construction, and working of a Ball Mill with a neat labeled schematic diagram.',
    marks: 3,
    unit: 'Unit 4',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO3',
    modelAnswer: 'Principle: Size reduction occurs by combination of Impact (falling balls) and Attrition (friction between balls and shell). Construction: Hollow cylindrical vessel rotated horizontally on its longitudinal axis, filled 30-50% with steel or ceramic balls. Working: At optimum operating speed (critical speed Nc), balls are carried nearly to top and cascade downward, imparting maximum impact on coarse drugs.',
    markingScheme: [
      { step: 'Labeled diagram of Ball Mill cascading dynamics', marks: 1.0 },
      { step: 'Principle of Impact & Attrition', marks: 1.0 },
      { step: 'Working at Critical Speed calculation', marks: 1.0 },
    ],
  },
  {
    id: 'QB-3',
    section: 'B',
    question: 'Differentiate between Oil-in-Water (O/W) and Water-in-Oil (W/O) emulsions using any three official identification tests.',
    marks: 3,
    unit: 'Unit 3',
    bloomsLevel: 'Analyzing',
    mappedCO: 'CO2',
    modelAnswer: '1. Dilution Test: O/W easily dilutes with water without phase separation; W/O cracks upon water addition. 2. Dye Test: Water-soluble Amaranth dye colors external continuous phase in O/W; Oil-soluble Scarlet-Red colors continuous phase in W/O. 3. Conductivity Test: O/W conducts electric current and glows lamp; W/O shows negligible conductivity.',
    markingScheme: [
      { step: 'Dilution test comparison', marks: 1.0 },
      { step: 'Dye test (Amaranth vs Sudan III / Scarlet Red)', marks: 1.0 },
      { step: 'Conductivity test mechanism & fluorescence test', marks: 1.0 },
    ],
  },
  {
    id: 'QB-4',
    section: 'B',
    question: 'Calculate the quantity of sodium chloride required to prepare 500 mL of a 1% w/v solution of procaine hydrochloride isosmotic with blood plasma (Freezing point depression of 1% procaine HCl = 0.12°C, 1% NaCl = 0.58°C).',
    marks: 3,
    unit: 'Unit 2',
    bloomsLevel: 'Applying',
    mappedCO: 'CO1',
    modelAnswer: 'Depression of blood plasma = 0.52°C. Required adjustment = 0.52 - 0.12 = 0.40°C. Weight of NaCl required (% w/v) = (0.52 - 0.12) / 0.58 = 0.40 / 0.58 = 0.6896% w/v. For 500 mL: (0.6896 × 500) / 100 = 3.448 g of Sodium Chloride required.',
    markingScheme: [
      { step: 'Correct formula for freezing point depression', marks: 1.0 },
      { step: 'Calculation of percentage adjustment (0.6896%)', marks: 1.0 },
      { step: 'Final accurate quantity for 500 mL (3.45 g)', marks: 1.0 },
    ],
  },
  {
    id: 'QB-5',
    section: 'B',
    question: 'Describe the official Indian Pharmacopoeia Quality Control evaluation tests for Hard Gelatin Capsules (Weight Variation and Disintegration).',
    marks: 3,
    unit: 'Unit 4',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO3',
    modelAnswer: '1. Weight Variation Test: Weigh 20 intact capsules individually. Open capsules, empty contents, wash shell with solvent, dry, and weigh shells. Determine individual net fill weights and compare deviations against IP limits (±10% for <300mg, ±7.5% for ≥300mg). 2. Disintegration Test: Tested in water at 37°C ± 2°C using basket-rack assembly. Hard gelatin capsules must disintegrate within 30 minutes.',
    markingScheme: [
      { step: 'Weight variation procedure and tolerance limits', marks: 1.5 },
      { step: 'Disintegration test parameters & time limit (30 mins)', marks: 1.5 },
    ],
  },
  {
    id: 'QB-6',
    section: 'B',
    question: 'Explain the components and sterilization cycle parameters of a Horizontal High-Pressure Steam Autoclave.',
    marks: 3,
    unit: 'Unit 5',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO4',
    modelAnswer: 'Autoclave uses moist heat under saturated pressure. Standard holding cycle: 121°C at 15 psi (1.05 kg/cm²) for 15 minutes or 134°C at 30 psi for 3 minutes. Components: Double-walled pressure chamber, steam safety valve, vacuum air-ejection pump, temperature probe, and automated cycle timer. Destroys bacterial vegetative cells and resistant endospores (Geobacillus stearothermophilus biological indicator).',
    markingScheme: [
      { step: 'Temperature, pressure & holding time standards', marks: 1.0 },
      { step: 'Chamber components & air displacement cycle', marks: 1.0 },
      { step: 'Biological sterilization indicator verification', marks: 1.0 },
    ],
  },

  // SECTION C (Attempt 3 of 4 x 5 Marks = 15 Marks)
  {
    id: 'QC-1',
    section: 'C',
    question: 'Explain in detail the tablet compression process using rotary tablet presses. Discuss four common compression defects (Capping, Lamination, Sticking, and Mottling) with their root causes and remedial corrective measures.',
    marks: 5,
    unit: 'Unit 4',
    bloomsLevel: 'Applying',
    mappedCO: 'CO3',
    modelAnswer: 'Compression cycle: Die filling -> Weight scraping -> Pre-compression -> Main compression -> Tablet ejection. Defects & Remedies: 1. Capping: Partial or complete separation of top/bottom crown. Cause: Air entrapment, fine powder excess. Remedy: Pre-compression dwell time, slow turret speed, taper dies. 2. Lamination: Separation into horizontal layers. Cause: Excess entrapped air or fatty lubricants. Remedy: Use hygroscopic binders. 3. Sticking: Granules adhering to punch faces. Cause: Inadequate drying (moisture >2%) or worn punches. Remedy: Dry granules, polish tooling, add colloidal silica (Aerosil). 4. Mottling: Unequal distribution of color. Cause: Drug migration during drying. Remedy: Change binder, reduce drying temperature, use dye lake.',
    markingScheme: [
      { step: 'Compression stages flowchart (Filling, Tamping, Ejection)', marks: 1.0 },
      { step: 'Capping & Lamination causes and tooling remedies', marks: 1.5 },
      { step: 'Sticking & Picking causes and lubrication adjustments', marks: 1.5 },
      { step: 'Mottling causes and coloring solvent remedies', marks: 1.0 },
    ],
  },
  {
    id: 'QC-2',
    section: 'C',
    question: 'Describe the design, environmental monitoring, and air handling specifications for a Cleanroom Facility for sterile ophthalmic and parenteral manufacturing according to Schedule M and WHO-GMP guidelines.',
    marks: 5,
    unit: 'Unit 5',
    bloomsLevel: 'Analyzing',
    mappedCO: 'CO5',
    modelAnswer: 'Schedule M Cleanroom Architecture: Grade A (Laminar Air Flow Class 100 workstation, velocity 0.45 m/s, terminal 0.3µm HEPA filters, max 3,520 particles/m³ at 0.5µm). Grade B: Background environment for Grade A aseptic filling. Grade C: Preparation of solutions to be filtered. Grade D: Handling of raw components and washing. HVAC air cascade: Positive pressure gradient of 10-15 Pascals maintained from cleanroom to adjacent areas to prevent ingress of non-viable particulates. 20-40 air changes/hour. Environmental monitoring: Settle plates (4 hours exposure), active air samplers, surface contact plates, and continuous optical particle counters.',
    markingScheme: [
      { step: 'Grade A, B, C, D classification and particulate limits', marks: 2.0 },
      { step: 'Pressure cascades (10-15 Pa) & air change cycles', marks: 1.5 },
      { step: 'Microbiological environmental monitoring protocols', marks: 1.5 },
    ],
  },
  {
    id: 'QC-3',
    section: 'C',
    question: 'Discuss the formulation aspects of Pharmaceutical Suspensions. Explain the roles of wetting agents, suspending agents, and flocculating agents, and describe the sedimentation volume evaluation method.',
    marks: 5,
    unit: 'Unit 3',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO2',
    modelAnswer: 'Pharmaceutical Suspensions: Coarse dispersions of insoluble active ingredients in an aqueous vehicle. Formulation Additives: 1. Wetting Agents (Polysorbate 80, Sodium Lauryl Sulfate): Reduce solid-liquid interfacial tension, displacement of adsorbed air on hydrophobic drug particles. 2. Suspending / Viscosity Builders (Carboxymethylcellulose, Xanthan Gum, Bentonite): Impart pseudoplastic rheology, retard settling velocity per Stokes’ Law (v = d²(ρs - ρl)g / 18η). 3. Flocculating Agents (Monobasic potassium phosphate, aluminum chloride): Neutralize zeta potential to -20mV to -30mV, forming controllable loose aggregates. Sedimentation Volume (F) = Ultimate sediment height (Vu) / Initial total height (Vo). Ideal controlled flocculation F ≈ 1.0 without caking.',
    markingScheme: [
      { step: 'Stokes’ Law equation & sedimentation velocity factors', marks: 1.5 },
      { step: 'Mechanism of Wetting, Suspending, and Flocculating agents', marks: 2.0 },
      { step: 'Sedimentation volume (F) calculation and graph interpretation', marks: 1.5 },
    ],
  },
  {
    id: 'QC-4',
    section: 'C',
    question: 'Classify packaging materials used for pharmaceutical dosage forms. Detail the advantages, disadvantages, and IP hydrolytic resistance tests for Types I, II, III, and NP Glass Containers.',
    marks: 5,
    unit: 'Unit 1',
    bloomsLevel: 'Understanding',
    mappedCO: 'CO1',
    modelAnswer: 'Glass Classification per IP 2022: Type I (Neutral / Highly resistant Borosilicate Glass): SiO2 + B2O3, superior thermal and hydrolytic resistance, suitable for parenterals at any pH. Type II (Treated Soda-Lime Glass): Surface de-alkalized with sulfur dioxide vapors, suitable for acidic and neutral aqueous parenterals. Type III (Regular Soda-Lime Glass): Moderate chemical resistance, suitable for non-aqueous parenterals and dry powders. Type NP (General Purpose Soda-Lime Glass): Not for parenterals; used for oral liquids and topical ointments. IP Hydrolytic Resistance Tests: Powdered Glass Test: Crushed, sieved glass (300-425µm) autoclaved at 121°C for 30 min in purified water; extract titrated against 0.01M HCl with methyl red. Water Attack Test: Conducted on intact containers for Type II treated glass.',
    markingScheme: [
      { step: 'Classification and composition of Types I, II, III, NP Glass', marks: 2.0 },
      { step: 'Powdered Glass Test methodology and titration limits', marks: 1.5 },
      { step: 'Water Attack Test for sulfur dioxide treated containers', marks: 1.5 },
    ],
  },
];

export const QuestionPaperBlueprintGenerator: React.FC<QuestionPaperBlueprintGeneratorProps> = ({
  institution,
  subject,
}) => {
  const [selectedExam, setSelectedExam] = useState<'S1' | 'S2' | 'S3'>('S1');
  const [viewMode, setViewMode] = useState<'PAPER' | 'MODEL_ANSWER' | 'BLUEPRINT_MATRIX'>('PAPER');
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'SETTINGS'>('PREVIEW');

  // Blueprint target weights
  const [rememberingWeight, setRememberingWeight] = useState(35);
  const [understandingWeight, setUnderstandingWeight] = useState(45);
  const [applyingWeight, setApplyingWeight] = useState(20);

  // Selected questions state
  const [selectedSectionA, setSelectedSectionA] = useState<QuestionItem[]>(
    QUESTION_BANK.filter((q) => q.section === 'A')
  );
  const [selectedSectionB, setSelectedSectionB] = useState<QuestionItem[]>(
    QUESTION_BANK.filter((q) => q.section === 'B')
  );
  const [selectedSectionC, setSelectedSectionC] = useState<QuestionItem[]>(
    QUESTION_BANK.filter((q) => q.section === 'C')
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const college = institution?.name || DPK_COLLEGE_IDENTITY.name;
  const aishe = institution?.aisheCode || DPK_COLLEGE_IDENTITY.aisheCode;
  const pci = institution?.pciCode || DPK_COLLEGE_IDENTITY.pciCode;
  const dte = institution?.dteCode || DPK_COLLEGE_IDENTITY.dteCode;
  const msbte = institution?.msbteCode || DPK_COLLEGE_IDENTITY.msbteCode;

  const handleRandomizeAndRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Shuffle slightly or randomize
      setSelectedSectionA([...QUESTION_BANK.filter((q) => q.section === 'A')].sort(() => 0.5 - Math.random()));
      setSelectedSectionB([...QUESTION_BANK.filter((q) => q.section === 'B')].sort(() => 0.5 - Math.random()));
      setSelectedSectionC([...QUESTION_BANK.filter((q) => q.section === 'C')].sort(() => 0.5 - Math.random()));
      setIsGenerating(false);
      setFeedback('Randomized MSBTE Sessional Question Paper & Model Answer Scheme Generated Successfully!');
      setTimeout(() => setFeedback(null), 3000);
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                MSBTE Sessional Format (40M Scaled to 20 • 90 Mins)
              </span>
              <span className="text-xs text-slate-300 font-mono">
                PCI ER-2020 Quality Assurance
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Automated Question Paper Blueprint & Model Answer Generator
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Construct compliant Sessional Question Papers mapped across Unit syllabi, Bloom’s Cognitive Taxonomy, and Course Outcomes (CO1 to CO5) with instant Faculty Grading Schemes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRandomizeAndRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Assembling Paper...' : 'Generate New Blueprint'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Paper / Scheme
            </button>
          </div>
        </div>

        {/* Exam and Mode Switchers */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Target Examination:</span>
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setSelectedExam('S1')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedExam === 'S1' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sessional I (Unit 1 & 2)
              </button>
              <button
                onClick={() => setSelectedExam('S2')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedExam === 'S2' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sessional II (Unit 3 & 4)
              </button>
              <button
                onClick={() => setSelectedExam('S3')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedExam === 'S3' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sessional III (Comprehensive)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Active View:</span>
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('PAPER')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  viewMode === 'PAPER' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Question Paper
              </button>
              <button
                onClick={() => setViewMode('MODEL_ANSWER')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  viewMode === 'MODEL_ANSWER' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Faculty Model Answer Scheme
              </button>
              <button
                onClick={() => setViewMode('BLUEPRINT_MATRIX')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  viewMode === 'BLUEPRINT_MATRIX' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                CO-Bloom Blueprint Matrix
              </button>
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* VIEW 1: OFFICIAL QUESTION PAPER */}
      {viewMode === 'PAPER' && (
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          {/* Official Letterhead Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
            <div className="flex justify-center mb-2">
              <InstitutionSeal profile={institution} variant="circular" size="md" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              {college}
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Department of Pharmacy • Affiliated to MSBTE Mumbai & Approved by PCI New Delhi
            </p>
            <div className="text-[11px] font-mono text-slate-700 font-bold flex flex-wrap justify-center gap-2 pt-1">
              <span>AISHE: {aishe}</span> | <span>PCI: {pci}</span> | <span>DTE: {dte}</span> | <span>MSBTE: {msbte}</span>
            </div>

            <div className="pt-3 pb-1 text-center">
              <span className="px-3 py-1 bg-slate-900 text-amber-400 rounded text-xs font-black uppercase tracking-wider">
                {selectedExam === 'S1' ? 'FIRST SESSIONAL EXAMINATION' : selectedExam === 'S2' ? 'SECOND SESSIONAL EXAMINATION' : 'THIRD SESSIONAL EXAMINATION (IMPROVEMENT)'} — 2025-2026
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-left text-xs font-bold text-slate-800 border-t border-slate-200">
              <div>Course: <span className="font-normal">{subject?.title || 'Pharmaceutics'}</span></div>
              <div>Course Code: <span className="font-mono font-normal">{subject?.code || 'ER20-11T (20111)'}</span></div>
              <div>Time Allowed: <span className="font-normal">90 Minutes (1.5 Hrs)</span></div>
              <div>Maximum Marks: <span className="font-normal font-mono">40 Marks</span></div>
            </div>
          </div>

          {/* Statutory Instructions to Candidates */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
            <div className="font-bold text-slate-900 uppercase">Instructions to Candidates per MSBTE Examination Norms:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>All questions from <strong>Section A</strong> are compulsory (10 Marks).</li>
              <li>In <strong>Section B</strong>, attempt any <strong>FIVE (5)</strong> questions out of six (15 Marks).</li>
              <li>In <strong>Section C</strong>, attempt any <strong>THREE (3)</strong> questions out of four (15 Marks).</li>
              <li>Figures to the right indicate full marks. Draw neat, labeled diagrams and write chemical equations wherever necessary.</li>
              <li>Use of non-programmable scientific calculators is permitted.</li>
            </ul>
          </div>

          {/* Section A */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-900">
              <span>SECTION A: Objective / Multiple Choice / One-Line Definitions (Compulsory)</span>
              <span className="font-mono bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-[10px]">10 Qs × 1M = 10 Marks</span>
            </div>
            <div className="space-y-2.5 pl-2">
              {selectedSectionA.map((q, idx) => (
                <div key={q.id} className="text-xs flex items-start justify-between gap-3 group">
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-900 min-w-[20px]">Q1.{idx + 1}</span>
                    <span className="text-slate-800 leading-relaxed">{q.question}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                      {q.mappedCO}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {q.bloomsLevel.slice(0, 3)}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 w-8 text-right">[1M]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-900">
              <span>SECTION B: Short Answer Questions (Attempt Any 5 of 6)</span>
              <span className="font-mono bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-[10px]">5 Qs × 3M = 15 Marks</span>
            </div>
            <div className="space-y-3 pl-2">
              {selectedSectionB.map((q, idx) => (
                <div key={q.id} className="text-xs flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-900 min-w-[20px]">Q2.{idx + 1}</span>
                    <span className="text-slate-800 leading-relaxed font-medium">{q.question}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                      {q.mappedCO}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {q.bloomsLevel.slice(0, 3)}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 w-8 text-right">[3M]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section C */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-900">
              <span>SECTION C: Long Answer Questions (Attempt Any 3 of 4)</span>
              <span className="font-mono bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-[10px]">3 Qs × 5M = 15 Marks</span>
            </div>
            <div className="space-y-3.5 pl-2">
              {selectedSectionC.map((q, idx) => (
                <div key={q.id} className="text-xs flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-900 min-w-[20px]">Q3.{idx + 1}</span>
                    <span className="text-slate-800 leading-relaxed font-medium">{q.question}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                      {q.mappedCO}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {q.bloomsLevel.slice(0, 3)}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 w-8 text-right">[5M]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer with Signatures */}
          <div className="pt-10 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="font-bold text-slate-900">Dr. Rajesh Sharma</div>
              <div className="text-[11px] text-slate-500">Paper Setter / Course Faculty</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">Prof. Vikram Patil</div>
              <div className="text-[11px] text-slate-500">Internal Scrutiny Officer</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">Dr. D. P. Kharde</div>
              <div className="text-[11px] text-slate-500">Principal & Chief Conductor</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FACULTY MODEL ANSWER & MARKING SCHEME */}
      {viewMode === 'MODEL_ANSWER' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">Official Evaluation Scheme</span>
              <h2 className="text-lg font-black text-slate-900">
                Faculty Model Answers & Point-by-Point Marking Scheme
              </h2>
              <p className="text-xs text-slate-500">
                Course: {subject?.title || 'Pharmaceutics'} ({subject?.code || 'ER20-11T'}) • MSBTE Confidential Evaluator Guide
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-black font-mono">
              Total Evaluation Key: 40M
            </span>
          </div>

          <div className="space-y-6 divide-y divide-slate-200">
            {/* Model Answers List */}
            {[...selectedSectionA.slice(0, 4), ...selectedSectionB.slice(0, 3), ...selectedSectionC.slice(0, 2)].map((q) => (
              <div key={q.id} className="pt-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-mono text-[11px]">{q.id}</span>
                    <span>{q.question}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded font-bold">{q.mappedCO}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{q.bloomsLevel}</span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold font-sans">Max: {q.marks}M</span>
                  </div>
                </div>

                {/* Model Answer Body */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">Expected Standard Model Answer:</div>
                  <p className="text-slate-700">{q.modelAnswer}</p>
                </div>

                {/* Step-by-Step Marking Rubric */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">Step-by-Step Marks Distribution:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.markingScheme.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 bg-white rounded border border-emerald-100 text-[11px]">
                        <span className="text-slate-700 font-medium">• {item.step}</span>
                        <span className="font-mono font-bold text-emerald-800">{item.marks} M</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: BLUEPRINT MATRIX */}
      {viewMode === 'BLUEPRINT_MATRIX' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase text-amber-600">Quality Blueprint Architecture</span>
              <h2 className="text-lg font-black text-slate-900">
                Cognitive Level vs. Unit Coverage Matrix
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-50 text-amber-900 rounded border border-amber-200">
              MSBTE Norm: 40% K1 / 40% K2 / 20% K3
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 text-left">Curriculum Unit</th>
                  <th className="p-2.5">CO Mapped</th>
                  <th className="p-2.5">Remembering (K1)</th>
                  <th className="p-2.5">Understanding (K2)</th>
                  <th className="p-2.5">Applying (K3/K4)</th>
                  <th className="p-2.5 bg-amber-50 text-amber-950 font-black">Total Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="p-2.5 text-left font-bold font-sans">Unit 1: History, Pharmacopoeia & Packaging</td>
                  <td className="p-2.5 text-indigo-700 font-bold">CO1</td>
                  <td className="p-2.5">3 Marks</td>
                  <td className="p-2.5">5 Marks</td>
                  <td className="p-2.5">3 Marks</td>
                  <td className="p-2.5 bg-amber-50/50 font-bold">11 Marks</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-left font-bold font-sans">Unit 2: Pharmaceutical Calculations & Metrology</td>
                  <td className="p-2.5 text-indigo-700 font-bold">CO1</td>
                  <td className="p-2.5">1 Mark</td>
                  <td className="p-2.5">-</td>
                  <td className="p-2.5">3 Marks</td>
                  <td className="p-2.5 bg-amber-50/50 font-bold">4 Marks</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-left font-bold font-sans">Unit 3: Liquid Dosage Forms & Suspensions</td>
                  <td className="p-2.5 text-indigo-700 font-bold">CO2</td>
                  <td className="p-2.5">2 Marks</td>
                  <td className="p-2.5">5 Marks</td>
                  <td className="p-2.5">6 Marks</td>
                  <td className="p-2.5 bg-amber-50/50 font-bold">13 Marks</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-left font-bold font-sans">Unit 4: Solid Dosage Forms (Tablets & Capsules)</td>
                  <td className="p-2.5 text-indigo-700 font-bold">CO3</td>
                  <td className="p-2.5">2 Marks</td>
                  <td className="p-2.5">4 Marks</td>
                  <td className="p-2.5">5 Marks</td>
                  <td className="p-2.5 bg-amber-50/50 font-bold">11 Marks</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-left font-bold font-sans">Unit 5: Sterile Preparations & Cleanrooms</td>
                  <td className="p-2.5 text-indigo-700 font-bold">CO4/5</td>
                  <td className="p-2.5">2 Marks</td>
                  <td className="p-2.5">3 Marks</td>
                  <td className="p-2.5">5 Marks</td>
                  <td className="p-2.5 bg-amber-50/50 font-bold">10 Marks</td>
                </tr>
                <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-300">
                  <td className="p-2.5 text-left font-sans">Total Question Bank Distribution</td>
                  <td className="p-2.5">All COs</td>
                  <td className="p-2.5">10 Marks (20%)</td>
                  <td className="p-2.5">17 Marks (35%)</td>
                  <td className="p-2.5">22 Marks (45%)</td>
                  <td className="p-2.5 bg-amber-100 text-amber-950 font-black">49 Marks Pool</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
