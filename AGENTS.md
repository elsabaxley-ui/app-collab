# BerryBox × Recess Arcade (`app-collab`) — Shared Agent Instructions

Welcome! This repository is a collaborative multiplayer mini-game arcade built by **Elsa** and **Byron** using Antigravity.

## 🎯 Aesthetic & Vision
- **BerryBox Aesthetic**: Ultra-clean white background (`#ffffff`) with shifting blue accents (`#1d6ff2`, `#38bdf8`), bold `2.5px`–`3px` black outlines (`#0a0f1d`), hard shadows (`3.5px 3.5px 0px #0a0f1d`), Square Blueberry logo, and `Fredoka` + `Plus Jakarta Sans` typography.
- **48 Cute Chubby Characters & Coin Economy**:
  - Defined in `js/characters.js` (`CHARACTERS` array + `drawChubbyCharacter(ctx, x, y, r, charObj, opts)`).
  - Players start with `#1 Lil Blueberry` unlocked and earn 🪙 Coins in-game to unlock the other 47 characters (150 to 10,000 Coins) in the Character Shop (`#shopScreen`).
  - Every mini-game renders the players' chosen Chubby Characters on the canvas and runs on a hardware-independent **60.0 FPS fixed-timestep loop** (`STEP_MS = 1000 / 60`).

## ⌨️ Standard 4-Player Local Keybinds
All 4-player games in this repo support these consistent 1-keyboard controls:
- **Player 1:** `W` (Jump/Up), `A` (Left), `D` (Right)
- **Player 2:** `T` (Jump/Up), `F` (Left), `H` (Right)
- **Player 3:** `I` (Jump/Up), `J` (Left), `L` (Right)
- **Player 4:** `ArrowUp` (Jump/Up), `ArrowLeft` (Left), `ArrowRight` (Right)

## 📁 Architecture & File Layout
- `index.html` — Main Arcade Hub, Super Tag Lobby, Tag Arena, 48-Character Coin Shop, and Account Switcher.
- `css/styles.css` — BerryBox white + shifting blue styling with bold `#0a0f1d` outlines.
- `js/characters.js` — 48 Cute Chubby Characters data and procedural canvas renderer (`drawChubbyCharacter`).
- `js/main.js` — Screen router, lobby character picker, 48-Character Coin Shop, and local account state.
- `js/audio.js` — Procedural Web Audio API sound effects.
- `js/games/tag/tagGame.js` — **Super Tag Arena** engine (60 FPS fixed-timestep physics, double-jump, portals, jump pads, AI bots, Chubby Character rendering, and Coin rewards).
- `js/games/tag/maps.js` — Modular map definitions (`TAG_MAPS`).
- `CHAT.md` — AI-to-AI & sibling coordination log.

## 🤝 Collaboration Rules for Elsa & Byron's Agents
1. **Pull before pushing:** Always run `git pull --rebase origin main` before pushing changes.
2. **Modular additions:**
   - Adding a new Tag map? Append it to `TAG_MAPS` in `js/games/tag/maps.js`.
   - Adding a new mini-game? Create a new folder under `js/games/<game-name>/`, render players with `drawChubbyCharacter` from `js/characters.js`, and wire it up in `index.html` + `js/main.js`.
3. **Update `CHAT.md`:** Whenever you push a major feature, leave a quick note in `CHAT.md` so the other AI knows what changed!
