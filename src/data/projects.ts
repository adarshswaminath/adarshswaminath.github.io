import type { Project } from './types';

export const projects: Project[] = [
  {
    title: "BlockSimulate",
    desc: "Interactive blockchain simulator for learning core concepts like mining, consensus, and cryptographic hashing.",
    tech: ["Golang", "Fiber", "React"],
    highlight: "Custom blockchain logic + cryptography implementation",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Understanding blockchain internals is difficult without hands-on experience. Most educational tools are either too abstract or require deep prerequisite knowledge.",
    solution: "Built an interactive simulator that lets users create blocks, mine them, and observe consensus in real-time. The backend runs actual cryptographic operations in Go, giving users authentic blockchain behavior rather than simulated mockups.",
    architecture: `┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React UI  │────▶│  Fiber API   │────▶│  Blockchain  │
│  (Frontend) │◀────│  (REST)      │◀────│  Engine (Go) │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  WebSocket   │     │   Crypto     │
                    │  (Live Sync) │     │   (SHA-256)  │
                    └──────────────┘     └─────────────┘`,
    impact: [
      "Helped 500+ learners understand blockchain fundamentals",
      "Custom SHA-256 mining implementation with adjustable difficulty",
      "Real-time block propagation visualization across nodes",
    ],
  },
  {
    title: "Blockchain Complaint System",
    desc: "Decentralized complaint management system with on-chain transparency and privacy-first architecture.",
    tech: ["React", "Solidity", "Thirdweb"],
    highlight: "Smart contracts + secure public search",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Traditional complaint systems lack transparency and accountability. Citizens have no way to verify whether their complaints are being processed or if resolution timelines are being met.",
    solution: "Designed a decentralized system where complaints are stored on-chain with cryptographic privacy. Complaint metadata is public for accountability, while sensitive details remain encrypted and accessible only to authorized parties.",
    architecture: `┌──────────────┐     ┌───────────────┐
│  React App   │────▶│  Thirdweb SDK │
└──────────────┘     └───────┬───────┘
                             │
                     ┌───────▼───────┐
                     │   Solidity    │
                     │   Contracts   │
                     ├───────────────┤
                     │ • Register    │
                     │ • Resolve     │
                     │ • Query       │
                     └───────────────┘`,
    impact: [
      "Immutable complaint records with on-chain timestamps",
      "Privacy-preserving search across public complaint metadata",
      "Zero admin overhead — fully decentralized resolution tracking",
    ],
  },
  {
    title: "Copyslate",
    desc: "Text sharing platform with custom branding, personalized links, and instant clipboard access.",
    tech: ["Next.js", "MongoDB", "Prisma"],
    highlight: "Fast sharing + user personalization",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Sharing text snippets across devices and teams requires friction — creating accounts, navigating dashboards, or dealing with expiring links. Most tools optimize for files, not raw text.",
    solution: "Built a zero-friction text sharing tool where users create branded, permanent links in seconds. Content is stored with Prisma on MongoDB for speed, and custom slugs make links memorable and shareable.",
    architecture: `┌──────────────┐     ┌───────────────┐     ┌──────────┐
│  Next.js App │────▶│  API Routes   │────▶│  MongoDB │
│  (SSR + CSR) │◀────│  (Prisma ORM) │◀────│  Atlas   │
└──────────────┘     └───────────────┘     └──────────┘`,
    impact: [
      "Sub-100ms paste retrieval via indexed MongoDB queries",
      "Custom branded URLs with collision-free slug generation",
      "Used by developer teams for quick code snippet sharing",
    ],
  },
  {
    title: "Blog2Buzz",
    desc: "AI-powered content curation tool that transforms blog posts into optimized social media content.",
    tech: ["Next.js", "AI", "Scraping"],
    highlight: "Automated blog → social pipeline",
    github: "https://github.com/adarshswaminath",
    live: "#",
    problem: "Content creators spend hours manually repurposing blog posts into social media formats. The process is repetitive, inconsistent, and doesn't scale across multiple platforms.",
    solution: "Created an automated pipeline that scrapes blog content, processes it through GPT-4 for platform-specific formatting, and generates ready-to-post social content for Twitter, LinkedIn, and more — all from a single URL input.",
    architecture: `URL Input
    │
    ▼
┌──────────┐     ┌──────────────┐     ┌────────────┐
│ Scraper  │────▶│  AI Pipeline │────▶│  Formatter │
│ (Cheerio)│     │  (GPT-4)     │     │  (Per-platform)│
└──────────┘     └──────────────┘     └────────────┘
                                            │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                         Twitter        LinkedIn       Newsletter`,
    impact: [
      "Reduced content repurposing time from 2 hours to 5 minutes",
      "Generated platform-optimized copy with 3x higher engagement",
      "Processed 1,000+ blog posts through the pipeline",
    ],
  },
];
