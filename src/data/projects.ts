import type { Project } from './types';

export const projects: Project[] = [
  {
    title: 'PR-Analyzer',
    desc: 'A comprehensive Version Control System management platform with AI-powered code reviews, multi-provider VCS integration, and background job processing.',
    tech: ['TypeScript', 'Express.js', 'Next.js', 'PostgreSQL', 'Redis', 'BullMQ', 'LangChain', 'OpenAI/Gemini'],
    highlight: 'Multi-provider VCS integration + AI-powered PR reviews + Real-time job orchestration',
    github: 'https://github.com/adarshswaminath/PR-Analyzer',
    live: '#',
    image: '/projects/pr-analyzer.png',
    problem:
      'Developers struggle to manage repositories across multiple VCS platforms (GitHub, GitLab, etc.) and need intelligent code review assistance to maintain code quality. Synchronizing data across platforms and generating contextual code reviews is tedious and time-consuming.',
    solution:
      'Built a unified platform that seamlessly integrates with multiple VCS providers using Nango. The backend handles repository and PR synchronization through BullMQ workers, while AI workers generate intelligent code reviews using LangChain (OpenAI/Gemini). The frontend provides a real-time dashboard showing repositories, pull requests, and AI-generated reviews.',
    architecture: `flowchart TB
  subgraph FE["Frontend (Next.js + React)"]
    F1["Dashboard / Repository view"]
    F2["PR management / AI review UI"]
  end
  API["Express.js API (TypeScript)"]
  subgraph Q["Queues & storage"]
    BQ["BullMQ workers"]
    RQ[("Redis queue")]
    PG[("PostgreSQL")]
  end
  subgraph VCS["VCS integrations (Nango)"]
    V["GitHub / GitLab / Bitbucket"]
  end
  AI["AI: LangChain + OpenAI/Gemini"]
  FE --> API
  API --> BQ
  API --> RQ
  API --> PG
  BQ --> PG
  BQ --> V
  BQ --> AI`,
    impact: [
      'Unified multi-provider VCS management reducing context switching',
      'Automated AI code reviews using LangChain with retry mechanisms for reliability',
      'Background job orchestration enabling responsive user experience via BullMQ workers',
      'Real-time PR synchronization with email notifications on completion',
      'Secure JWT authentication with email verification workflow',
    ],
    features: [
      'Multi-provider VCS Integration (GitHub, GitLab via Nango SDK)',
      'Automatic Repository Synchronization with Change Tracking',
      'Pull Request Aggregation and Management',
      'AI-powered Code Reviews (OpenAI/Gemini)',
      'Real-time Job Monitoring (BullBoard Admin Dashboard)',
      'Background Workers (Email, Repo Sync, PR Sync, AI Review)',
      'JWT Authentication with Email Verification',
      'Password Reset via Email with Token Validation',
      'Email Notifications for Sync Events and Reviews',
      'RESTful API with Route-based Architecture',
      'Database Synchronization with Sequelize ORM',
      'Error Handling and Job Retry Mechanisms',
      'Redis-backed Job Queue Management',
      'Responsive Dashboard UI with React Query',
      'Role-based Access Control (Verified User Access)',
    ],
  },
  {
    title: 'BlockSimulate',
    desc: 'Interactive blockchain simulator featuring wallet management, transaction signing, and real-time visualization of block creation and state transitions.',
    tech: ['Golang', 'Fiber', 'React', 'Docker'],
    highlight: 'Full-stack blockchain system with cryptographic operations + interactive frontend',
    github: 'https://github.com/adarshswaminath/BlockSimulate',
    live: 'https://block-simulate.vercel.app',
    image: '/projects/blocksimulate.png',
    problem:
      'Learning blockchain mechanics and distributed system concepts is challenging without hands-on tools. Most resources are either overly theoretical or lack interactive components for real-time understanding of how blocks are created, validated, and transactions are processed.',
    solution:
      'Built a complete blockchain simulator that combines Go backend (handling actual cryptographic operations and blockchain logic) with a React frontend for interactive visualization. Users can create wallets, sign transactions, and watch the blockchain evolve in real-time with immediate visual feedback.',
    architecture: `flowchart LR
  React["React UI"]
  Fiber["Fiber API<br/>(REST / WebSocket)"]
  Go["Go core engine<br/>(blockchain)"]
  RT["Real-time updates"]
  React <--> Fiber
  Fiber <--> Go
  Fiber --> RT`,
    impact: [
      'Implemented complete blockchain logic with proof-of-work concepts in Go',
      'Cryptographic wallet management with ECDSA key generation and transaction signing',
      'Full CRUD operations for blocks, transactions, and wallet management via REST APIs',
      'Interactive UI enabling users to simulate blockchain operations and visualize state changes in real-time',
      'Deployed live application for accessibility and demonstration',
    ],
    features: [
      'Create and manage multiple wallets with public/private key pairs',
      'Transfer funds between wallets with cryptographic signing',
      'View complete blockchain data and transaction history',
      'Real-time account balance tracking',
      'Block mining and validation simulation',
    ],
  },

  {
    title: 'BlockComplaint',
    desc: 'A blockchain-based complaint registration system enabling secure, transparent, and tamper-proof complaint management with wallet-based authentication.',
    tech: ['JavaScript', 'Blockchain', 'React', 'Smart Contracts'],
    highlight: 'Decentralized complaint management + Wallet-based security',
    github: 'https://github.com/adarshswaminath/Blockcomplaint',
    live: 'https://blockcomplaint.vercel.app/',
    image: '/projects/blockcomplaint.png',
    problem:
      'Traditional complaint registration systems lack transparency and security. Complaints can be modified, lost, or mishandled without accountability. Users have no way to verify complaint status or ensure their data remains immutable.',
    solution:
      'Built a blockchain-based complaint system that leverages distributed ledger technology for immutability and security. Implemented wallet-based authentication ensuring only the complaint registrant can update status. Users can transparently track complaints while personal data remains private.',
    features: [
      'Complaint Registration: Users can register complaints with detailed descriptions, categories, and occurrence dates',
      'Status Management: Users can update complaint status from pending to resolved with complete audit trail',
      'Wallet-Based Authentication: Secure wallet-based login ensuring only registered wallet owners can manage their complaints',
      'Immutable Records: All complaints stored on blockchain ensuring data cannot be tampered with or deleted',
      'Transparent Search: Public complaint search functionality using wallet addresses while protecting personal data privacy',
      'Admin Dashboard: Comprehensive admin panel with four key tabs for complaint management and analytics',
      'Analytics Tracking: View total complaints, last responded complaint ID, and status update history',
      'Admin Response System: Direct response functionality for admins to manage complaints efficiently',
    ],
    architecture: `flowchart TB
  UI["User interface (React)"]
  Auth["Wallet auth & API"]
  SC["Smart contracts"]
  L["Distributed ledger"]
  UI --> Auth --> SC --> L`,
    impact: [
      'Implemented secure wallet-based authentication and authorization',
      'Created immutable complaint records using blockchain technology',
      'Built admin dashboard for complaint management and response tracking',
      'Deployed live application with 4 stars and 5 forks on GitHub',
      'Enabled transparent complaint tracking while maintaining privacy for personal data',
    ],
  },

  {
    title: 'CopySlate',
    desc: 'A web application that allows you to share text instantly across the internet by encoding data directly in URLs, making content accessible from anywhere.',
    tech: ['Next.js', 'JavaScript', 'Tailwind CSS', 'Prisma', 'MongoDB', 'Vercel'],
    highlight: 'URL-based text sharing with real-time data persistence',
    github: 'https://github.com/adarshswaminath/CopySlate',
    live: 'https://copyslate.vercel.app',
    image: '/projects/copyslate.png',
    problem:
      'Sharing text snippets, code, or data quickly without complex setup or account creation is cumbersome. Most solutions require file uploads, account management, or complex sharing workflows.',
    solution:
      'Built CopySlate to enable instant text sharing by embedding data directly in URLs. Users can enter text once, and the URL becomes shareable immediately—no authentication, no file storage complexity. The backend persists data efficiently while the frontend provides a seamless user experience.',
    architecture: `flowchart LR
  UI["Next.js UI"]
  API["API routes"]
  DB[("MongoDB + Prisma")]
  Enc["URL encoder"]
  UI <--> API
  API <--> DB
  API --> Enc`,
    impact: [
      'Instant text sharing without authentication or account creation',
      'URL-based data persistence enabling seamless shareability',
      'Full-stack implementation from database to deployment',
      'Real-world optimization of user experience for quick sharing workflows',
    ],
    features: [
      'Instant text-to-URL conversion',
      'URL-based data retrieval and sharing',
      'Clean, responsive UI with Tailwind CSS',
      'Database persistence with MongoDB and Prisma',
      'Deployed on Vercel for production reliability',
      'Shareable links that work across devices',
      'No account signup required for basic usage',
    ],
  },
  {
    title: 'Blog2Buzz',
    desc: 'An AI-powered content aggregation platform that scrapes the latest tech blogs and provides intelligent summaries and social media posts.',
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'Gemini AI', 'Web Scraping'],
    highlight: 'AI-powered content aggregation + web scraping',
    github: 'https://github.com/adarshswaminath/blog2buzz',
    live: 'https://blog2buzz.vercel.app',
    image: '/projects/blog2buzz.png',
    problem:
      'Tech professionals struggle to stay updated with the latest industry trends across multiple platforms. Reading and summarizing blog posts from various sources is time-consuming, and creating engaging social media content requires additional effort.',
    solution:
      'Built Blog2Buzz, an intelligent content aggregation platform that automatically scrapes dev.to blogs, leverages Gemini AI to generate concise summaries, and creates ready-to-share social media posts. Users get curated, digestible tech insights without the manual effort.',
    architecture: `flowchart TB
  Next["Next.js server"]
  Scraper["Web scraper (Cheerio)"]
  Dev["dev.to source"]
  Gem["Gemini AI"]
  SB[("Supabase<br/>DB + auth")]
  Next --> Scraper --> Dev
  Scraper --> Gem
  Next --> SB
  Gem --> SB`,
    impact: [
      'Automated extraction of latest tech blogs from dev.to using web scraping',
      'AI-powered content summarization reducing read time by 80%',
      'Auto-generated social media posts saving creators hours of content creation',
      'Real-time analytics tracking with PostHog',
      'Deployed on Vercel with 11+ GitHub stars',
      'Seamless user authentication with Supabase',
    ],
    features: [
      'Web scraping of dev.to blogs with Cheerio and Axios',
      'AI-powered content summarization using Google Gemini',
      'Automatic social media post generation',
      'User authentication and profile management (Supabase)',
      'Real-time analytics with PostHog',
      'Responsive UI with Tailwind CSS and DaisyUI components',
      'Smooth animations with Framer Motion and Lottie',
      'Markdown rendering for formatted content',
      'Browser-based web automation with Puppeteer',
      'Environment-based configuration management',
    ],
  },
];
