"use client";

import React, { useState } from "react";

interface Resource {
  id: string;
  title: string;
  description: string;
  author: string;
  type: "Article" | "Book" | "Video";
  url: string;
}

export default function ResearchLibrary() {
  const [filter, setFilter] = useState<"All" | "Article" | "Book" | "Video">("All");

  const resources: Resource[] = [
    {
      id: "res-1",
      title: "Opportunity Solution Trees",
      description: "Learn how to visually map out your product discovery work, connecting business outcomes to customer opportunities and solution ideas.",
      author: "Teresa Torres (Product Talk)",
      type: "Article",
      url: "https://www.producttalk.org/2016/08/opportunity-solution-tree/",
    },
    {
      id: "res-2",
      title: "Competing Against Luck",
      description: "The definitive guide to the Jobs-to-be-Done (JTBD) framework, explaining why customers 'hire' products to make progress in specific situations.",
      author: "Clayton M. Christensen",
      type: "Book",
      url: "https://www.claytonchristensen.com/books/competing-against-luck/",
    },
    {
      id: "res-3",
      title: "The Lean Startup",
      description: "Discover how constant innovation and rapid feedback loops (Build-Measure-Learn) allow modern startups and product teams to succeed under extreme uncertainty.",
      author: "Eric Ries",
      type: "Book",
      url: "https://theleanstartup.com/",
    },
    {
      id: "res-4",
      title: "Introduction to Design Thinking",
      description: "A comprehensive video introduction to the Design Thinking framework: Empathize, Define, Ideate, Prototype, and Test.",
      author: "IDEO / Stanford d.school",
      type: "Video",
      url: "https://www.youtube.com/watch?v=gHGN6hs2gZY",
    },
    {
      id: "res-5",
      title: "Continuous Discovery Habits",
      description: "A structured approach to talking to customers weekly, running small and rapid experiments, and making product decisions as a team.",
      author: "Teresa Torres",
      type: "Book",
      url: "https://www.producttalk.org/continuous-discovery-habits/",
    },
    {
      id: "res-6",
      title: "RICE: Simple Prioritization for PMs",
      description: "Read about the RICE prioritization framework, evaluating ideas based on Reach, Impact, Confidence, and Effort to remove bias.",
      author: "Sean McBride (Intercom)",
      type: "Article",
      url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/",
    },
  ];

  const filteredResources = filter === "All" 
    ? resources 
    : resources.filter((r) => r.type === filter);

  // Type badge color styling helper
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "Article":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15";
      case "Book":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15";
      case "Video":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/15";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/15";
    }
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-6xl mx-auto w-full">
      {/* Intro Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Research Library</h2>
        <p className="text-xs text-brand-text-sec font-semibold">
          Curated frameworks, articles, books, and videos to help you master modern continuous product discovery habits.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-card-border/60 pb-3">
        {(["All", "Article", "Book", "Video"] as const).map((type) => {
          const isActive = (type === "All" && filter === "All") || filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/10"
                  : "bg-card-bg border border-card-border text-brand-text-sec hover:bg-card-border/20 hover:text-foreground"
              }`}
            >
              {type === "All" ? "All Resources" : `${type}s`}
            </button>
          );
        })}
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="group flex flex-col justify-between bg-card-bg border border-card-border rounded-2xl p-5 shadow-sm hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md hover:shadow-brand-primary/5 transition-all duration-200"
          >
            <div>
              {/* Type Badge & Author */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getTypeBadgeStyles(res.type)}`}>
                  {res.type}
                </span>
                <span className="text-[10px] text-brand-text-sec font-semibold truncate max-w-[170px]" title={res.author}>
                  {res.author}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-foreground group-hover:text-brand-primary transition-colors leading-snug mb-2">
                {res.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-brand-text-sec leading-relaxed font-semibold mb-6">
                {res.description}
              </p>
            </div>

            {/* Read more external button */}
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl border border-card-border hover:bg-brand-primary/5 hover:border-brand-primary/30 text-brand-primary hover:text-brand-primary font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Read more</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
