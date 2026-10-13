"use client";

import React, { useState, useEffect } from "react";
import { ModuleProgress } from "./ModuleDetailModal";

interface OpportunityNode {
  id: string;
  text: string;
}

interface SolutionNode {
  id: string;
  opportunityId: string;
  text: string;
}

interface OSTMapData {
  outcome: string;
  opportunities: OpportunityNode[];
  solutions: SolutionNode[];
}

interface OpportunityMapProps {
  progressList: ModuleProgress[];
  onSaveProgress: (updated: ModuleProgress) => Promise<void>;
  onRequireSignup?: (action: string, proceed: () => void) => void;
}

export default function OpportunityMap({ progressList, onSaveProgress, onRequireSignup }: OpportunityMapProps) {
  const [outcome, setOutcome] = useState("Increase 30-day user retention by 20%");
  const [opportunities, setOpportunities] = useState<OpportunityNode[]>([
    { id: "opp-1", text: "Users drop off during onboarding because steps are unclear." },
    { id: "opp-2", text: "Users struggle to find high-quality templates for discovery." },
    { id: "opp-3", text: "Users lose motivation when studying alone without feedback." },
  ]);
  const [solutions, setSolutions] = useState<SolutionNode[]>([
    { id: "sol-1", opportunityId: "opp-1", text: "Add a 3-step interactive onboarding tutorial" },
    { id: "sol-2", opportunityId: "opp-1", text: "Provide progress bars for setup stages" },
    { id: "sol-3", opportunityId: "opp-2", text: "Curate a downloadable library of PDF templates" },
    { id: "sol-4", opportunityId: "opp-3", text: "Integrate a community discussion board" },
  ]);

  // Editing state
  const [editingNode, setEditingNode] = useState<{ type: "outcome" | "opportunity" | "solution"; id?: string; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load saved map from Supabase on mount
  useEffect(() => {
    const savedItem = progressList.find((p) => p.id === "opportunity-map");
    if (savedItem && savedItem.step2Answer) {
      try {
        const parsed: OSTMapData = JSON.parse(savedItem.step2Answer);
        if (parsed.outcome) setOutcome(parsed.outcome);
        if (parsed.opportunities) setOpportunities(parsed.opportunities);
        if (parsed.solutions) setSolutions(parsed.solutions);
      } catch (e) {
        console.error("Error parsing opportunity map data:", e);
      }
    }
  }, [progressList]);

  // Save map to Supabase
  const handleSaveMap = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const mapData: OSTMapData = {
      outcome,
      opportunities,
      solutions,
    };

    const mapProgressItem: ModuleProgress = {
      id: "opportunity-map",
      step1Completed: true,
      step2Answer: JSON.stringify(mapData),
      step2Feedback: "",
      step3SelectedIndex: -1,
      step3Completed: true,
    };

    try {
      await onSaveProgress(mapProgressItem);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving map:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMapClick = () => {
    if (onRequireSignup) {
      onRequireSignup("save-map", () => {
        handleSaveMap();
      });
    } else {
      handleSaveMap();
    }
  };

  // Add new opportunity
  const handleAddOpportunity = () => {
    const newId = `opp-${Date.now()}`;
    const newOpp = { id: newId, text: "Click to edit this opportunity statement..." };
    setOpportunities([...opportunities, newOpp]);
    setEditingNode({ type: "opportunity", id: newId, text: newOpp.text });
  };

  // Add new solution
  const handleAddSolution = (oppId: string) => {
    const newId = `sol-${Date.now()}`;
    const newSol = { id: newId, opportunityId: oppId, text: "Click to edit this solution idea..." };
    setSolutions([...solutions, newSol]);
    setEditingNode({ type: "solution", id: newId, text: newSol.text });
  };

  // Delete node
  const handleDeleteNode = (type: "opportunity" | "solution", id: string) => {
    if (type === "opportunity") {
      setOpportunities(opportunities.filter((o) => o.id !== id));
      // Cascade delete solutions linked to this opportunity
      setSolutions(solutions.filter((s) => s.opportunityId !== id));
    } else {
      setSolutions(solutions.filter((s) => s.id !== id));
    }
  };

  // Save edit changes
  const handleSaveEdit = () => {
    if (!editingNode) return;

    if (editingNode.type === "outcome") {
      setOutcome(editingNode.text.trim() || "Define your outcome...");
    } else if (editingNode.type === "opportunity") {
      setOpportunities(
        opportunities.map((o) => (o.id === editingNode.id ? { ...o, text: editingNode.text } : o))
      );
    } else if (editingNode.type === "solution") {
      setSolutions(
        solutions.map((s) => (s.id === editingNode.id ? { ...s, text: editingNode.text } : s))
      );
    }

    setEditingNode(null);
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-6xl mx-auto w-full">
      {/* Intro explanation card */}
      <div className="bg-card-bg border border-card-border rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-1 flex-1">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <span>🗺️</span> Opportunity Solution Tree (OST)
          </h2>
          <p className="text-xs text-brand-text-sec font-semibold leading-relaxed max-w-3xl">
            An Opportunity Solution Tree is a visual framework created by Teresa Torres. It connects your target <strong>Outcome</strong> (the business goal) to user <strong>Opportunities</strong> (uncovered needs/pain points) and target <strong>Solutions</strong> (experiments/features), ensuring you solve real user problems instead of shipping vanity features.
          </p>
        </div>
        <button
          onClick={handleSaveMapClick}
          disabled={isSaving}
          className={`px-5 py-2.5 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
            saveSuccess
              ? "bg-brand-success text-white shadow-brand-success/15"
              : "bg-brand-primary text-white hover:bg-brand-primary/95 shadow-brand-primary/15"
          }`}
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <span>✓</span> Saved Map!
            </>
          ) : (
            <>
              <span>💾</span> Save my map
            </>
          )}
        </button>
      </div>

      {/* Main Canvas Workspace */}
      <div className="relative border border-card-border/80 bg-gradient-to-b from-card-bg via-background/30 to-card-bg rounded-3xl p-6 md:p-8 min-h-[500px] flex flex-col items-center gap-10 shadow-inner">
        {/* Outcome Node (Top) */}
        <div className="flex flex-col items-center text-center relative z-10 w-full max-w-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full mb-2">
            Target Outcome
          </div>
          <div
            onClick={() => setEditingNode({ type: "outcome", text: outcome })}
            className="w-full bg-card-bg border-2 border-brand-primary rounded-2xl p-4 md:p-5 shadow-md hover:scale-[1.01] hover:shadow-lg hover:shadow-brand-primary/5 transition-all cursor-pointer"
          >
            <p className="text-sm font-extrabold text-foreground leading-normal">
              {outcome}
            </p>
            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider mt-2.5 block opacity-0 group-hover:opacity-100 transition-opacity">
              ✏️ Click to Edit
            </span>
          </div>
        </div>

        {/* Tree connection arrow downward */}
        <div className="w-0.5 h-8 bg-card-border/60 relative">
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 border-r-2 border-b-2 border-card-border/60 rotate-45"></span>
        </div>

        {/* Columns: Opportunities (Middle) -> Solutions (Bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start relative z-10">
          {opportunities.map((opp, idx) => {
            const oppSolutions = solutions.filter((s) => s.opportunityId === opp.id);
            return (
              <div key={opp.id} className="flex flex-col items-center gap-6 bg-card-bg/40 border border-card-border/60 rounded-2xl p-4 shadow-sm">
                
                {/* Opportunity Card */}
                <div className="w-full relative group">
                  <div className="absolute top-2.5 left-3 text-[9px] font-bold uppercase tracking-wider text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded-md">
                    Opportunity {idx + 1}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode("opportunity", opp.id);
                    }}
                    className="absolute top-2 right-2 text-foreground/35 hover:text-red-500 text-xs p-1 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Opportunity"
                  >
                    ✕
                  </button>
                  <div
                    onClick={() => setEditingNode({ type: "opportunity", id: opp.id, text: opp.text })}
                    className="w-full bg-card-bg border-2 border-brand-warning/30 rounded-2xl pt-7 pb-4 px-4 shadow-sm hover:border-brand-warning/60 hover:shadow-md transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-foreground leading-relaxed">
                      {opp.text}
                    </p>
                  </div>
                </div>

                {/* Arrow pointing down to solutions */}
                <div className="w-0.5 h-4 bg-card-border/60 relative">
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1.5 h-1.5 border-r border-b border-card-border/60 rotate-45"></span>
                </div>

                {/* Solutions List */}
                <div className="w-full space-y-3">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-brand-text-sec text-center mb-1">
                    Solution Ideas ({oppSolutions.length})
                  </div>
                  
                  {oppSolutions.map((sol) => (
                    <div key={sol.id} className="relative group w-full">
                      <button
                        onClick={() => handleDeleteNode("solution", sol.id)}
                        className="absolute top-2 right-2 text-foreground/35 hover:text-red-500 text-[10px] p-0.5 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Delete Solution"
                      >
                        ✕
                      </button>
                      <div
                        onClick={() => setEditingNode({ type: "solution", id: sol.id, text: sol.text })}
                        className="w-full bg-card-bg border border-brand-secondary/35 rounded-xl p-3 shadow-inner hover:border-brand-secondary/70 hover:shadow transition-all cursor-pointer pr-7"
                      >
                        <p className="text-xs font-semibold text-foreground/80 leading-normal">
                          {sol.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add Solution button */}
                  <button
                    onClick={() => handleAddSolution(opp.id)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-brand-secondary/40 hover:bg-brand-secondary/5 text-brand-secondary font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>+</span> Add Solution
                  </button>
                </div>

              </div>
            );
          })}

          {/* Add Opportunity Card Placeholder */}
          <button
            onClick={handleAddOpportunity}
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-brand-warning/35 hover:bg-brand-warning/5 text-brand-warning font-bold text-xs gap-2 transition-all h-36 w-full cursor-pointer"
          >
            <span className="text-xl">➕</span>
            Add Opportunity Card
          </button>
        </div>
      </div>

      {/* Editing Dialog Modal */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border w-full max-w-md rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-sm font-extrabold text-foreground capitalize flex items-center gap-1.5">
                ✏️ Edit {editingNode.type}
              </h3>
              <p className="text-[11px] text-brand-text-sec mt-0.5 font-semibold leading-relaxed">
                Refine this statement to keep your Opportunity-Solution Tree aligned.
              </p>
            </div>
            <textarea
              value={editingNode.text}
              onChange={(e) => setEditingNode({ ...editingNode, text: e.target.value })}
              className="w-full rounded-2xl border border-card-border p-3.5 text-xs font-semibold focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background outline-none transition-all h-28 resize-none leading-relaxed"
              placeholder="Type node contents here..."
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingNode(null)}
                className="px-4 py-2 rounded-full border border-card-border hover:bg-card-border/20 text-brand-text-sec font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-md shadow-brand-primary/15 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
