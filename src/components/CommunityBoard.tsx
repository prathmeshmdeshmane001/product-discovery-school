"use client";

import React, { useState } from "react";

interface Post {
  id: string;
  author: string;
  avatarLetter: string;
  role: string;
  title: string;
  content: string;
  tag: "Canvas" | "Question" | "Tip";
  upvotes: number;
  hasUpvoted: boolean;
  time: string;
}

export default function CommunityBoard() {
  const [filter, setFilter] = useState<"All" | "Canvas" | "Question" | "Tip">("All");
  const [showComposer, setShowComposer] = useState(false);

  // Composer Form States
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState<"Canvas" | "Question" | "Tip">("Canvas");

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      author: "Vaishnavi",
      avatarLetter: "V",
      role: "Product Explorer",
      title: "PetSitter Discovery Canvas - Concierge Experiment Results! 🐶",
      content: "Just finished my capstone canvas for a peer-to-peer pet sitting service. Our riskiest assumption was that pet owners would trust strangers. We ran a concierge test with 5 local pet owners where we manually matching them with vetted sitters. 4 out of 5 booked immediately, validating the trust opportunity when high quality vetting feedback is shown!",
      tag: "Canvas",
      upvotes: 18,
      hasUpvoted: false,
      time: "2 hours ago",
    },
    {
      id: "post-2",
      author: "Alex Miller",
      avatarLetter: "A",
      role: "Lead PM student",
      title: "How do you estimate Reach for pre-launch features in RICE? 🤔",
      content: "Hey community, I'm working through Module 6 (Prioritisation). When estimating 'Reach' for a completely new feature idea where we have no active usage logs, do you typically count your entire target addressable market, or do you restrict the count strictly to the small percentage of users who experience the parent opportunity?",
      tag: "Question",
      upvotes: 7,
      hasUpvoted: false,
      time: "1 day ago",
    },
    {
      id: "post-3",
      author: "Sam Chen",
      avatarLetter: "S",
      role: "Discovery Coach",
      title: "Tip: Reframe 'Would you buy this?' during customer interviews 💡",
      content: "Quick reminder for Module 2! Hypothetical future questions ('Would you subscribe to a service that does X?') always suffer from optimism bias. Instead, try: 'Tell me about the last time you experienced [problem]. How did you solve it? How much did it cost?'. If they haven't spent time or money trying to solve it in the past, they won't buy your solution.",
      tag: "Tip",
      upvotes: 24,
      hasUpvoted: false,
      time: "2 days ago",
    },
    {
      id: "post-4",
      author: "Jordan Blake",
      avatarLetter: "J",
      role: "Product Designer",
      title: "Coffee Delivery Canvas - Landing Page Smoke Test ☕",
      content: "Shared my Coffee Desk Delivery canvas last week. Yesterday we finished a simple landing page test offering 'Hot coffee at your desk in 5 minutes'. We drove 120 visitors via local Slack channels and got a 14% email signup conversion rate ($3/month mock pricing check). Desirability verified! Moving on to testing viability assumptions next.",
      tag: "Canvas",
      upvotes: 12,
      hasUpvoted: false,
      time: "3 days ago",
    },
  ]);

  // Handle Upvoting locally
  const handleUpvote = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            hasUpvoted: !post.hasUpvoted,
          };
        }
        return post;
      })
    );
  };

  // Handle Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please enter a title and content for your post.");
      return;
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: "Harsh", // Using logged-in user name placeholder
      avatarLetter: "H",
      role: "Discovery Student",
      title: newTitle,
      content: newContent,
      tag: newTag,
      upvotes: 1,
      hasUpvoted: true,
      time: "Just now",
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setNewTag("Canvas");
    setShowComposer(false);
  };

  const filteredPosts = filter === "All" 
    ? posts 
    : posts.filter((p) => p.tag === filter);

  // Tag color helper
  const getTagStyles = (tag: string) => {
    switch (tag) {
      case "Canvas":
        return "bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20";
      case "Question":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15";
      case "Tip":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/15";
    }
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl mx-auto w-full">
      {/* Discussion Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Community Forum</h2>
          <p className="text-xs text-brand-text-sec font-semibold">
            Connect with other product discovery students, share your Discovery Canvases, ask questions, and trade tips.
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-md shadow-brand-primary/15 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>✍️</span> Share your canvas
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-card-border/60 pb-3">
        {(["All", "Canvas", "Question", "Tip"] as const).map((tag) => {
          const isActive = (tag === "All" && filter === "All") || filter === tag;
          return (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/10"
                  : "bg-card-bg border border-card-border text-brand-text-sec hover:bg-card-border/20 hover:text-foreground"
              }`}
            >
              {tag === "All" ? "All Posts" : `${tag}s`}
            </button>
          );
        })}
      </div>

      {/* Discussion Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center text-brand-text-sec font-semibold text-xs leading-normal">
            No posts found in this category yet. Be the first to share!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-card-bg border border-card-border rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 md:gap-5 hover:shadow-md transition-shadow"
            >
              {/* Upvote side widget */}
              <button
                onClick={() => handleUpvote(post.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer select-none w-11 ${
                  post.hasUpvoted
                    ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                    : "border-card-border text-brand-text-sec hover:bg-foreground/5 hover:text-foreground"
                }`}
                title={post.hasUpvoted ? "Remove upvote" : "Upvote post"}
              >
                <span className="text-xs">▲</span>
                <span className="text-xs font-extrabold">{post.upvotes}</span>
              </button>

              {/* Post details */}
              <div className="flex-1 space-y-3 min-w-0">
                {/* Author profile row */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center">
                    {post.avatarLetter}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h4 className="text-xs font-extrabold text-foreground truncate">
                      {post.author}
                    </h4>
                    <p className="text-[10px] text-brand-text-sec font-semibold truncate">
                      {post.role} • {post.time}
                    </p>
                  </div>
                  <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getTagStyles(post.tag)}`}>
                    {post.tag}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-sm md:text-base font-extrabold text-foreground leading-snug">
                  {post.title}
                </h3>

                {/* Post Content */}
                <p className="text-xs leading-relaxed text-brand-text-sec font-semibold whitespace-pre-line">
                  {post.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleCreatePost}
            className="bg-card-bg border border-card-border w-full max-w-lg rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200"
          >
            <div>
              <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                ✍️ Write a Community Post
              </h3>
              <p className="text-[11px] text-brand-text-sec mt-0.5 font-semibold leading-relaxed">
                Share your capstone discovery canvas results, ask a conceptual question, or trade a learning tip.
              </p>
            </div>

            {/* Select Post Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                Post Category
              </label>
              <div className="flex gap-2">
                {(["Canvas", "Question", "Tip"] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewTag(tag)}
                    className={`flex-1 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      newTag === tag
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-background border-card-border text-brand-text-sec hover:bg-card-border/25"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                Post Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. My Discovery Canvas for Uber-for-petsitter!"
                className="w-full rounded-2xl border border-card-border p-3 text-xs font-semibold focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background outline-none transition-all"
              />
            </div>

            {/* Content Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider">
                Post Body
              </label>
              <textarea
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Share your experiments, results, or questions in detail..."
                className="w-full rounded-2xl border border-card-border p-3 text-xs font-semibold focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background outline-none transition-all h-32 resize-none leading-relaxed"
              />
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowComposer(false);
                  setNewTitle("");
                  setNewContent("");
                  setNewTag("Canvas");
                }}
                className="px-4 py-2 rounded-full border border-card-border hover:bg-card-border/20 text-brand-text-sec font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs shadow-md shadow-brand-primary/15 transition-all cursor-pointer"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
