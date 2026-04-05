import type { MarkdownInstance } from 'astro'

// Types shared across data modules and components

export interface BlogPost {
  title: string
  date: string
  description: string
  category?: string
  author?: string
  layout?: string
}

export type MarkdownPost = MarkdownInstance<BlogPost>

export interface Project {
  title: string
  desc: string
  tech: string[]
  highlight: string
  github?: string
  image?: string
  problem?: string
  solution?: string
  architecture?: string
  impact?: string[]
  features?: string[]
}

export interface Experience {
  role: string
  company: string
  duration: string
  contributions: string[]
}
