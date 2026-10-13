"use client";

import React, { useState } from "react";
import { ModuleData, ModuleProgress } from "./ModuleDetailModal";

interface CompletionScreenProps {
  modules: ModuleData[];
  progressList: ModuleProgress[];
  onResetProgress: () => void;
  onViewCurriculum: () => void;
}

export default function CompletionScreen({
  modules,
  progressList,
  onResetProgress,
  onViewCurriculum,
}: CompletionScreenProps) {
  const [copied, setCopied] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Find answers from progress
  const getAnswer = (modId: string) => {
    return progressList.find((p) => p.id === modId)?.step2Answer || "No answer recorded.";
  };

  const getFeedback = (modId: string) => {
    return progressList.find((p) => p.id === modId)?.step2Feedback || "";
  };

  const getQuizAnswer = (mod: ModuleData) => {
    const p = progressList.find((x) => x.id === mod.id);
    if (p && p.step3SelectedIndex !== -1) {
      return mod.quiz.options[p.step3SelectedIndex];
    }
    return "Not answered";
  };

  // Compile the text for the formatted Discovery Canvas document
  const generateCanvasText = () => {
    return `=====================================================
PRODUCT DISCOVERY SCHOOL - CAPSTONE DISCOVERY CANVAS
=====================================================
Student Name: Harsh
Status: Graduated & Mastered
Date: ${new Date().toLocaleDateString()}

-----------------------------------------------------
1. PROBLEM DEFINITION (Module 1)
-----------------------------------------------------
Prompt: ${modules[0].exercise.prompt}
Response:
${getAnswer("mod-1")}

-----------------------------------------------------
2. USER UNDERSTANDING (Module 2)
-----------------------------------------------------
Prompt: ${modules[1].exercise.prompt}
Response:
${getAnswer("mod-2")}

-----------------------------------------------------
3. ASSUMPTIONS MAPPING (Module 3)
-----------------------------------------------------
Prompt: ${modules[2].exercise.prompt}
Response:
${getAnswer("mod-3")}

-----------------------------------------------------
4. VALIDATION EXPERIMENTS (Module 4)
-----------------------------------------------------
Prompt: ${modules[3].exercise.prompt}
Response:
${getAnswer("mod-4")}

-----------------------------------------------------
5. OPPORTUNITY SPACES (Module 5)
-----------------------------------------------------
Prompt: ${modules[4].exercise.prompt}
Response:
${getAnswer("mod-5")}

-----------------------------------------------------
6. PRIORITIZATION METRIC (Module 6)
-----------------------------------------------------
Prompt: ${modules[5].exercise.prompt}
Response:
${getAnswer("mod-6")}

-----------------------------------------------------
7. SUCCESS & NORTH STAR METRICS (Module 7)
-----------------------------------------------------
Prompt: ${modules[6].exercise.prompt}
Response:
${getAnswer("mod-7")}

-----------------------------------------------------
8. JOBS-TO-BE-DONE FRAMEWORK (Module 8)
-----------------------------------------------------
Prompt: ${modules[7].exercise.prompt}
Response:
${getAnswer("mod-8")}

-----------------------------------------------------
9. HOW MIGHT WE REFRAMING (Module 9)
-----------------------------------------------------
Prompt: ${modules[8].exercise.prompt}
Response:
${getAnswer("mod-9")}

-----------------------------------------------------
10. CAPSTONE DISCOVERY CANVAS (Module 10)
-----------------------------------------------------
Prompt: ${modules[9].exercise.prompt}
Response:
${getAnswer("mod-10")}

=====================================================
Document compiled by Product Discovery School.
=====================================================`;
  };

  // Copy Canvas Document content to clipboard
  const handleCopyCanvas = () => {
    const text = generateCanvasText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const canvasCategories = [
    {
      title: "1. Problem & User Space",
      modules: ["mod-1", "mod-2", "mod-8"],
      labels: ["Problem Statement", "User Understanding", "Jobs to be Done"],
      color: "border-blue-500/30 bg-blue-500/[0.01]",
      iconColor: "text-blue-500",
    },
    {
      title: "2. Opportunities & Reframing",
      modules: ["mod-5", "mod-9"],
      labels: ["Opportunity Mapping", "How Might We Framing"],
      color: "border-purple-500/30 bg-purple-500/[0.01]",
      iconColor: "text-purple-500",
    },
    {
      title: "3. Solutions & Prioritization",
      modules: ["mod-3", "mod-6"],
      labels: ["Assumptions Mapping", "Prioritization Metric"],
      color: "border-amber-500/30 bg-amber-500/[0.01]",
      iconColor: "text-amber-500",
    },
    {
      title: "4. Testing & Metrics",
      modules: ["mod-4", "mod-7"],
      labels: ["Validation Experiments", "Success Metrics"],
      color: "border-emerald-500/30 bg-emerald-500/[0.01]",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 select-none pb-12">
      {/* 1. Congratulations Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary/15 via-brand-primary/5 to-transparent border border-brand-primary/20 rounded-3xl p-6 md:p-10 flex flex-col items-center text-center gap-5 shadow-sm">
        {/* Background glow graphics */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />

        {/* Golden Trophy Icon */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 shadow-lg shadow-amber-500/5 animate-bounce">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white"></span>
          </span>
        </div>

        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Congratulations, harsh! 🎓
          </h1>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed font-semibold">
            You have successfully completed all 10 modules and graduated from the **Product Discovery School**! You've mastered problem definition, continuous user research, assumptions mapping, rapid experiments, and success metrics.
          </p>
        </div>

        {/* Graduation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 z-10">
          <button
            onClick={handleCopyCanvas}
            className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
              copied
                ? "bg-[#1D9E75] text-white shadow-[#1D9E75]/15"
                : "bg-brand-primary hover:bg-brand-primary/95 text-white shadow-brand-primary/15"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Copied Canvas!
              </>
            ) : (
              <>
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy My Canvas
              </>
            )}
          </button>
          <button
            onClick={onViewCurriculum}
            className="px-6 py-3 rounded-xl border border-card-border hover:bg-foreground/5 text-foreground/75 font-bold text-xs transition-colors"
          >
            Review Curriculum
          </button>
          <button
            onClick={onResetProgress}
            className="px-6 py-3 rounded-xl border border-red-500/20 hover:bg-red-500/5 text-red-600 dark:text-red-400 font-bold text-xs transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* 2. Mapped Capstone Discovery Canvas Document */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Synthesized Discovery Canvas</h2>
            <p className="text-xs text-foreground/50 mt-0.5">
              Your curriculum responses structured as a professional Discovery Canvas document.
            </p>
          </div>
        </div>

        {/* Canvas Document Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {canvasCategories.map((cat, index) => (
            <div
              key={index}
              className={`border border-card-border rounded-2xl p-5 md:p-6 space-y-4 ${cat.color} transition-all duration-300`}
            >
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-3 border-b border-card-border/60">
                <span className={`w-2 h-2 rounded-full bg-current ${cat.iconColor}`} />
                {cat.title}
              </h3>
              
              <div className="space-y-4">
                {cat.modules.map((modId, mIdx) => {
                  const mod = modules.find((m) => m.id === modId);
                  if (!mod) return null;
                  return (
                    <div key={modId} className="space-y-1">
                      <h4 className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                        {cat.labels[mIdx]} (Module {mod.number})
                      </h4>
                      <p className="text-xs font-semibold text-foreground/85 leading-relaxed bg-card-bg border border-card-border/60 p-3 rounded-xl">
                        {getAnswer(modId)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Section 5: Capstone Discovery canvas (Full Width) */}
          <div className="md:col-span-2 border border-brand-primary/25 bg-brand-primary/[0.01] rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-bold text-brand-primary flex items-center gap-2 pb-3 border-b border-brand-primary/15">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              5. Capstone Discovery Canvas Plan (Module 10)
            </h3>
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                Consolidated Discovery Strategy
              </h4>
              <p className="text-xs font-semibold text-foreground/90 leading-relaxed bg-card-bg border border-brand-primary/10 p-4 rounded-xl whitespace-pre-line">
                {getAnswer("mod-10")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Collapsible Answers & Feedback Summary Accordion */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Detailed Response History</h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Expand any module below to inspect your exercise response, AI Coach review, and correct quiz selection.
          </p>
        </div>

        <div className="space-y-2">
          {modules.map((mod) => {
            const isExpanded = expandedModule === mod.id;
            const feedbackText = getFeedback(mod.id);
            return (
              <div
                key={mod.id}
                className="bg-card-bg border border-card-border rounded-2xl overflow-hidden transition-all duration-200"
              >
                {/* Accordion Toggle Header */}
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-xs hover:bg-foreground/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[10px]">
                      {mod.number}
                    </span>
                    <span className="text-foreground/85">{mod.title}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-foreground/40 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Accordion Expandable Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-card-border/40 space-y-4 bg-foreground/[0.01] animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Exercise Response Section */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                        Your Practice Response
                      </h4>
                      <p className="text-xs font-semibold text-foreground/80 leading-relaxed bg-card-bg p-3 rounded-xl border border-card-border/60">
                        {getAnswer(mod.id)}
                      </p>
                    </div>

                    {/* AI Feedback Section */}
                    {feedbackText && (
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-bold text-[#1D9E75] uppercase tracking-wider">
                          AI Coach Review
                        </h4>
                        <p className="text-xs font-semibold text-foreground/75 leading-relaxed bg-[#1D9E75]/5 p-3 rounded-xl border border-[#1D9E75]/15 border-l-4 border-l-[#1D9E75]">
                          {feedbackText}
                        </p>
                      </div>
                    )}

                    {/* Quiz Choice Section */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                        Quiz Knowledge Check
                      </h4>
                      <div className="flex items-center gap-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold">
                          ✓
                        </span>
                        <span>
                          Correct Option Selected: <strong>{getQuizAnswer(mod)}</strong>
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
