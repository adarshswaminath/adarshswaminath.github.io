import type { Project } from './types';

export const projects: Project[] = [
  {
    title: "BlockSimulate",
    desc: "Interactive system simulator for understanding distributed data flow, state transitions, and cryptographic operations.",
    tech: ["Golang", "Fiber", "React"],
    highlight: "Backend systems + real-time visualization",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Understanding how distributed systems and state transitions work in practice is difficult without interactive tooling. Most resources are either too theoretical or overly simplified.",
    solution: "Built an interactive simulator that models block creation, validation, and state updates in real time. The backend handles actual cryptographic operations, while the frontend visualizes system behavior to make concepts easier to grasp.",
    architecture: `┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React UI  │────▶│  Fiber API   │────▶│  Core Engine │
│  (Frontend) │◀────│  (REST)      │◀────│   (Go)       │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  WebSocket   │
                    │  (Live Sync) │
                    └──────────────┘`,
    impact: [
      "Improved understanding of system workflows through visual feedback",
      "Implemented cryptographic hashing and validation logic in Go",
      "Real-time UI updates reflecting backend state changes",
    ],
  },

  {
    title: "Complaint Management System",
    desc: "Full-stack complaint tracking platform with structured workflows and secure data handling.",
    tech: ["React", "Solidity", "Thirdweb"],
    highlight: "Structured workflows + secure data access",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Traditional complaint systems lack clear tracking, structured workflows, and transparency, making it difficult for users to follow resolution progress.",
    solution: "Built a system that enables structured complaint submission, tracking, and resolution. Focused on secure data handling and role-based access, while exploring decentralized storage concepts for auditability.",
    architecture: `┌──────────────┐     ┌───────────────┐
│  React App   │────▶│  API / SDK    │
└──────────────┘     └───────┬───────┘
                             │
                     ┌───────▼───────┐
                     │   Contracts   │
                     │  / Services   │
                     └───────────────┘`,
    impact: [
      "Clear complaint tracking with structured status updates",
      "Improved data handling with separation of public/private fields",
      "Explored decentralized approaches for auditability",
    ],
  },

  {
    title: "Copyslate",
    desc: "Lightweight text-sharing tool for fast, cross-device access with personalized links.",
    tech: ["Next.js", "MongoDB", "Prisma"],
    highlight: "Fast sharing + clean UX",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Sharing text snippets across devices or teams often involves unnecessary friction like authentication flows or complex dashboards.",
    solution: "Developed a minimal, fast-sharing tool that allows users to generate and access text via simple links. Focused on speed, usability, and clean data modeling.",
    architecture: `┌──────────────┐     ┌───────────────┐     ┌──────────┐
│  Next.js App │────▶│  API Routes   │────▶│  MongoDB │
│  (SSR + CSR) │◀────│  (Prisma ORM) │◀────│  Atlas   │
└──────────────┘     └───────────────┘     └──────────┘`,
    impact: [
      "Fast text retrieval with optimized database queries",
      "Clean URL-based sharing for better usability",
      "Designed for simplicity and low user friction",
    ],
  },

  {
    title: "Blog2Buzz",
    desc: "Automated content pipeline that transforms long-form blogs into structured social media outputs.",
    tech: ["Next.js", "AI", "Scraping"],
    highlight: "Automation + AI-assisted workflows",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Repurposing long-form content into multiple formats is time-consuming and repetitive for developers and content creators.",
    solution: "Built a pipeline that extracts blog content, processes it using AI, and generates structured outputs for different platforms. Focused on automation and consistency rather than manual effort.",
    architecture: `URL Input
    │
    ▼
┌──────────┐     ┌──────────────┐     ┌────────────┐
│ Scraper  │────▶│  Processing  │────▶│ Formatter  │
│          │     │   (AI)       │     │            │
└──────────┘     └──────────────┘     └────────────┘`,
    impact: [
      "Reduced manual effort in content repurposing",
      "Consistent output formatting across platforms",
      "Demonstrated practical use of AI in workflows",
    ],
  },
];