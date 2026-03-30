# 🚀 Stacks Memer – Master Documentation (Single Source of Truth)

## Table of Contents
1. [Technical Architecture & Audit (The Build)](#1-technical-architecture--audit-the-build)
2. [Product Strategy & Feature Set (The Value)](#2-product-strategy--feature-set-the-value)
3. [The 'Memer' Logic & Brand (The Content)](#3-the-memer-logic--brand-the-content)
4. [Operations & Onboarding (The Team)](#4-operations--onboarding-the-team)

---

## 1. Technical Architecture & Audit (The Build)

### 1.1 Tech Stack Overview
- **Frontend & App Framework:** Next.js (App Router), React 19, tailwindcss 4.
- **Styling & UI:** Tailwind CSS, Lucide React icons, embedded charts using `lightweight-charts`.
- **Backend & Database:** Supabase (`@supabase/supabase-js`) for off-chain storage of tokens and ecosystem campaigns.
- **Blockchain Integration (Stacks/Clarity):** 
  - **Wallet Auth & Transactions:** `@stacks/connect` and `@stacks/network` for mainnet interactions.
  - **Data Providers:** Hiro API (for Stacks metadata, balances, and block information) and Velar API (for real-world token market data/prices).

### 1.2 System Data Flow
1. **User Request (Discovery):** A user navigates to `/discover`. The frontend triggers the `useTokens` hook, which queries `/api/tokens`. This API aggregates real-time DEX liquidity and token data from the Velar API and serves it to the UI.
2. **User Request (Submit):** A user navigates to `/submit` to add a new token or campaign. 
3. **Wallet Authentication:** The user clicks "Connect Wallet", invoking `@stacks/connect` via `WalletContext.tsx`. The app securely binds their Stacks Mainnet address (`SP...`) to their session.
4. **On-Chain vs Off-Chain Storage:** When a token or campaign is submitted, it is written to the Supabase PostgreSQL database (`tokens` or `campaigns` table), mapping the contract address to the creator's Stacks address. Transactions and token swaps happen on-chain (tracked via Hiro API).

### 1.3 Technical Debt Audit
- **Missing API Documentation:** Internal API routes like `/api/activity` and `/api/tokens` lack OpenAPI/Swagger documentation, making frontend-backend decoupled work difficult.
- **Supabase Fallback:** The app allows running without active Supabase environment variables `NEXT_PUBLIC_SUPABASE_URL` throwing only a `console.warn`. This can lead to silent local development failures when testing token submissions.
- **SSR Hydration Risks:** `@stacks/connect` references the `window` object at the module level. Current prevention uses dynamic imports (`await import('@stacks/connect')`), but direct imports in sub-components might trigger Next.js SSR crashes.
- **Scalability Concerns:** Real-time polling is set to 30 seconds (`setInterval` in `useTokens.ts` and `WalletContext.tsx`). As the user base grows, this client-heavy polling could hit API rate limits or eat client CPU. Sockets or server-side caching (Redis) is recommended.

---

## 2. Product Strategy & Feature Set (The Value)

### 2.1 Core Value Proposition
Stacks Memer is the premier discovery and launchpad hub for meme coins on the Stacks blockchain. It solves the fragmentation of the Bitcoin ecosystem by providing a single, trustworthy, community-curated dashboard to discover "the next 100x gem", track live statistics, and securely list new tokens tied cryptographically to builder wallets.

### 2.2 Functional Feature Matrix

| Feature | Status | Primary User Benefit |
| :--- | :--- | :--- |
| **Wallet Connection** | 🟢 Live | Secure session handling via Stacks Mainnet wallets. |
| **Token Discovery Hub** | 🟢 Live | Real-time tracking of token prices, 24h changes, and market cap via Velar DEX. |
| **Activity Feed** | 🟢 Live | Stream of recent network buys/sells/contract calls via Hiro API. |
| **Token Submission** | 🟢 Live | Creators can list their Stacks tokens to gain immediate community visibility. |
| **Campaign Generation** | 🟡 Beta | Goal-driven fundraising and ecosystem marketing tied to wallets. |
| **Community Leaderboard** | 🔴 In-Progress | Enable upvoting to organically sort tokens by community trust. |

### 2.3 User Personas
1. **The "Degen" Trader:** Looking for early alpha. Needs real-time token discovery, charts, and quick copy-paste access to Stacks contract addresses to snipe tokens.
2. **The Community Builder / Creator:** Launching a new meme coin. Needs a platform to verify their token launch, build social proof, and run visibility campaigns.

---

## 3. The 'Memer' Logic & Brand (The Content)

### 3.1 Algorithm & Logic Documentation
- **Discovery Sorting:** Tokens fetched from Velar API are filtered to only display assets with active liquidity/price > 0.
- **Activity Parsing:** The app consumes raw blockchain JSON from Hiro API (`txToActivity` in `api.ts`), reading burn blocks and SIP-010 token transfers to classify transactions intelligently as a "buy", "sell", or "wallet" movement based on token inflow/outflow logic.
- **Cryptographic Tying:** To prevent database spam, token lists and campaigns require cryptographic authentication string matching. Submissions are hardcoded to the connected `address` state in `WalletContext`.

### 3.2 Brand Voice & UI Guidelines
- **Vibe:** "Premium Web3 Arcade". It mixes high-end fintech aesthetics (glassmorphism, dark themes) with "degen" crypto culture.
- **Color Palette:** Dark-mode native (`className="dark"`). Uses deep blacks (`#131316`), vibrant accents (Neon Pink/Fuchsia `#ec4899`, Electric Green `#22d3a4`), and subtle borders to keep it readable but energetic.
- **Typography:** Uses Vercel's `Geist` and `Geist Mono` for extreme legibility, looking highly technical and futuristic.
- **Animations:** Heavy use of pulse indicators (Live Activity), hover scale effects (`hover:scale-105`), and loader spinners to make the interface feel "alive".

---

## 4. Operations & Onboarding (The Team)

### 4.1 Local Setup
1. **Clone & Install:**
   ```bash
   git clone <repo_url>
   cd stacks-memer-v1
   npm install
   ```
2. **Environment Variables:**
   Create a `.env.local` file based on the required keys for Supabase & Hiro:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   HIRO_API_URL=https://api.hiro.so
   ```
3. **Run Development Server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4.2 Maintenance & FAQ
- **Q: Why does the wallet connection crash on hard refresh?**
  *A:* SSR mismatches. Ensure you are accessing `showConnect` exclusively on the client side inside an effect or user event, using the dynamic import wrapper in `WalletContext`.
- **Q: Tokens are not showing up in the Discover tab?**
  *A:* The application relies on the Velar DEX API (`https://api.velar.co/tokens`). If the API goes down or changes schema, the fallback array may render empty. Check network logs for `fetchVelarTokens` failures.
- **Q: How do we update token supply logic?**
  *A:* Navigate to `src/lib/api.ts` -> `fetchVelarTokens()`. Total supply routing may need Hiro API cross-referencing since Velar primarily provides circulating liquidity metrics.
