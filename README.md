Author · Devon Wilkins
Aspiring SOC Analyst · Blue Team Enthusiast · Cybersecurity Learner


# 🛡️ PhishGuard — Suspicious Email Triage Tool

PhishGuard is a Blue Team–focused web app that helps analysts quickly triage suspicious emails.  
Built with **React + Tailwind CSS (v4)**, it provides a clean interface to paste raw email headers and body content, and instantly see key indicators.

---

## ✨ Current Features
- Paste raw **SMTP headers** and email body
- Responsive, dark-themed UI built with TailwindCSS
- Automatic extraction of URLs from the message body
- Quick indicators:
  - SPF / DKIM / DMARC results
  - From vs Return-Path mismatch
- Risk score (0–100) with colored progress bar
- Copy-to-clipboard analyst summary
- Reset button to clear inputs

---

## 🚀 Getting Started

Clone and run locally:

```bash
git clone https://github.com/devonwlkns86/phishguard.git
cd phishguard
npm install
npm run dev
