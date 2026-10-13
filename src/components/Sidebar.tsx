"use client";

import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: "curriculum",
      name: "Curriculum",
      icon: (
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "opportunity-tree",
      name: "Opportunity Maps",
      icon: (
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: "library",
      name: "Research Library",
      icon: (
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
    },
    {
      id: "community",
      name: "Community",
      icon: (
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "settings",
      name: "Settings",
      icon: (
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-bg border-r border-card-border p-5 md:p-6 select-none font-sans">
      {/* Brand logo & header */}
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-md shadow-brand-primary/25">
          <span className="text-2xl">🎓</span>
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-foreground">
            Discovery School
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-wider text-brand-text-sec mt-0.5">
            Product School
          </p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md shadow-brand-primary/20 scale-[1.01]"
                  : "text-brand-text-sec hover:bg-card-border/40 hover:text-foreground"
              }`}
            >
              <span className={isActive ? "text-white" : "text-brand-text-sec"}>
                {item.icon}
              </span>
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User profile section at the bottom */}
      <div className="border-t border-card-border pt-4 mt-6">
        <div className="flex items-center gap-3.5 px-2">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-base">
            H
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-success border-2 border-sidebar-bg rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-extrabold text-foreground truncate">
              Harsh
            </h2>
            <p className="text-xs text-brand-text-sec font-semibold truncate">
              Discovery Student
            </p>
          </div>
        </div>
        <div className="mt-4 bg-brand-primary/5 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-brand-primary border border-brand-primary/10">
          <span>Level 2 Discovery Explorer</span>
          <span className="bg-brand-warning text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Active
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible on mobile only) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
          />

          {/* Sidebar menu drawer */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-sidebar-bg animate-in slide-in-from-left duration-300 z-50">
            {sidebarContent}
            {/* Close button inside drawer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
