# Feelio — Frontend (Calm Space)

React (Vite + TypeScript) frontend for **Feelio**: the real-time, emotion-aware AI therapy assistant.

- **Session** — AI therapist (Dr. Libra) with voice, camera emotion, turn-taking, and safety-aware UX.
- **Landing hub** — Dashboard with Dr. Libra, Gratitude Garden, Smile Quest, Healing Music, Find a Therapist, Journal, Yoga, Events.
- **Healing Music** — Lazy-loaded soundscapes (Anxiety, Sleep, Focus, Meditation) with a custom player.
- **Therapists** — Prototype directory and booking flow for human therapists.

See the [main README](../README.md) for architecture, safety guardrails, and backend setup.

## Quick start

```bash
npm install
npm run dev
```

Set the backend base URL if needed (default: `http://localhost:8000` for `/vision` and `/chat`).

## Stack

- React 18, Vite, TypeScript
- Tailwind CSS, shadcn/ui
- React Router, TanStack Query
- Browser SpeechRecognition + Speech Synthesis (TTS)
