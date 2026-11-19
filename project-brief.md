Battleground — Project Brief

## 1. What are we actually building? (Scope)
A web app where you type in two fighters and get an AI generated verdict on who'd win, plus AI generated character art for both.

## 2. What's the smallest, simplest version worth shipping (MVP)?
Two text inputs, a Fight button, a working verdict with art, a loading state while we wait on the API, and a basic BattleDex saved to localStorage. Type two fighters, get a real result, and choose which fighters to save to the BattleDex.

## 3. What are we building this with (tech stack)?
HTML, CSS, and React (JavaScript, set up with Vite) for the frontend. Vercel for hosting and serverless functions. Claude's API for the verdict. OpenAI's image API for the character art. localStorage for saving BattleDex.

## 4. What's the long-term vision, beyond just the MVP?
I would eventually like a real backend where BattleDex characters sync across devices instead of just living in localStorage. I'd also want a quick re-fight option using characters already saved in the BattleDex, instead of typing two new ones every time.

This is a personal project for now, but it's intended to become a portfolio project, which will require logins, rate limiting, and cost controls (and therefore a real backend).

## 5. Build phases
1. **Front-end with mock APIs (current phase).** The full app runs in the browser with mock verdicts and mock images behind a small API layer. No API accounts or keys are needed yet.
2. **Real APIs.** Vercel serverless functions call Claude (verdict) and OpenAI (images); the mock layer is switched off.
3. **Backend.** Logins, rate limiting, cost controls, and BattleDex sync across devices.
4. **Re-fight** using characters already in the BattleDex.

## 6. Key decisions

### Input rules
- Fighter names must be **3–20 characters** (after trimming spaces).
- A fighter **cannot fight itself**. Names are compared case-insensitively, so "Goku" vs "goku" is not allowed.

### BattleDex
- The BattleDex stores **fighters only**. Fights and verdicts are never saved.
- Fighters are saved **individually, by choice**: after a fight, each fighter has its own **Save to BattleDex** button. Fighters already saved show as **Saved**.
- A saved fighter reuses its image in future fights, so it never needs a new one. Unsaved fighters get a new image every time they fight.
- A fighter whose image was refused can still be saved with placeholder art.
- Character names are matched **case-insensitively** ("Goku" = "goku"). A saved character can have its image **regenerated** on request.
- Characters can be **deleted** from the BattleDex.
- Group fighters count as one character with one image (e.g. "10 cows" is a single character).

### Verdict
- The same two fighters can produce **different outcomes** each time. Verdicts are never cached; every fight is a new Claude call.
- The result is shown as a **winner card** with **both fighters' images**, the **winner highlighted**, and the reasoning for the win.
- The card is revealed with a **slide-in followed by a card flip** animation.
- Claude returns structured JSON (e.g. `winner`, `reasoning`) so the card is easy to render.

### Art
- **One image per fighter**, two images per fight at most (zero if both fighters are already saved in the BattleDex).
- All images share **one consistent art style**, set by a fixed style prompt. Style: **trading card art**. This also fits the winner card, which can be designed as a trading card.
- Images are generated from whatever the user types. If the image API refuses, a **styled placeholder** is shown instead.

### Technical notes
- OpenAI image URLs expire and base64 images are large, so every image is **downsized and compressed** (portrait ~300×420, WebP with JPEG fallback) when its fighter is saved to localStorage. At roughly 20–40KB each, the BattleDex can hold 100+ characters.
- Keep BattleDex access behind a small storage layer (e.g. `saveCharacter`, `getCharacters`, `findCharacter`, `deleteCharacter`) so localStorage can later be swapped for a real backend.
- Keep API calls behind a small API layer so mock verdicts/images can be swapped for real ones without touching the UI.
- Rate limit: **2 fights per minute per IP**. A fight counts as one request, no matter how many API calls it makes (verdict + up to 2 images). Enforced server-side, so it ships with the backend work.
- Set spending caps on both the Anthropic and OpenAI accounts from day one.
