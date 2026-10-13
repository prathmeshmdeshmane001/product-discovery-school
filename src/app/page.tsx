"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProgressBar from "@/components/ProgressBar";
import ModuleCard from "@/components/ModuleCard";
import ModuleDetailModal, { ModuleData, ModuleProgress } from "@/components/ModuleDetailModal";
import CompletionScreen from "@/components/CompletionScreen";
import AuthScreen from "@/components/AuthScreen";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import OpportunityMap from "@/components/OpportunityMap";
import ResearchLibrary from "@/components/ResearchLibrary";
import CommunityBoard from "@/components/CommunityBoard";

const modules: ModuleData[] = [
  {
    id: "mod-1",
    number: 1,
    title: "Define the problem",
    category: "Strategy",
    duration: "25 mins",
    description: "Learn how to frame target problems accurately and distinguish the problem space from the solution space.",
    concept: {
      explanation: "Great product teams focus on the problem space before exploring the solution space. A well-defined problem specifies who is facing it, what the friction is, and what outcome they are looking to achieve, without proposing any technology or interface. Working in the problem space keeps your team aligned on user needs rather than getting emotionally attached to specific features.",
      example: "Zoom didn't win by adding hundreds of features. They focused on one core problem space: 'It's too hard to join a video call, and the video lags.' By fixing connection reliability and creating one-click link joining, they solved the primary friction point."
    },
    exercise: {
      prompt: "Identify a software product you use weekly. Write down a feature you think is frustrating, and then re-frame that frustration as an underlying user problem.",
      placeholder: "Product: Spotify\nFrustration: The search takes too long.\nReframed Problem: When users want to listen to a specific song on the go, they struggle to locate it quickly because the search interface is cluttered with recommendations..."
    },
    quiz: {
      question: "Which of the following describes a statement in the 'problem space' rather than the 'solution space'?",
      options: [
        "We need to build a mobile app so users can track their steps.",
        "Users struggle to maintain a consistent exercise routine because they lack clear feedback on their daily progress.",
        "Let's add a green button on the homepage to start tracking workouts.",
        "A SQL database should be implemented to store workout telemetry."
      ],
      correctIndex: 1,
      explanation: "Option B focuses entirely on the user's struggle (lack of routine due to lack of feedback) without pre-supposing any specific solution (like a mobile app, database, or green button)."
    }
  },
  {
    id: "mod-2",
    number: 2,
    title: "Know your users",
    category: "Research",
    duration: "30 mins",
    description: "Discover techniques for continuous user interviewing, asking non-leading questions, and gathering empathy maps.",
    concept: {
      explanation: "Knowing your users isn't about looking at demographics (e.g., '25-34 year olds in city centers'). It is about understanding their behaviors, goals, and struggles. Continuous customer interviewing—talking to a customer every single week—is the best way to uncover active struggles. When interviewing, avoid asking hypothetical future questions (e.g., 'Would you use this feature?'). Instead, ask about concrete past behavior.",
      example: "Slack's early development involved interviewing and observing diverse teams (non-tech teams, designers, writers) who had zero experience with IRC. They watched users get stuck on setup steps and customized their onboarding to ensure ease of use."
    },
    exercise: {
      prompt: "Write three open-ended, non-leading questions you would ask a user to find out how they manage their task list during a busy workday.",
      placeholder: "1. Tell me about how you planned your tasks today.\n2. What was the most frustrating part of managing your tasks yesterday?\n3. How did you resolve that frustration?"
    },
    quiz: {
      question: "Which of the following questions is leading and should be avoided during a user interview?",
      options: [
        "Tell me about the last time you bought groceries online.",
        "How do you currently decide what recipe to cook?",
        "Don't you think an automatic recipe recommendation feature would save you a lot of time?",
        "What was the hardest part about preparing dinner last night?"
      ],
      correctIndex: 2,
      explanation: "Option C is leading because it implants the solution (automatic recipe recommendation) and prompts the user to agree ('save you a lot of time')."
    }
  },
  {
    id: "mod-3",
    number: 3,
    title: "Map your assumptions",
    category: "Strategy",
    duration: "30 mins",
    description: "Learn to deconstruct solutions into desirability, viability, feasibility, usability, and ethical assumptions.",
    concept: {
      explanation: "Every solution is built on a house of cards of assumptions. If any of those assumptions are false, the solution fails. We categorize assumptions into:\n1. Desirability: Do users want this? Do they care?\n2. Viability: Should we build this? Does it fit our business model?\n3. Feasibility: Can we build this with our tech stack and timeline?\n4. Usability: Can users figure out how to use it?\nMapping these assumptions allows us to test the riskiest assumptions first.",
      example: "When Airbnb launched, their biggest desirability assumption was: 'Travelers are willing to stay in a stranger's spare bedroom.' Their biggest usability/safety assumption was: 'Hosts are comfortable letting strangers sleep in their homes.'"
    },
    exercise: {
      prompt: "For a new service that delivers hot coffee to office desks within 5 minutes, list one desirability assumption and one feasibility assumption.",
      placeholder: "Desirability Assumption: Office workers value speed enough to pay a premium for 5-minute delivery over walking to the lobby coffee shop.\nFeasibility Assumption: We can maintain hot coffee temperatures during delivery while routing riders through security..."
    },
    quiz: {
      question: "If a product team is testing whether a subscription price of $15/month covers operations and yields profit, which type of assumption are they testing?",
      options: [
        "Desirability Assumption",
        "Feasibility Assumption",
        "Viability Assumption",
        "Usability Assumption"
      ],
      correctIndex: 2,
      explanation: "Viability assumptions focus on whether the solution is financially sustainable and supports business operations and goals."
    }
  },
  {
    id: "mod-4",
    number: 4,
    title: "Run experiments",
    category: "Testing",
    duration: "35 mins",
    description: "Design rapid tests such as landing page tests, Wizard-of-Oz, and Concierge services to validate assumptions.",
    concept: {
      explanation: "An experiment is a fast, cheap way to validate an assumption. Instead of writing code to build the actual product, we test demand or feasibility. Common methods include:\n- Landing Page Test: Create a webpage describing the service and measure signups.\n- Wizard of Oz: The front-end looks automated, but the back-end is entirely manual human labor.\n- Concierge: Deliver the service to the customer manually and face-to-face.",
      example: "Zappos founder Nick Swinmurn tested the assumption 'people are willing to buy shoes online' by photographing shoes in local stores, posting them on a website, and manually buying and shipping them when order emails arrived. He built zero inventory systems."
    },
    exercise: {
      prompt: "Outline a 'Wizard of Oz' experiment to test if busy parents would pay for an AI tutor to draft personalized bedtime stories for their children.",
      placeholder: "1. Create a basic landing page with a story builder form.\n2. When a parent submits inputs (theme, name, age), a human drafts the story instead of an AI model.\n3. Email the story to the parent within 10 minutes and measure satisfaction."
    },
    quiz: {
      question: "What is the difference between a Concierge experiment and a Wizard of Oz experiment?",
      options: [
        "Concierge is fully automated, whereas Wizard of Oz is manual.",
        "Concierge is delivered face-to-face/manually with the user knowing it is manual; Wizard of Oz hides the manual work behind an automated-looking front-end.",
        "Wizard of Oz requires writing full production code, while Concierge does not.",
        "There is no difference; they are different names for the same experiment."
      ],
      correctIndex: 1,
      explanation: "In a Concierge experiment, the manual nature is transparent to the user. In Wizard of Oz, the user believes they are interacting with an automated software system."
    }
  },
  {
    id: "mod-5",
    number: 5,
    title: "Opportunity mapping",
    category: "Strategy",
    duration: "30 mins",
    description: "Master the Opportunity-Solution Tree (OST) to connect business goals to user opportunities and solutions.",
    concept: {
      explanation: "The Opportunity-Solution Tree (OST), popularized by Teresa Torres, is a visual map that helps product teams maintain alignment. It starts with a clear Business Outcome (e.g. increase customer retention). Below that sit User Opportunities (needs, pain points, desires). Below opportunities are Solutions, and below solutions are Assumption Tests. This ensures every feature you build connects directly to a user need and a business goal.",
      example: "If Netflix's outcome is 'Increase monthly subscription renewal', an opportunity might be 'I want to watch movies with my friends remotely.' A solution is 'Group Watch party mode', and assumption tests check if users can sync video streams."
    },
    exercise: {
      prompt: "For an online learning platform with the outcome 'Increase course completion rate', list two customer opportunities (problems or needs) that stand in the way.",
      placeholder: "Opportunity 1: 'I lose motivation when studying alone for long periods.'\nOpportunity 2: 'I don't have enough time in my schedule to finish 2-hour video lectures.'"
    },
    quiz: {
      question: "What is the primary benefit of mapping multiple solutions under a single Opportunity in an OST?",
      options: [
        "It speeds up database queries.",
        "It prevents the team from falling in love with a single solution, encouraging them to compare options.",
        "It eliminates the need to do user interviews.",
        "It helps engineers write clean code."
      ],
      correctIndex: 1,
      explanation: "By mapping multiple solution candidates for a single opportunity, teams stay open-minded, comparing solutions against each other rather than debating 'should we build feature X or not'."
    }
  },
  {
    id: "mod-6",
    number: 6,
    title: "Prioritisation frameworks",
    category: "Strategy",
    duration: "30 mins",
    description: "Learn how to use RICE, ICE, and Value vs. Effort matrices to rank solutions objectively.",
    concept: {
      explanation: "Prioritisation frameworks prevent the 'HiPPO' (Highest Paid Person's Opinion) from dictating what gets built. A popular framework is RICE:\n- Reach: How many users will this affect in a given timeframe?\n- Impact: How much will this contribute to our target outcome? (3=Massive, 2=High, 1=Medium, 0.5=Low)\n- Confidence: How sure are we about these estimates? (100%=High, 80%=Medium, 50%=Low)\n- Effort: How many person-months will it take?\nRICE Score = (Reach * Impact * Confidence) / Effort.",
      example: "Intercom used RICE to evaluate a user notification feature. They estimated huge reach, medium impact, and 80% confidence, but 5 months of effort. They compared it to a login reminder (lower reach, high confidence, 0.5 months of effort) which scored much higher."
    },
    exercise: {
      prompt: "Calculate the RICE score for Feature A: Reach = 2,000 users/month, Impact = 2 (High), Confidence = 50% (0.5), Effort = 4 person-months.",
      placeholder: "Calculation:\nReach = 2000\nImpact = 2\nConfidence = 0.5\nEffort = 4\nRICE Score = (2000 * 2 * 0.5) / 4 = 500"
    },
    quiz: {
      question: "Under the RICE framework, what happens to a feature's score if the Effort increases while all other variables remain constant?",
      options: [
        "The RICE score increases.",
        "The RICE score decreases.",
        "The RICE score remains the same.",
        "The score drops to exactly zero."
      ],
      correctIndex: 1,
      explanation: "Effort is in the denominator. As effort (denominator) increases, the resulting RICE score decreases, indicating a lower priority relative to resources required."
    }
  },
  {
    id: "mod-7",
    number: 7,
    title: "Success metrics",
    category: "Analytics",
    duration: "25 mins",
    description: "Define your North Star Metric and distinguish input metrics from lagging output metrics.",
    concept: {
      explanation: "A North Star Metric is the key measure of customer value delivered. It has three parts: it measures customer value, represents product strategy, and is a leading indicator of revenue. We break the North Star into actionable Input Metrics (e.g. daily uploads, user search time) which teams can influence directly, avoiding a focus on lagging metrics like Revenue or Monthly Active Users.",
      example: "Spotify's North Star is 'Total time spent listening'. Their input metrics include: number of playlists created, search success rate, and retention of new users in their first week."
    },
    exercise: {
      prompt: "For a real estate renting app (like Zillow or Airbnb), define a North Star Metric and list one input metric that drives it.",
      placeholder: "North Star Metric: Total nights booked (Airbnb) or Total successful home tours booked (Zillow).\nInput Metric: Number of high-quality search queries performed per user."
    },
    quiz: {
      question: "Why is Monthly Active Users (MAU) usually considered a poor North Star Metric?",
      options: [
        "It changes too quickly.",
        "It is too hard to calculate.",
        "It is a vanity metric that doesn't measure whether users are actually experiencing the core value of the product.",
        "It doesn't include offline users."
      ],
      correctIndex: 2,
      explanation: "MAU measures traffic but doesn't capture depth of engagement. A user logging in once and leaving instantly counts as active, but they received zero core product value."
    }
  },
  {
    id: "mod-8",
    number: 8,
    title: "Jobs to be done",
    category: "Research",
    duration: "30 mins",
    description: "Understand the Jobs-to-be-Done (JTBD) framework to uncover why users 'hire' products.",
    concept: {
      explanation: "The Jobs-to-be-Done (JTBD) framework states that customers don't buy products; they 'hire' them to make progress in a specific circumstance. A job statement looks like this: 'When I [Situation], I want to [Motivation], so that I can [Desired Outcome].' JTBD shifts focus from customer traits (age, location) to customer context.",
      example: "Clayton Christensen's famous research showed that fast-food milkshakes were being 'hired' in the morning by commuters who wanted a thick, slow-to-drink beverage to keep them occupied and full during a boring drive to work."
    },
    exercise: {
      prompt: "Write a Jobs-to-be-Done statement for someone who buys noise-canceling headphones.",
      placeholder: "When I work in a noisy open office space, I want to block out background noise, so that I can focus deeply on my coding tasks and finish my work on time."
    },
    quiz: {
      question: "What is the core premise of the Jobs-to-be-Done (JTBD) framework?",
      options: [
        "Customers want to buy as many features as possible.",
        "Products are hired by users to make progress in a specific context.",
        "Companies should target demographic segments such as gender and age.",
        "Development should focus on writing tasks for engineers."
      ],
      correctIndex: 1,
      explanation: "JTBD asserts that understanding the context of the progress a user wants to make is the key to understanding buying decisions and product usage."
    }
  },
  {
    id: "mod-9",
    number: 9,
    title: "How might we",
    category: "Strategy",
    duration: "25 mins",
    description: "Learn how to turn opportunity statements into constructive, brainstorm-ready 'How Might We' questions.",
    concept: {
      explanation: "A 'How Might We' (HMW) question takes a user problem and reframes it as an opportunity for creative solutions. A good HMW question is not too broad (e.g. 'How might we redesign food delivery?') and not too narrow (e.g. 'How might we add a calendar to the food app?'). It sits in the sweet spot that invites diverse brainstorming ideas while preserving target constraints.",
      example: "Airbnb framed the problem: 'New guests are anxious about staying in a stranger's house' into: 'How might we build trust between hosts and guests before they meet in person?' This led to features like profile verification and mutual reviews."
    },
    exercise: {
      prompt: "Convert this problem: 'Students forget to complete their online homework because they are distracted' into a 'How Might We' question.",
      placeholder: "How might we make completing online homework feel like a natural, rewarding habit amidst daily distractions?"
    },
    quiz: {
      question: "Which of the following represents a well-framed 'How Might We' question?",
      options: [
        "How might we build a chatbot for billing questions?",
        "How might we help users manage their money?",
        "How might we make recurring bill payments feel stress-free and predictable?",
        "How might we write code to automate notifications?"
      ],
      correctIndex: 2,
      explanation: "Option C targets the specific user emotion (stress, predictability) while leaving the solution open (could be notifications, auto-pay settings, a visual timeline, etc.)."
    }
  },
  {
    id: "mod-10",
    number: 10,
    title: "Discovery canvas (capstone)",
    category: "Strategy",
    duration: "40 mins",
    description: "Synthesize your learning by completing a full Product Discovery Canvas for a product idea.",
    concept: {
      explanation: "The Product Discovery Canvas is a capstone tool that brings all elements of discovery together on a single board. It lists:\n1. Target Outcome: The business goal.\n2. Target User & Context: Who we are helping.\n3. Top Opportunities: Selected user pain points.\n4. Proposed Solutions: Brainstormed features.\n5. Riskiest Assumptions: Crucial hypotheses.\n6. Validation Experiments: Wizard of Oz, Smoke tests, etc.\n7. Success Criteria: Input metrics indicating validation.",
      example: "A team at Stripe launching a billing subscription product used a discovery canvas to align on reducing invoice disputes (outcome) by testing a draft billing invoice editor (solution) via a paper prototype (experiment) with 5 CFOs."
    },
    exercise: {
      prompt: "For a new product idea, 'Uber for Pet Sitting', write down 3 elements of its Discovery Canvas: the target outcome, the riskiest assumption, and a validation experiment.",
      placeholder: "Target Outcome: Reach 10% repeat bookings within 90 days.\nRiskiest Assumption: Pet owners are comfortable leaving keys and pets with background-checked sitters they've never met.\nValidation Experiment: A concierge test where the founder manually matches 10 local pet owners with sitters and handles coordinate logistics."
    },
    quiz: {
      question: "When should a product discovery canvas be updated?",
      options: [
        "Only once at the very beginning of the project.",
        "Continuously throughout the discovery cycle as assumption tests yield data and customer interviews shift opportunities.",
        "Only when the product is launched to production.",
        "Never; once written, it is a static legal specification."
      ],
      correctIndex: 1,
      explanation: "The canvas is a living document. It must change dynamically as you gather research feedback, fail/pass experiments, and refine opportunity focus."
    }
  }
];

const defaultProgressList: ModuleProgress[] = [
  { id: "mod-1", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-2", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-3", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-4", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-5", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-6", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-7", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-8", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-9", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
  { id: "mod-10", step1Completed: false, step2Answer: "", step2Feedback: "", step3SelectedIndex: -1, step3Completed: false },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [progressList, setProgressList] = useState<ModuleProgress[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [forceShowModules, setForceShowModules] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Selected module detail modal state
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);

  // Welcome modal state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Guest onboarding & delayed signup states
  const [isGuest, setIsGuest] = useState(false);
  const [showSignupPromptModal, setShowSignupPromptModal] = useState(false);
  const [guestDismissedSignupPrompt, setGuestDismissedSignupPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ name: string; proceed: () => void } | null>(null);
  const [forceSignUpInAuth, setForceSignUpInAuth] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load guest states and theme preference from storage on client-side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGuest = sessionStorage.getItem("is_guest") === "true";
      setIsGuest(savedGuest);
      const dismissed = localStorage.getItem("guest_dismissed_signup_prompt") === "true";
      setGuestDismissedSignupPrompt(dismissed);

      // Theme logic
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Check if it's the user's first login to show welcome modal
  useEffect(() => {
    if (session && isLoaded) {
      const hasSeenWelcome = localStorage.getItem(`seen-welcome-${session.user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    }
  }, [session, isLoaded]);

  // Monitor Supabase session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync user progress from Supabase database, localStorage guest mode, or migrate guest progress
  useEffect(() => {
    if (!isLoaded && !session && !isGuest) {
      if (typeof window !== "undefined") {
        const savedGuest = sessionStorage.getItem("is_guest") === "true";
        if (savedGuest) {
          setIsGuest(true);
          const savedProgress = localStorage.getItem("guest_progress");
          if (savedProgress) {
            try {
              setProgressList(JSON.parse(savedProgress));
            } catch (e) {
              setProgressList(defaultProgressList);
            }
          } else {
            setProgressList(defaultProgressList);
          }
          setIsLoaded(true);
          return;
        }
      }
    }

    if (session) {
      const loadDatabaseAndMigrateProgress = async () => {
        try {
          const userId = session.user.id;
          
          // Check if there is guest progress to migrate
          let guestProgress: ModuleProgress[] | null = null;
          if (typeof window !== "undefined") {
            const saved = localStorage.getItem("guest_progress");
            if (saved) {
              try {
                guestProgress = JSON.parse(saved);
              } catch (e) {
                console.error("Error parsing guest progress for migration:", e);
              }
            }
          }

          // Fetch database progress
          const { data, error } = await supabase
            .from("user_progress")
            .select("progress")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) throw error;

          let finalProgress = defaultProgressList;
          if (data && data.progress) {
            finalProgress = data.progress;
          }

          // Perform migration if guest progress exists
          if (guestProgress) {
            finalProgress = finalProgress.map((dbMod) => {
              const guestMod = guestProgress?.find((g) => g.id === dbMod.id);
              if (!guestMod) return dbMod;

              // Check if guest progress is more advanced or contains new data
              const hasGuestProgress =
                guestMod.step1Completed ||
                guestMod.step2Answer.trim().length > 0 ||
                guestMod.step3Completed;

              if (hasGuestProgress) {
                return guestMod;
              }
              return dbMod;
            });

            // Also check for special keys like opportunity-map which are saved as custom rows/elements inside progress list
            const guestSpecialItems = guestProgress.filter((g) => !defaultProgressList.some((d) => d.id === g.id));
            for (const spec of guestSpecialItems) {
              if (!finalProgress.some((f) => f.id === spec.id)) {
                finalProgress.push(spec);
              } else {
                finalProgress = finalProgress.map((f) => (f.id === spec.id ? spec : f));
              }
            }

            // Save migrated progress to Supabase
            await supabase
              .from("user_progress")
              .upsert({ user_id: userId, progress: finalProgress, updated_at: new Date().toISOString() });

            // Clear guest progress from localStorage and sessionStorage
            localStorage.removeItem("guest_progress");
            sessionStorage.removeItem("is_guest");
            setIsGuest(false);
          } else if (!data) {
            // Initialize user progress row if none exists
            await supabase
              .from("user_progress")
              .insert({ user_id: userId, progress: defaultProgressList });
          }

          setProgressList(finalProgress);
        } catch (err) {
          console.error("Error loading/migrating progress from Supabase:", err);
          setProgressList(defaultProgressList);
        } finally {
          setIsLoaded(true);
        }
      };

      loadDatabaseAndMigrateProgress();
    } else if (isGuest) {
      // Guest mode progress loading
      const saved = localStorage.getItem("guest_progress");
      if (saved) {
        try {
          setProgressList(JSON.parse(saved));
        } catch (e) {
          setProgressList(defaultProgressList);
        }
      } else {
        setProgressList(defaultProgressList);
      }
      setIsLoaded(true);
    }
  }, [session, isGuest]);

  // Handler to update a module's progress (upsert to Supabase or save locally for guest)
  const handleSaveProgress = async (updated: ModuleProgress) => {
    let nextProgressList;
    if (progressList.some((p) => p.id === updated.id)) {
      nextProgressList = progressList.map((p) => (p.id === updated.id ? updated : p));
    } else {
      nextProgressList = [...progressList, updated];
    }
    setProgressList(nextProgressList);

    if (session) {
      try {
        const userId = session.user.id;
        const { error } = await supabase
          .from("user_progress")
          .upsert({ user_id: userId, progress: nextProgressList, updated_at: new Date().toISOString() });

        if (error) throw error;
      } catch (err) {
        console.error("Error saving progress to Supabase:", err);
      }
    } else if (isGuest) {
      localStorage.setItem("guest_progress", JSON.stringify(nextProgressList));
    }
  };

  // Reset progress helper
  const handleResetProgress = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset all your progress? This will delete your answers and lock modules 2-10."
      )
    ) {
      setProgressList(defaultProgressList);
      setForceShowModules(false);

      if (session) {
        try {
          const userId = session.user.id;
          const { error } = await supabase
            .from("user_progress")
            .upsert({ user_id: userId, progress: defaultProgressList, updated_at: new Date().toISOString() });
          if (error) throw error;
        } catch (err) {
          console.error("Error resetting progress in Supabase:", err);
        }
      } else if (isGuest) {
        localStorage.setItem("guest_progress", JSON.stringify(defaultProgressList));
      }
    }
  };

  // Fast-track autocomplete helper
  const handleFastTrackAll = async () => {
    const allCompleted = defaultProgressList.map((p) => {
      const targetMod = modules.find((m) => m.id === p.id);
      return {
        id: p.id,
        step1Completed: true,
        step2Answer: "This exercise has been fast-tracked. Product discovery principles are fully documented.",
        step2Feedback: "Fast-tracked coaching: Great job applying discovery concepts directly to this module's objectives!",
        step3SelectedIndex: targetMod ? targetMod.quiz.correctIndex : 0,
        step3Completed: true,
      };
    });
    setProgressList(allCompleted);
    setForceShowModules(false);

    if (session) {
      try {
        const userId = session.user.id;
        const { error } = await supabase
          .from("user_progress")
          .upsert({ user_id: userId, progress: allCompleted, updated_at: new Date().toISOString() });
        if (error) throw error;
      } catch (err) {
        console.error("Error fast-tracking progress in Supabase:", err);
      }
    } else if (isGuest) {
      localStorage.setItem("guest_progress", JSON.stringify(allCompleted));
    }
  };

  // Guest actions & delayed signup handlers
  const handleGuestEnter = () => {
    sessionStorage.setItem("is_guest", "true");
    setIsGuest(true);
    const saved = localStorage.getItem("guest_progress");
    if (saved) {
      try {
        setProgressList(JSON.parse(saved));
      } catch (e) {
        setProgressList(defaultProgressList);
      }
    } else {
      setProgressList(defaultProgressList);
    }
    setIsLoaded(true);
  };

  const handleSignOutClick = async () => {
    sessionStorage.removeItem("is_guest");
    setIsGuest(false);
    localStorage.removeItem("guest_dismissed_signup_prompt");
    setGuestDismissedSignupPrompt(false);
    setForceSignUpInAuth(false);
    await supabase.auth.signOut();
  };

  const handleActionRequiringSignup = (actionName: string, proceed: () => void) => {
    if (session) {
      proceed();
      return;
    }

    if (guestDismissedSignupPrompt) {
      proceed();
      return;
    }

    setPendingAction({ name: actionName, proceed });
    setShowSignupPromptModal(true);
  };

  // Calculate unlock and completion stats
  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true;
    
    // Check if previous module has all 3 steps completed
    const prevModId = modules[index - 1].id;
    const prevProgress = progressList.find((p) => p.id === prevModId);
    if (!prevProgress) return false;

    return (
      prevProgress.step1Completed &&
      prevProgress.step2Answer.trim().length > 0 &&
      prevProgress.step3Completed
    );
  };

  // Overall step metrics (out of 30 total steps)
  const completedStepsCount = progressList.reduce((acc, curr) => {
    const s1 = curr.step1Completed ? 1 : 0;
    const s2 = curr.step2Answer.trim().length > 0 ? 1 : 0;
    const s3 = curr.step3Completed ? 1 : 0;
    return acc + s1 + s2 + s3;
  }, 0);

  // Overall modules completed (modules with all 3 steps complete)
  const completedModulesCount = progressList.filter((curr) => {
    return (
      curr.step1Completed &&
      curr.step2Answer.trim().length > 0 &&
      curr.step3Completed
    );
  }).length;

  // Quiz Score tracking (modules where quiz step is correct/completed)
  const quizScore = progressList.filter((curr) => curr.step3Completed).length;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border-2 border-brand-primary border-t-transparent animate-spin"></div>
          <p className="text-xs font-bold text-foreground/50 tracking-wider">
            Verifying credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!session && !isGuest) {
    return (
      <AuthScreen
        onGuestEnter={handleGuestEnter}
        initialSignUp={forceSignUpInAuth}
      />
    );
  }

  // Render a clean loading indicator to avoid hydration mismatch
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border-2 border-brand-primary border-t-transparent animate-spin"></div>
          <p className="text-xs font-bold text-foreground/50 tracking-wider">
            Loading Discovery School...
          </p>
        </div>
      </div>
    );
  }

  // Active progress model for selected modal
  const activeProgress = selectedModule 
    ? progressList.find((p) => p.id === selectedModule.id) ?? defaultProgressList[0]
    : defaultProgressList[0];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col md:pl-64 lg:pl-72 min-h-screen">
        {/* Top Header bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-card-border px-4 py-3.5 md:px-8 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-foreground/60 hover:bg-brand-primary/10 hover:text-brand-primary md:hidden transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest">
                My Dashboard
              </span>
              <h2 className="text-base font-extrabold text-foreground">
                Continuous Discovery Path
              </h2>
              <p className="text-[10px] text-brand-text-sec font-bold mt-0.5">
                10 modules · Real exercises · AI coaching · Your canvas at the end
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:gap-5">
            {/* Header statistics badges */}
            <div className="flex items-center gap-2.5 md:gap-3.5 border-r border-card-border pr-3 md:pr-5">
              {/* XP Badge */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold shadow-sm"
                title="XP earned from completed checkpoints"
              >
                <span className="text-sm">⚡</span>
                <span>{completedStepsCount * 10} XP</span>
              </div>

              {/* Streak Badge */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-warning/10 text-brand-warning text-xs font-bold shadow-sm"
                title="Mocked Daily Streak"
              >
                <span>🔥</span>
                <span>3 day streak</span>
              </div>
            </div>

            {/* Profile Avatar & Logout */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={handleToggleTheme}
                className="p-2 rounded-xl text-foreground/60 hover:bg-brand-primary/10 hover:text-brand-primary transition-all duration-150 cursor-pointer flex items-center justify-center text-sm"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === "light" ? "☀️" : "🌙"}
              </button>
              <button className="hidden sm:flex p-2 rounded-xl text-foreground/60 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center shadow-inner">
                H
              </div>
              <button
                onClick={handleSignOutClick}
                className="ml-1 px-4 py-2 rounded-full border-2 border-red-500/20 hover:bg-red-500/5 text-red-600 font-bold text-xs transition-colors shadow-sm"
                title="Sign Out"
              >
                Log Out
              </button>
            </div>
          </div>
        </header>

        {/* Home main layout */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === "curriculum" && (
            <>
              {/* Welcome Banner Card */}
              <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md shadow-brand-primary/15 select-none">
                {/* Background glowing decorations */}
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                
                <div className="space-y-2 max-w-xl z-10">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    Keep going! You're doing great 🚀
                  </h1>
                  <p className="text-xs md:text-sm text-white/95 leading-relaxed font-semibold">
                    Welcome to the Product Discovery School! Complete the concept checkpoints, practical exercise applications, and quizzes sequentially to unlock the capstone Discovery Canvas.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 z-10">
                  <a
                    href="#modules"
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-white/90 text-brand-primary font-bold text-xs shadow-md transition-all scale-100 hover:scale-[1.03] active:scale-95"
                  >
                    Go to Modules
                  </a>
                  <button
                    onClick={handleFastTrackAll}
                    className="px-4 py-2.5 rounded-full border-2 border-white/40 hover:bg-white/10 text-white font-bold text-xs transition-all scale-100 hover:scale-[1.03] active:scale-95"
                  >
                    Fast-Track All
                  </button>
                </div>
              </div>

              {/* Overall Progress Section */}
              <ProgressBar 
                completedStepsCount={completedStepsCount} 
                totalStepsCount={30} 
                completedModulesCount={completedModulesCount} 
                totalModulesCount={10} 
                quizScore={quizScore}
              />

              {completedModulesCount === 10 && !forceShowModules ? (
                <CompletionScreen
                  modules={modules}
                  progressList={progressList}
                  onResetProgress={handleResetProgress}
                  onViewCurriculum={() => setForceShowModules(true)}
                />
              ) : (
                /* Curriculum Modules Heading */
                <div id="modules" className="pt-2 space-y-6">
                  {completedModulesCount === 10 && forceShowModules && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-200">
                      <span>🎉 You have graduated! Click the button to view your synthesized Discovery Canvas.</span>
                      <button
                        onClick={() => setForceShowModules(false)}
                        className="px-4 py-2 rounded-xl bg-[#1D9E75] text-white font-bold hover:bg-[#1D9E75]/90 transition-colors shadow-sm whitespace-nowrap"
                      >
                        View Graduation Canvas
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between select-none">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Curriculum Modules</h2>
                      <p className="text-xs text-foreground/50 mt-0.5">
                        Complete each module sequentially. Locked modules are enabled once previous tasks are done.
                      </p>
                    </div>
                    <button
                      onClick={handleResetProgress}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Reset Progress
                    </button>
                  </div>

                  {/* Modules Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {modules.map((mod, index) => {
                      const modProgress = progressList.find((p) => p.id === mod.id) ?? defaultProgressList[index];
                      const unlocked = isModuleUnlocked(index);
                      return (
                        <ModuleCard
                          key={mod.id}
                          module={mod}
                          progress={modProgress}
                          isUnlocked={unlocked}
                          onClick={() => setSelectedModule(mod)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "opportunity-tree" && (
            <OpportunityMap
              progressList={progressList}
              onSaveProgress={handleSaveProgress}
              onRequireSignup={handleActionRequiringSignup}
            />
          )}

          {activeTab === "library" && (
            <ResearchLibrary />
          )}

          {activeTab === "community" && (
            <CommunityBoard />
          )}

          {activeTab === "settings" && (
            <div className="bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 shadow-sm space-y-4 max-w-2xl mx-auto">
              <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                ⚙️ Settings
              </h2>
              <p className="text-xs text-brand-text-sec font-semibold">
                Configure your continuous discovery preferences, sync status, and account settings.
              </p>
              <div className="border-t border-card-border/60 pt-4 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-foreground">Account Status</span>
                  <span className="text-brand-primary font-mono">
                    {session ? session.user.email : "Guest Mode (Local Progress Only)"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-foreground">App Version</span>
                  <span className="text-brand-text-sec">v1.2.0 (Duolingo Edition)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-foreground">Supabase Database Sync</span>
                  <span className={session ? "text-brand-success" : "text-brand-warning"}>
                    {session ? "Active & Online" : "Inactive (Log in to Sync)"}
                  </span>
                </div>
                {!session && (
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("is_guest");
                      setIsGuest(false);
                      setForceSignUpInAuth(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs transition-all cursor-pointer text-center"
                  >
                    Create a free account to sync progress
                  </button>
                )}
                <button
                  onClick={handleResetProgress}
                  className="w-full py-3 rounded-2xl border-2 border-red-500/25 hover:bg-red-500/5 text-red-600 font-extrabold text-xs transition-all cursor-pointer text-center"
                >
                  Danger Zone: Reset All Progress
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal overlay for running steps */}
      {selectedModule && (
        <ModuleDetailModal
          isOpen={!!selectedModule}
          onClose={() => setSelectedModule(null)}
          module={selectedModule}
          progress={activeProgress}
          onSaveProgress={handleSaveProgress}
          onRequireSignup={handleActionRequiringSignup}
        />
      )}

      {/* One-time welcome modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200 select-none font-sans">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary text-3xl mb-2 shadow-inner animate-bounce-subtle">
                🎓
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                Welcome to Product Discovery School! 🎓
              </h2>
              <p className="text-xs md:text-sm text-brand-text-sec font-semibold leading-relaxed">
                Let's get you set up to master continuous product discovery habits through hands-on learning.
              </p>
            </div>

            {/* Steps explanation */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3.5 rounded-2xl border border-card-border bg-background/40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs">
                  1
                </div>
                <div className="leading-tight flex-1">
                  <h4 className="text-xs font-bold text-foreground">Step 1: Work through each module in order</h4>
                  <p className="text-[10px] text-brand-text-sec font-semibold mt-0.5">Gain foundational knowledge and practical insights step by step.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl border border-card-border bg-background/40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-secondary/10 text-brand-secondary font-bold text-xs">
                  2
                </div>
                <div className="leading-tight flex-1">
                  <h4 className="text-xs font-bold text-foreground">Step 2: Complete exercises and get AI feedback</h4>
                  <p className="text-[10px] text-brand-text-sec font-semibold mt-0.5">Write down your thoughts and get direct coaching insights from Gemini AI.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl border border-card-border bg-background/40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-warning/10 text-brand-warning font-bold text-xs">
                  3
                </div>
                <div className="leading-tight flex-1">
                  <h4 className="text-xs font-bold text-foreground">Step 3: Finish all 10 to unlock your Discovery Canvas</h4>
                  <p className="text-[10px] text-brand-text-sec font-semibold mt-0.5">Synthesize outcomes, opportunities, solutions, and experiments into a live document.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (session) {
                  localStorage.setItem(`seen-welcome-${session.user.id}`, "true");
                }
                setShowWelcomeModal(false);
                setSelectedModule(modules[0]);
              }}
              className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs shadow-md shadow-brand-primary/15 transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Let's go!</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Signup Prompt Modal */}
      {showSignupPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card-bg border border-card-border w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200 select-none font-sans text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary text-3xl mb-2 shadow-inner animate-bounce-subtle">
                🎓
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                Save your progress! 🎓
              </h2>
              <p className="text-xs md:text-sm text-brand-text-sec font-semibold leading-relaxed">
                You're doing great! Create a free account to save your progress, get AI coaching, and unlock your Discovery Canvas.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  sessionStorage.removeItem("is_guest");
                  setIsGuest(false);
                  setForceSignUpInAuth(true);
                  setShowSignupPromptModal(false);
                }}
                className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary/95 text-white font-extrabold text-xs shadow-md shadow-brand-primary/15 transition-all cursor-pointer flex items-center justify-center"
              >
                Create free account
              </button>
              
              <button
                onClick={() => {
                  localStorage.setItem("guest_dismissed_signup_prompt", "true");
                  setGuestDismissedSignupPrompt(true);
                  setShowSignupPromptModal(false);
                  if (pendingAction) {
                    pendingAction.proceed();
                    setPendingAction(null);
                  }
                }}
                className="w-full py-3.5 rounded-full border-2 border-card-border hover:bg-foreground/5 text-foreground/70 font-extrabold text-xs transition-all cursor-pointer"
              >
                Maybe later (progress won't be saved)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
