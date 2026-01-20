# SMM Content Factory (OpenRouter Edition)

Professional SMM training content generator powered by AI. Converts theory into client-ready lessons for Azerbaijan market.

## Features

- Batch processing of 48+ chapters
- Multiple AI models (Gemini 3 Pro, Flash, 2.5 Pro)
- Advanced thinking mode for high-quality content
- Real-time processing queue
- Customizable system prompts
- Export functionality

## Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Get your OpenRouter API key at: https://openrouter.ai/keys
   - Add to `.env.local`:
     ```
     VITE_OPENROUTER_API_KEY=your_key_here
     ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lenkomade-max/smmm-gemini-spc)

1. Click the Deploy button above
2. Connect your GitHub account
3. Add environment variable: `VITE_OPENROUTER_API_KEY`
4. Deploy!

## Tech Stack

- React 19 + TypeScript
- Vite
- OpenRouter API
- Tailwind CSS
