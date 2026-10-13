"use client";

import React, { useState, useEffect, useRef } from "react";
import { ModuleData, ModuleProgress } from "./ModuleDetailModal";

interface ModuleCardProps {
  module: ModuleData;
  progress: ModuleProgress;
  isUnlocked: boolean;
  onClick: () => void;
}

const getModuleEmoji = (number: number) => {
  const emojis = ["🔍", "👥", "🗺️", "🧪", "🌱", "📊", "⭐", "💼", "💡", "🏆"];
  return emojis[number - 1] || "📝";
};

export default function ModuleCard({ module, progress, isUnlocked, onClick }: ModuleCardProps) {
  const { id, number, title, category, duration, description } = module;

  // Calculate step completions
  const stepsCompletedCount = 
    (progress.step1Completed ? 1 : 0) + 
    (progress.step2Answer.trim().length > 0 ? 1 : 0) + 
    (progress.step3Completed ? 1 : 0);

  // Status mapping: locked, done, in progress
  const status = !isUnlocked
    ? "locked"
    : stepsCompletedCount === 3
    ? "done"
    : "in progress";

  // Floating XP indicator state
  const [showXpAlert, setShowXpAlert] = useState(false);
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevStatusRef.current !== null && prevStatusRef.current !== "done" && status === "done") {
      setShowXpAlert(true);
      const timer = setTimeout(() => setShowXpAlert(false), 1500);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = status;
  }, [status]);

  // Category badge styles
  const getCategoryStyles = (cat: string) => {
    if (status === "locked") {
      return "bg-foreground/5 text-brand-text-sec/60 border border-foreground/5";
    }
    switch (cat.toLowerCase()) {
      case "research":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15";
      case "strategy":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15";
      case "testing":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15";
      case "analytics":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/15";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/15";
    }
  };

  return (
    <div
      onClick={() => isUnlocked && onClick()}
      className={`group relative flex flex-col justify-between h-full bg-card-bg border rounded-2xl p-5 md:p-6 shadow-sm shadow-card-border transition-all duration-200 select-none ${
        status === "locked"
          ? "opacity-60 cursor-not-allowed border-card-border"
          : "cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md hover:shadow-brand-primary/5"
      } ${
        status === "done"
          ? "border-brand-success/30 hover:border-brand-success/60"
          : status === "in progress"
          ? "border-brand-primary/30 hover:border-brand-primary/60"
          : ""
      }`}
    >
      {/* Floating XP Gain Indicator */}
      {showXpAlert && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-success text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg animate-float-xp z-20 pointer-events-none">
          +10 XP
        </span>
      )}

      {/* Top Completion/Lock Badges */}
      {status === "done" ? (
        <span 
          className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 bg-brand-success text-white text-[11px] font-bold rounded-full shadow-md animate-bounce-subtle" 
          title="Done"
        >
          ✓
        </span>
      ) : status === "locked" ? (
        <span 
          className="absolute top-4 right-4 text-xs" 
          title="Locked"
        >
          🔒
        </span>
      ) : null}

      <div>
        {/* Large Module Emoji Icon at Top */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 border transition-transform duration-200 ${
          status === "locked"
            ? "bg-foreground/5 border-foreground/10 grayscale"
            : "bg-brand-primary/5 border-brand-primary/20 group-hover:scale-110"
        }`}>
          {getModuleEmoji(number)}
        </div>

        {/* Category Badge & Duration */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryStyles(category)}`}>
            {category}
          </span>
          <span className={`text-[9px] font-bold flex items-center gap-1 ${
            status === "locked" ? "text-brand-text-sec/40" : "text-brand-text-sec"
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {duration}
          </span>
        </div>

        {/* Module Title */}
        <h3 className={`text-base font-extrabold mb-1.5 leading-snug transition-colors ${
          status === "locked" 
            ? "text-foreground/40" 
            : "text-foreground group-hover:text-brand-primary"
        }`}>
          {title}
        </h3>

        {/* Module Description */}
        <p className={`text-xs leading-relaxed mb-6 font-semibold ${
          status === "locked" ? "text-brand-text-sec/30" : "text-brand-text-sec"
        }`}>
          {description}
        </p>
      </div>

      {/* Footer / Status Indicator */}
      <div className="flex items-center justify-between border-t border-card-border/60 pt-4 mt-auto">
        <div className="flex items-center gap-2">
          {status === "locked" ? (
            <span className="text-[11px] font-bold text-brand-text-sec/45 capitalize">Locked</span>
          ) : status === "done" ? (
            <span className="text-[11px] font-bold text-brand-success capitalize">Done</span>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span className="text-[11px] font-bold text-brand-primary capitalize">
                In Progress
              </span>
            </>
          )}
        </div>

        {/* Step position dots */}
        <div className="flex gap-1.5 items-center" title="Step Progress (Concept, Exercise, Quiz)">
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 border ${
              progress.step1Completed
                ? "bg-brand-success border-brand-success"
                : status === "in progress" && !progress.step1Completed
                ? "bg-brand-primary/20 border-brand-primary animate-pulse"
                : "bg-foreground/5 border-card-border"
            }`}
            title="Step 1: Concept"
          />
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 border ${
              progress.step2Answer.trim().length > 0
                ? "bg-brand-success border-brand-success"
                : status === "in progress" && progress.step1Completed && !progress.step2Answer.trim().length
                ? "bg-brand-primary/20 border-brand-primary animate-pulse"
                : "bg-foreground/5 border-card-border"
            }`}
            title="Step 2: Exercise"
          />
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 border ${
              progress.step3Completed
                ? "bg-brand-success border-brand-success"
                : status === "in progress" && progress.step1Completed && progress.step2Answer.trim().length > 0 && !progress.step3Completed
                ? "bg-brand-primary/20 border-brand-primary animate-pulse"
                : "bg-foreground/5 border-card-border"
            }`}
            title="Step 3: Quiz"
          />
        </div>
      </div>
    </div>
  );
}
