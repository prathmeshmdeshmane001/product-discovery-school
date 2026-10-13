"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthScreenProps {
  onGuestEnter?: () => void;
  initialSignUp?: boolean;
}

export default function AuthScreen({ onGuestEnter, initialSignUp = false }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage({ text: "Please enter both email and password.", type: "error" });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data?.user?.identities?.length === 0) {
          setMessage({
            text: "This email is already registered. Try logging in instead.",
            type: "error",
          });
        } else {
          setMessage({
            text: "Registration successful! Please check your email inbox to confirm your account.",
            type: "success",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An authentication error occurred.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
      {/* Background glowing decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />

      {/* Main split container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-16 z-10 p-2 md:p-6">
        
        {/* Left Side: Value Proposition */}
        <div className="flex-1 space-y-5 lg:space-y-6 max-w-lg text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <span>🎓</span> Learn by Doing
          </div>
          
          <h1 className="text-3xl lg:text-4.5xl font-extrabold text-foreground leading-tight tracking-tight rounded-rounded">
            Learn Product Discovery by Doing It
          </h1>
          
          <p className="text-xs md:text-sm text-brand-text-sec leading-relaxed font-semibold">
            Most PMs learn discovery from slides. Here you actually do it — with real exercises, AI coaching, and a canvas you can share with your team.
          </p>

          <ul className="space-y-4 pt-2">
            <li className="flex items-center gap-3.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-success/15 text-brand-success text-lg shadow-sm border border-brand-success/10">
                ✅
              </span>
              <div className="leading-normal">
                <h4 className="text-xs md:text-sm font-bold text-foreground">10 hands-on modules that build real skills</h4>
              </div>
            </li>
            
            <li className="flex items-center gap-3.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-secondary/15 text-brand-secondary text-lg shadow-sm border border-brand-secondary/10">
                🤖
              </span>
              <div className="leading-normal">
                <h4 className="text-xs md:text-sm font-bold text-foreground">AI coaching that gives feedback on your answers</h4>
              </div>
            </li>
            
            <li className="flex items-center gap-3.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-warning/15 text-brand-warning text-lg shadow-sm border border-brand-warning/10">
                🏆
              </span>
              <div className="leading-normal">
                <h4 className="text-xs md:text-sm font-bold text-foreground">A Discovery Canvas you own at the end</h4>
              </div>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onGuestEnter}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs shadow-md shadow-brand-primary/15 transition-all scale-100 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              Try it first →
            </button>
          </div>
        </div>

        {/* Right Side: Existing Login/Signup Card */}
        <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200">
          
          {/* Brand logo & header */}
          <div className="flex flex-col items-center text-center gap-2 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent mt-2">
                {isSignUp ? "Create a free account" : "Already have an account?"}
              </h2>
              <p className="text-xs text-foreground/50 mt-1 font-semibold leading-relaxed">
                {isSignUp
                  ? "Create an account to start your continuous discovery journey."
                  : "Log in to resume your learning and sync your Discovery Canvas."}
              </p>
            </div>
          </div>

          {/* Feedback alerts */}
          {message && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold border leading-relaxed ${
                message.type === "success"
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-top-2 duration-150"
                  : "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400 animate-in shake duration-150"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Auth form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@domain.com"
                className="w-full rounded-2xl border border-card-border p-3.5 text-sm font-semibold focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-card-border p-3.5 text-sm font-semibold focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md shadow-brand-primary/15 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="text-center pt-2 border-t border-card-border/60">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage(null);
              }}
              className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
            >
              {isSignUp
                ? "Already have an account? Log In"
                : "New to Discovery School? Create an account"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
