"use client";

import React from "react";

interface ProgressBarProps {
  completedStepsCount: number;
  totalStepsCount: number;
  completedModulesCount: number;
  totalModulesCount: number;
  quizScore: number;
}

export default function ProgressBar({
  completedStepsCount,
  totalStepsCount,
  completedModulesCount,
  totalModulesCount,
  quizScore,
}: ProgressBarProps) {
  const percentage = Math.round((completedStepsCount / totalStepsCount) * 100);

  // Motivational quote based on completion percentage
  let statusMessage = "Welcome to your discovery journey! Open the first module to start learning.";
  if (percentage > 0 && percentage < 30) {
    statusMessage = "Off to a strong start! Keep going to build solid discovery foundations.";
  } else if (percentage >= 30 && percentage < 65) {
    statusMessage = "Excellent progress! You're over a third of the way through the curriculum.";
  } else if (percentage >= 65 && percentage < 100) {
    statusMessage = "Almost there! Complete the remaining steps to earn your Discovery Badge.";
  } else if (percentage === 100) {
    statusMessage = "Mastery achieved! You've successfully finished all 30 steps of the Discovery curriculum! 🎓";
  }

  // Determine speedometer color zones
  let zoneColor = "#EF4444"; // red
  let zoneText = "Just getting started";
  let zoneTextClass = "text-red-500 dark:text-red-400";
  if (percentage <= 30) {
    zoneColor = "#EF4444"; // red
    zoneText = "Just getting started";
    zoneTextClass = "text-red-500 dark:text-red-400";
  } else if (percentage <= 60) {
    zoneColor = "#F59E0B"; // amber
    zoneText = "Building momentum";
    zoneTextClass = "text-amber-500 dark:text-amber-400";
  } else if (percentage <= 90) {
    zoneColor = "#0EA5E9"; // blue
    zoneText = "Almost there";
    zoneTextClass = "text-sky-500 dark:text-sky-400";
  } else {
    zoneColor = "#22C55E"; // green
    zoneText = "Discovery Master!";
    zoneTextClass = "text-emerald-500 dark:text-emerald-400";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full select-none font-sans">
      
      {/* Course Progress Card with Semicircular Speedometer (2 cols on large screens) */}
      <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-2xl p-5 md:p-6 shadow-sm shadow-brand-primary/5 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 justify-between">
        
        {/* Left Side: Stats, motivational content, and badges */}
        <div className="space-y-4 flex-1 w-full text-left">
          <div>
            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-2.5 py-1 rounded-full">
              Course Progress
            </span>
            <h2 className="text-lg font-extrabold text-foreground mt-2 leading-tight">
              Continuous Discovery Habits
            </h2>
            <p className="text-xs text-brand-text-sec mt-1.5 font-semibold leading-relaxed">
              {statusMessage}
            </p>
          </div>

          {/* Gamification badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Completed Modules count badge */}
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-foreground/5 border border-card-border text-foreground">
              💼 {completedModulesCount} of {totalModulesCount} Modules Done
            </span>

            {/* Trophy Icon (Glows when above 90%) */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                percentage >= 90 
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse-glow" 
                  : "bg-foreground/5 border-card-border text-brand-text-sec opacity-50"
              }`}
              title={percentage >= 90 ? "Discovery Master Trophy Unlocked!" : "Reach 90% completion to unlock"}
            >
              <span>🏆</span>
              <span>Master</span>
            </div>

            {/* Streak Icon (Pulses when streak is 3+) */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-warning/10 border border-brand-warning/20 text-brand-warning text-xs font-bold animate-pulse-glow"
              title="3 Day Streak Active!"
            >
              <span>🔥</span>
              <span>3+ Day Streak</span>
            </div>
          </div>
        </div>

        {/* Right Side: Speedometer Gauge */}
        <div className="flex flex-col items-center justify-center w-full max-w-[200px] shrink-0">
          <div className="relative w-full aspect-[200/105]">
            <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="30%" stopColor="#F59E0B" />
                  <stop offset="60%" stopColor="#0EA5E9" />
                  <stop offset="90%" stopColor="#22C55E" />
                </linearGradient>
              </defs>
              
              {/* Background Arc */}
              <path
                d="M 30,100 A 70,70 0 0,1 170,100"
                fill="none"
                stroke="var(--card-border)"
                strokeWidth="14"
                strokeLinecap="round"
                className="opacity-70 dark:opacity-30"
              />
              
              {/* Progress Arc using Gradient */}
              <path
                d="M 30,100 A 70,70 0 0,1 170,100"
                fill="none"
                stroke="url(#gauge-gradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset={220 - (percentage / 100) * 220}
                className="transition-all duration-1000 ease-out"
              />
              
              {/* Needle pivot pin base */}
              <circle cx="100" cy="100" r="8" fill="var(--foreground)" />
              <circle cx="100" cy="100" r="4" fill="var(--background)" />
              
              {/* Rotating Needle (Points to 180deg (left) at 0% and 0deg (right) at 100%) */}
              <g 
                style={{ 
                  transform: `rotate(${(percentage / 100) * 180}deg)`, 
                  transformOrigin: "100px 100px",
                  transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" 
                }}
              >
                {/* Pointer line */}
                <line 
                  x1="100" 
                  y1="100" 
                  x2="35" 
                  y2="100" 
                  stroke="var(--foreground)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
                {/* Arrow cap */}
                <polygon 
                  points="35,97 25,100 35,103" 
                  fill="var(--foreground)" 
                />
              </g>
            </svg>
          </div>
          
          {/* Semicircle Gauge Info Center */}
          <div className="text-center mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {percentage}%
            </span>
            <p className={`text-[10px] font-extrabold uppercase tracking-wider mt-0.5 ${zoneTextClass}`}>
              {zoneText}
            </p>
          </div>
        </div>

      </div>

      {/* Quiz Score Tracker Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5 md:p-6 shadow-sm shadow-brand-primary/5 transition-all duration-300 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <span className="text-lg">⭐</span>
            Quiz Score Tracker
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warning bg-brand-warning/10 px-2.5 py-0.5 rounded-full">
            Knowledge Check
          </span>
        </div>
        
        <div className="flex items-center gap-5 my-auto">
          {/* Big circular score indicator */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-brand-warning/5 border-2 border-brand-warning/30 shadow-md shadow-brand-warning/5">
            <span className="text-xl font-extrabold text-brand-warning">
              {quizScore}
            </span>
            <span className="text-[10px] text-brand-text-sec font-bold absolute -bottom-1 bg-card-bg px-1 border border-card-border rounded-md">
              / 10
            </span>
          </div>

          <div className="text-left">
            <h4 className="text-xs font-bold text-foreground">
              {quizScore === 10
                ? "Perfect Score! 🏆"
                : quizScore >= 7
                ? "Excellent job!"
                : quizScore >= 4
                ? "Good progress!"
                : "Complete quizzes to build score."}
            </h4>
            <p className="text-[11px] text-brand-text-sec mt-1 font-semibold leading-normal">
              Get all multiple choice questions correct to level up your credentials.
            </p>
          </div>
        </div>

        {/* Small dots for quiz completion */}
        <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-card-border/60">
          <span className="text-[9px] font-bold text-brand-text-sec uppercase tracking-widest">Quizzes:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx < quizScore ? "bg-brand-warning scale-110" : "bg-card-border"
                }`}
                title={`Quiz ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
