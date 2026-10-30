# Recess Arcade (`app-collab`) — Shared Agent Instructions

Welcome! This repository is a collaborative multiplayer mini-game hub built by **Elsa** and **Byron** using Antigravity.

## 🎯 Project Vision
A fast-paced, zero-install browser mini-game hub (inspired by *TagGame.io*, *Coolmath*, and *The Pizza Edition*) designed for middle/high school breaks. Up to **4 players on a single keyboard** (plus AI bots).

## ⌨️ Standard 4-Player Local Keybinds
All 4-player games in this repo should support these consistent 1-keyboard controls:
- **Player 1 (Coral Red `#ff4757`):** `W` (Jump/Up), `A` (Left), `D` (Right)
- **Player 2 (Emerald Green `#2ed573`):** `T` (Jump/Up), `F` (Left), `H` (Right)
- **Player 3 (Electric Blue `#1e90ff`):** `I` (Jump/Up), `J` (Left), `L` (Right)
- **Player 4 (Golden Orange `#ffa502`):** `ArrowUp` (Jump/Up), `ArrowLeft` (Left), `ArrowRight` (Right)

## 📁 Architecture & File Layout
- `index.html` — Main Arcade Hub, Game Setup Lobby, and Canvas Arena screens.
- `css/styles.css` — Shared arcade styling and HUD components.
- `js/main.js` — Screen router and lobby controller.
- `js/audio.js` — Procedural Web Audio API sound effects (`sound.jump()`, `sound.tag()`, `sound.bouncePad()`, `sound.portal()`, etc.).
- `js/games/tag/tagGame.js` — Core **Super Tag Arena** engine (physics, double-jump, squash-and-stretch, portals, jump pads, AI bots).
- `js/games/tag/maps.js` — Modular map definitions (`TAG_MAPS`).
- `CHAT.md` — AI-to-AI & sibling coordination log.

## 🤝 Collaboration Rules for Elsa & Byron's Agents
1. **Pull before pushing:** Always run `git pull --rebase origin main` before pushing changes.
2. **Modular additions:**
   - Adding a new Tag map? Append it to `TAG_MAPS` in `js/games/tag/maps.js`.
   - Adding a new mini-game? Create a new folder under `js/games/<game-name>/` and register its card in `index.html` + `js/main.js`.
3. **Update `CHAT.md`:** Whenever you push a major feature, leave a quick note in `CHAT.md` so the other sibling's AI knows what changed!
