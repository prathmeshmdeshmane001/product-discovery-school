"use client";

import React, { useState, useEffect } from "react";

export interface ModuleData {
  id: string;
  number: number;
  title: string;
  category: string;
  duration: string;
  description: string;
  concept: {
    explanation: string;
    example: string;
  };
  exercise: {
    prompt: string;
    placeholder: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ModuleProgress {
  id: string;
  step1Completed: boolean;
  step2Answer: string;
  step2Feedback: string;
  step3SelectedIndex: number;
  step3Completed: boolean;
}

interface ModuleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleData;
  progress: ModuleProgress;
  onSaveProgress: (updatedProgress: ModuleProgress) => void;
  onRequireSignup?: (action: string, proceed: () => void) => void;
}

export default function ModuleDetailModal({
  isOpen,
  onClose,
  module,
  progress,
  onSaveProgress,
  onRequireSignup,
}: ModuleDetailModalProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [exerciseText, setExerciseText] = useState(progress.step2Answer);
  const [aiFeedback, setAiFeedback] = useState(progress.step2Feedback || "");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(progress.step3SelectedIndex);
  const [quizSubmitted, setQuizSubmitted] = useState(progress.step3Completed);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(
    progress.step3Completed ? "correct" : null
  );

  // Gamification: wrong answer shake and confetti pop states
  const [wrongOptionIndex, setWrongOptionIndex] = useState<number>(-1);
  const [confetti, setConfetti] = useState<{ id: number; color: string; left: string; delay: string }[]>([]);

  // Sync state with open module/progress changes
  useEffect(() => {
    if (isOpen) {
      setExerciseText(progress.step2Answer);
      setAiFeedback(progress.step2Feedback || "");
      setIsLoadingFeedback(false);
      setAiError(null);
      setSelectedQuizIndex(progress.step3SelectedIndex);
      setQuizSubmitted(progress.step3Completed);
      setQuizFeedback(progress.step3Completed ? "correct" : null);
      setWrongOptionIndex(-1);
      setConfetti([]);
      
      // Open modal on the furthest available step
      if (!progress.step1Completed) {
        setActiveStep(1);
      } else if (!progress.step2Answer) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    }
  }, [isOpen, progress, module.id]);

  if (!isOpen) return null;

  // Complete step 1
  const handleCompleteStep1 = () => {
    const updated = { ...progress, step1Completed: true };
    onSaveProgress(updated);
    setActiveStep(2);
  };

  // Fetch AI Coaching Feedback from Gemini API
  const handleGetAIFeedback = async () => {
    if (exerciseText.trim().length < 10) {
      alert("Please write a detailed response (minimum 10 characters) before requesting feedback.");
      return;
    }

    if (onRequireSignup) {
      onRequireSignup("ai-feedback", () => {
        proceedGetAIFeedback();
      });
    } else {
      proceedGetAIFeedback();
    }
  };

  const proceedGetAIFeedback = async () => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) {
      setAiError("Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.");
      return;
    }

    setIsLoadingFeedback(true);
    setAiError(null);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are a product discovery coach. Give 2-3 sentences of specific encouraging feedback. Point out 1 thing done well and 1 concrete improvement. Be direct and warm. No preamble."
              }
            ]
          },
          contents: [
            {
              parts: [
                {
                  text: `Module: ${module.title}\nExercise Prompt: ${module.exercise.prompt}\nUser Answer: ${exerciseText}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate feedback.");
      }

      const feedbackText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!feedbackText) {
        throw new Error("No feedback response received from Gemini.");
      }

      setAiFeedback(feedbackText);
      onSaveProgress({
        ...progress,
        step2Answer: exerciseText,
        step2Feedback: feedbackText
      });

      // Confetti burst for submitting exercise!
      triggerConfetti();
    } catch (err: any) {
      setAiError(err.message || "Something went wrong.");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // Complete step 2
  const handleCompleteStep2 = () => {
    if (exerciseText.trim().length < 10) {
      alert("Please write a detailed response (minimum 10 characters) to complete this step.");
      return;
    }
    const updated = { ...progress, step2Answer: exerciseText, step2Feedback: aiFeedback };
    onSaveProgress(updated);
    setActiveStep(3);
  };

  // Trigger Confetti Pop particles
  const triggerConfetti = () => {
    const colors = ["#0EA5E9", "#14B8A6", "#22C55E", "#F59E0B", "#FF5A5F"];
    const particles = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 2500);
  };

  // Check Quiz Answer
  const handleCheckQuiz = (index: number) => {
    if (quizSubmitted) return;
    
    setSelectedQuizIndex(index);
    const isCorrect = index === module.quiz.correctIndex;
    
    if (isCorrect) {
      setQuizFeedback("correct");
      setQuizSubmitted(true);
      const updated = {
        ...progress,
        step3SelectedIndex: index,
        step3Completed: true,
      };
      
      if (onRequireSignup) {
        onRequireSignup("complete-module", () => {
          onSaveProgress(updated);
          // Trigger Confetti pop on correct answer!
          triggerConfetti();
        });
      } else {
        onSaveProgress(updated);
        // Trigger Confetti pop on correct answer!
        triggerConfetti();
      }
    } else {
      setQuizFeedback("incorrect");
      setWrongOptionIndex(index);
      // Reset shake state after keyframe animation completes
      setTimeout(() => setWrongOptionIndex(-1), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-[#1C1917]/65 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Modal Panel */}
      <div className="relative w-full max-w-3xl bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-card-border p-5 md:p-6 bg-gradient-to-br from-brand-primary/5 to-transparent select-none">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-sm font-extrabold shadow-md shadow-brand-primary/20">
              {module.number}
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary">
                {module.category} • Module
              </span>
              <h2 className="text-base md:text-lg font-extrabold text-foreground truncate max-w-sm md:max-w-md">
                {module.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors"
          >
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wizard Step Tracker Tabs */}
        <div className="flex border-b border-card-border/60 bg-foreground/2 select-none">
          {[
            { 
              step: 1, 
              name: "1. Concept Card", 
              unlocked: true,
              completed: progress.step1Completed,
            },
            { 
              step: 2, 
              name: "2. Practice Exercise", 
              unlocked: progress.step1Completed,
              completed: progress.step2Answer.trim().length > 0,
            },
            { 
              step: 3, 
              name: "3. Quiz Check", 
              unlocked: progress.step1Completed && progress.step2Answer.trim().length > 0,
              completed: progress.step3Completed,
            },
          ].map((item) => {
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                disabled={!item.unlocked}
                onClick={() => setActiveStep(item.step as 1 | 2 | 3)}
                className={`flex-1 py-3.5 border-b-2 text-center text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? "border-brand-primary text-brand-primary bg-brand-primary/5"
                    : item.unlocked
                    ? "border-transparent text-foreground/60 hover:text-brand-primary/80 hover:bg-brand-primary/2"
                    : "border-transparent text-foreground/25 cursor-not-allowed"
                }`}
              >
                {/* Visual Step Indicator Dot inside Modal */}
                <span className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  item.completed
                    ? "bg-[#1D9E75] border-[#1D9E75]"
                    : isActive
                    ? "bg-brand-primary/20 border-brand-primary animate-pulse"
                    : "bg-foreground/5 border-card-border"
                }`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
          
          {/* STEP 1: CONCEPT CARD */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-foreground">Core Concept Explanation</h3>
                <div className="text-sm text-foreground/75 leading-relaxed font-semibold bg-foreground/3 p-4 md:p-5 rounded-2xl border border-card-border/40 whitespace-pre-line">
                  {module.concept.explanation}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-brand-primary flex items-center gap-2">
                  <span className="text-base">💡</span>
                  Real World Example
                </h4>
                <div className="text-sm text-foreground/75 leading-relaxed font-semibold italic bg-brand-primary/5 p-4 md:p-5 rounded-2xl border border-brand-primary/10">
                  {module.concept.example}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCompleteStep1}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 text-white font-bold text-xs shadow-md shadow-brand-primary/15 transition-all flex items-center gap-1.5"
                >
                  {progress.step1Completed ? "Go to Exercise" : "I Understand, Complete Step 1"}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PRACTICE EXERCISE */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h3 className="text-base font-extrabold text-foreground">Practical Application</h3>
                <div className="text-sm text-foreground/75 leading-relaxed font-semibold bg-brand-primary/5 p-4 md:p-5 border border-brand-primary/10 rounded-2xl">
                  {module.exercise.prompt}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-brand-text-sec uppercase tracking-wider">
                  Your Response (min 10 characters)
                </label>
                <textarea
                  rows={5}
                  value={exerciseText}
                  onChange={(e) => setExerciseText(e.target.value)}
                  placeholder={module.exercise.placeholder}
                  className="w-full rounded-2xl border border-card-border p-4 text-sm font-semibold focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background resize-none outline-none transition-all"
                />
              </div>

              {/* AI Coaching Progress Indicators */}
              {isLoadingFeedback && (
                <div className="flex items-center gap-3 p-4 bg-foreground/2 border border-card-border/40 rounded-2xl">
                  <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-brand-text-sec">AI Coach is reviewing your answer...</span>
                </div>
              )}

              {aiError && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-semibold">
                  {aiError}
                </div>
              )}

              {/* Redesigned AI feedback box with friendly robot emoji and soft teal bg */}
              {aiFeedback && !isLoadingFeedback && (
                <div className="border-l-4 border-brand-secondary bg-brand-secondary/5 p-4 rounded-r-2xl space-y-1.5 animate-in slide-in-from-bottom-2 duration-200">
                  <h4 className="text-[10px] font-extrabold text-brand-secondary uppercase tracking-widest flex items-center gap-1.5">
                    <span className="text-sm">🤖</span>
                    AI Coach Feedback
                  </h4>
                  <p className="text-xs font-semibold text-foreground/85 leading-relaxed whitespace-pre-line">
                    {aiFeedback}
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-wrap gap-3 items-center justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2.5 rounded-full border border-card-border hover:bg-foreground/5 text-brand-text-sec font-bold text-xs transition-colors"
                >
                  ← Back
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={handleGetAIFeedback}
                    disabled={isLoadingFeedback || exerciseText.trim().length < 10}
                    className="px-5 py-2.5 rounded-full border border-[#14B8A6]/30 hover:bg-[#14B8A6]/5 text-[#14B8A6] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    {isLoadingFeedback ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></span>
                        Reviewing...
                      </>
                    ) : (
                      <>
                        <span className="text-sm">🤖</span>
                        Get AI Feedback
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCompleteStep2}
                    disabled={exerciseText.trim().length < 10}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 text-white font-bold text-xs shadow-md shadow-brand-primary/15 transition-all flex items-center gap-1.5"
                  >
                    Submit & Next Step
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: KNOWLEDGE QUIZ */}
          {activeStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-foreground">Knowledge Check</h3>
                <p className="text-sm font-semibold text-foreground/80 bg-foreground/3 p-4 rounded-2xl border border-card-border/40">
                  {module.quiz.question}
                </p>
              </div>

              {/* Quiz choices grid */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {module.quiz.options.map((option, index) => {
                  const isSelected = selectedQuizIndex === index;
                  const isCorrectAnswer = index === module.quiz.correctIndex;
                  const isWrong = wrongOptionIndex === index;
                  
                  let choiceClass = "border-card-border hover:border-brand-primary/30 hover:bg-brand-primary/2";
                  if (isWrong) {
                    choiceClass = "border-red-500 bg-red-500/5 text-red-700 dark:text-red-300 animate-shake";
                  } else if (isSelected) {
                    if (quizSubmitted) {
                      choiceClass = "border-brand-success bg-brand-success/5 text-brand-success animate-bounce-subtle";
                    } else if (quizFeedback === "incorrect") {
                      choiceClass = "border-red-500 bg-red-500/5 text-red-700 dark:text-red-300";
                    } else {
                      choiceClass = "border-brand-primary bg-brand-primary/5 text-brand-primary";
                    }
                  } else if (quizSubmitted && isCorrectAnswer) {
                    // Highlight correct answer if incorrect choice was checked
                    choiceClass = "border-brand-success bg-brand-success/5 text-brand-success";
                  }

                  return (
                    <button
                      key={index}
                      disabled={quizSubmitted}
                      onClick={() => handleCheckQuiz(index)}
                      className={`w-full text-left px-5 py-4 rounded-2xl border font-bold text-xs transition-all flex items-center justify-between ${choiceClass}`}
                    >
                      <span>{option}</span>
                      <div className="flex items-center gap-2">
                        {isWrong && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                            ✕
                          </span>
                        )}
                        {((isSelected && quizSubmitted) || (quizSubmitted && isCorrectAnswer)) && (
                          <span className="w-5 h-5 rounded-full bg-brand-success text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Correct Feedback Explanation card */}
              {quizSubmitted && (
                <div className="bg-brand-success/5 border border-brand-success/20 p-4 md:p-5 rounded-2xl space-y-2 animate-in slide-in-from-bottom-3 duration-200">
                  <h4 className="text-xs font-extrabold text-brand-success uppercase tracking-widest flex items-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Correct Answer!
                  </h4>
                  <p className="text-xs font-semibold text-foreground/80 leading-relaxed">
                    {module.quiz.explanation}
                  </p>
                </div>
              )}

              {/* Incorrect hint */}
              {!quizSubmitted && quizFeedback === "incorrect" && (
                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl text-center text-xs font-bold text-red-600 dark:text-red-400">
                  That choice was incorrect. Read the core concept again and try another option!
                </div>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-full border border-card-border hover:bg-foreground/5 text-brand-text-sec font-bold text-xs transition-colors"
                >
                  ← Back
                </button>
                {quizSubmitted && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-brand-success hover:opacity-95 text-white font-bold text-xs shadow-md shadow-brand-success/15 transition-all flex items-center gap-1.5"
                  >
                    Finish Module
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confetti particles pop wrapper */}
      {confetti.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            backgroundColor: p.color,
            left: p.left,
            animationDelay: p.delay,
            bottom: 0,
          }}
        />
      ))}
    </div>
  );
}
