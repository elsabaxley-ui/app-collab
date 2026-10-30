import { TAG_MAPS } from './maps.js';
import { sound } from '../../audio.js';
import { getCharacterById, drawChubbyCharacter } from '../../characters.js';

export const PLAYER_CONFIGS = [
  {
    id: 0,
    name: 'Player 1',
    shortName: 'P1',
    color: '#1d6ff2',
    glow: 'rgba(29, 111, 242, 0.5)',
    defaultCharId: 'c1',
    keys: { up: 'KeyW', left: 'KeyA', right: 'KeyD' },
    keyLabels: { up: 'W', left: 'A', right: 'D' },
    defaultMode: 'human'
  },
  {
    id: 1,
    name: 'Player 2',
    shortName: 'P2',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.5)',
    defaultCharId: 'c2',
    keys: { up: 'KeyT', left: 'KeyF', right: 'KeyH' },
    keyLabels: { up: 'T', left: 'F', right: 'H' },
    defaultMode: 'human'
  },
  {
    id: 2,
    name: 'Player 3',
    shortName: 'P3',
    color: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.5)',
    defaultCharId: 'c3',
    keys: { up: 'KeyI', left: 'KeyJ', right: 'KeyL' },
    keyLabels: { up: 'I', left: 'J', right: 'L' },
    defaultMode: 'human'
  },
  {
    id: 3,
    name: 'Player 4',
    shortName: 'P4',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.5)',
    defaultCharId: 'c4',
    keys: { up: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' },
    keyLabels: { up: '↑', left: '←', right: '→' },
    defaultMode: 'human'
  }
];

export class TagGame {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.onCoinsEarned = options.onCoinsEarned || (() => {});

    // Lobby Settings
    this.playerModes = PLAYER_CONFIGS.map(p => p.defaultMode); // 'human' | 'bot' | 'off'
    this.playerCharIds = PLAYER_CONFIGS.map(p => p.defaultCharId);
    this.selectedMapId = TAG_MAPS[0].id;
    this.roundDuration = 60;
    this.winsNeeded = 3;

    // Runtime state
    this.running = false;
    this.roundOver = false;
    this.matchOver = false;
    this.players = [];
    this.scores = [0, 0, 0, 0];
    this.particles = [];
    this.floatingTexts = [];
    this.powerup = null;
    this.powerupTimer = 0;

    this.timeRemaining = 60;
    this.lastSecondTick = 60;
    this.tagImmunityTimer = 0;
    this.screenShake = 0;
    this.portalAngle = 0;
    this.decorClouds = this.createDecor();

    this.keysDown = new Set();
    this.keysJustPressed = new Set();
    this.animFrame = null;
    this.lastTimestamp = 0;

    this.bindEvents();
  }

  createDecor() {
    const items = [];
    for (let i = 0; i < 14; i++) {
      items.push({
        x: Math.random() * 1280,
        y: 50 + Math.random() * 480,
        r: 22 + Math.random() * 36,
        speed: 0.15 + Math.random() * 0.35
      });
    }
    return items;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        if (this.running) e.preventDefault();
      }
      if (!this.keysDown.has(e.code)) {
        this.keysJustPressed.add(e.code);
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });
  }

  get currentMap() {
    return TAG_MAPS.find(m => m.id === this.selectedMapId) || TAG_MAPS[0];
  }

  startNewMatch() {
    this.scores = [0, 0, 0, 0];
    this.matchOver = false;
    this.startRound();
  }

  startRound() {
    const map = this.currentMap;
    this.roundOver = false;
    this.running = true;
    this.timeRemaining = this.roundDuration;
    this.lastSecondTick = Math.ceil(this.roundDuration);
    this.tagImmunityTimer = 1.2;
    this.particles = [];
    this.floatingTexts = [];
    this.powerup = null;
    this.powerupTimer = 5;

    document.getElementById('roundOverlay').classList.add('hidden');
    document.getElementById('hudMapName').textContent = map.name.toUpperCase();

    // Build active players
    this.players = [];
    PLAYER_CONFIGS.forEach((cfg, idx) => {
      const mode = this.playerModes[idx];
      if (mode === 'off') return;
      const spawn = map.spawns[idx % map.spawns.length];
      const charObj = getCharacterById(this.playerCharIds[idx] || cfg.defaultCharId);
      this.players.push({
        id: cfg.id,
        name: cfg.name,
        shortName: cfg.shortName,
        color: charObj.bodyColor || cfg.color,
        glow: cfg.glow,
        charObj,
        keys: cfg.keys,
        keyLabels: cfg.keyLabels,
        mode,
        x: spawn.x,
        y: spawn.y,
        w: 38,
        h: 38,
        vx: 0,
        vy: 0,
        onGround: false,
        jumpsLeft: 2,
        isIt: false,
        scaleX: 1,
        scaleY: 1,
        facing: idx % 2 === 0 ? 1 : -1,
        portalCooldown: 0,
        speedBoostTimer: 0,
        trailTimer: 0,
        botJumpTimer: 0
      });
    });

    // Ensure at least 2 players exist (if user turned 3 off, auto-enable a Bot)
    if (this.players.length < 2) {
      const fallbackCfg = PLAYER_CONFIGS.find(c => !this.players.some(p => p.id === c.id));
      const spawn = map.spawns[1];
      const charObj = getCharacterById(this.playerCharIds[fallbackCfg.id] || fallbackCfg.defaultCharId);
      this.players.push({
        id: fallbackCfg.id,
        name: fallbackCfg.name,
        shortName: fallbackCfg.shortName,
        color: charObj.bodyColor || fallbackCfg.color,
        glow: fallbackCfg.glow,
        charObj,
        keys: fallbackCfg.keys,
        keyLabels: fallbackCfg.keyLabels,
        mode: 'bot',
        x: spawn.x,
        y: spawn.y,
        w: 38,
        h: 38,
        vx: 0,
        vy: 0,
        onGround: false,
        jumpsLeft: 2,
        isIt: false,
        scaleX: 1,
        scaleY: 1,
        facing: -1,
        portalCooldown: 0,
        speedBoostTimer: 0,
        trailTimer: 0,
        botJumpTimer: 0
      });
    }

    // Pick random initial "IT" player
    const randomIt = this.players[Math.floor(Math.random() * this.players.length)];
    randomIt.isIt = true;

    this.spawnFloatingText(randomIt.x, randomIt.y - 30, `${randomIt.shortName} IS IT!`, '#ff4757');
    this.updateHUD();
    this.renderControlsFooter();

    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.lastTimestamp = performance.now();
    this.accumulator = 0;
    this.loop(this.lastTimestamp);
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  loop(timestamp) {
    if (!this.running) return;
    const STEP_MS = 1000 / 60; // Hardware-independent 60.0 FPS fixed timestep
    const FIXED_DT = 1 / 60;
    const deltaMs = Math.min(100, timestamp - this.lastTimestamp);
    this.lastTimestamp = timestamp;
    this.accumulator = (this.accumulator || 0) + deltaMs;

    while (this.accumulator >= STEP_MS) {
      this.update(FIXED_DT);
      this.keysJustPressed.clear();
      this.accumulator -= STEP_MS;
    }

    this.draw();
    this.animFrame = requestAnimationFrame((ts) => this.loop(ts));
  }

  update(dt) {
    if (this.roundOver) return;

    const map = this.currentMap;
    this.portalAngle += dt * 3.5;

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    if (this.tagImmunityTimer > 0) {
      this.tagImmunityTimer = Math.max(0, this.tagImmunityTimer - dt);
    }

    // Countdown timer
    this.timeRemaining = Math.max(0, this.timeRemaining - dt);
    const ceilSec = Math.ceil(this.timeRemaining);
    if (ceilSec !== this.lastSecondTick && ceilSec > 0) {
      this.lastSecondTick = ceilSec;
      if (ceilSec <= 10) {
        sound.tick(ceilSec <= 5);
      }
      this.updateHUDTimer();
    }

    if (this.timeRemaining <= 0) {
      this.finishRound();
      return;
    }

    // Power-up spawner (Speed Lightning Orb)
    if (!this.powerup) {
      this.powerupTimer -= dt;
      if (this.powerupTimer <= 0) {
        const plat = map.platforms[1 + Math.floor(Math.random() * (map.platforms.length - 1))];
        this.powerup = {
          x: plat.x + plat.w / 2,
          y: plat.y - 26,
          r: 14,
          bob: 0
        };
      }
    } else {
      this.powerup.bob += dt * 5;
    }

    // Update each player
    for (const p of this.players) {
      if (p.portalCooldown > 0) p.portalCooldown -= dt;
      if (p.speedBoostTimer > 0) p.speedBoostTimer -= dt;

      let moveLeft = false;
      let moveRight = false;
      let wantJump = false;

      if (p.mode === 'human') {
        moveLeft = this.keysDown.has(p.keys.left);
        moveRight = this.keysDown.has(p.keys.right);
        wantJump = this.keysJustPressed.has(p.keys.up);
      } else if (p.mode === 'bot') {
        const botInput = this.computeBotInput(p, dt);
        moveLeft = botInput.left;
        moveRight = botInput.right;
        wantJump = botInput.jump;
      }

      // Slightly higher top speed for "IT" so chases are thrilling!
      let maxSpeed = p.isIt ? 6.95 : 6.45;
      if (p.speedBoostTimer > 0) maxSpeed *= 1.28;

      const accel = p.onGround ? 1.15 : 0.72;

      if (moveLeft) {
        p.vx = Math.max(p.vx - accel, -maxSpeed);
        p.facing = -1;
      } else if (moveRight) {
        p.vx = Math.min(p.vx + accel, maxSpeed);
        p.facing = 1;
      } else {
        p.vx *= p.onGround ? map.friction : 0.94;
        if (Math.abs(p.vx) < 0.08) p.vx = 0;
      }

      // Jump & Double Jump
      if (wantJump && p.jumpsLeft > 0) {
        const isDouble = !p.onGround && p.jumpsLeft === 1;
        p.vy = isDouble ? -12.6 : -13.8;
        p.onGround = false;
        p.jumpsLeft--;
        p.scaleX = 0.76;
        p.scaleY = 1.28;
        sound.jump(isDouble);
        this.spawnBurst(p.x + p.w / 2, p.y + p.h, isDouble ? '#f8fafc' : p.color, 7);
      }

      // Gravity
      p.vy = Math.min(p.vy + 0.62, 16.5);

      // Move X & keep within arena bounds
      p.x += p.vx;
      if (p.x < 18) {
        p.x = 18;
        p.vx = 0;
      } else if (p.x + p.w > this.width - 18) {
        p.x = this.width - 18 - p.w;
        p.vx = 0;
      }

      // Move Y & Platform Collisions (one-way top landing)
      const prevBottom = p.y + p.h;
      p.y += p.vy;
      p.onGround = false;

      if (p.vy >= 0) {
        for (const plat of map.platforms) {
          const withinX = p.x + p.w - 6 > plat.x && p.x + 6 < plat.x + plat.w;
          const crossedTop = prevBottom <= plat.y + 10 && p.y + p.h >= plat.y;
          if (withinX && crossedTop) {
            if (p.vy > 4) {
              p.scaleX = 1.24;
              p.scaleY = 0.78;
            }
            p.y = plat.y - p.h;
            p.vy = 0;
            p.onGround = true;
            p.jumpsLeft = 2;
            break;
          }
        }
      }

      // Safety floor wrap if someone falls below screen
      if (p.y > this.height + 40) {
        p.y = 100;
        p.vy = 0;
      }

      // Jump Pads
      for (const pad of map.jumpPads) {
        const overlap =
          p.x + p.w > pad.x &&
          p.x < pad.x + pad.w &&
          p.y + p.h >= pad.y - 4 &&
          p.y + p.h <= pad.y + pad.h + 14;
        if (overlap && p.vy >= -2) {
          p.vy = pad.vy;
          p.onGround = false;
          p.jumpsLeft = 1;
          p.scaleX = 0.68;
          p.scaleY = 1.38;
          pad.pulse = 1;
          sound.bouncePad();
          this.spawnBurst(pad.x + pad.w / 2, pad.y, '#facc15', 14);
        }
      }

      // Portals
      if (p.portalCooldown <= 0 && map.portals) {
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        for (const pair of map.portals) {
          const distA = Math.hypot(cx - pair.a.x, cy - pair.a.y);
          const distB = Math.hypot(cx - pair.b.x, cy - pair.b.y);
          if (distA < 32) {
            p.x = pair.b.x - p.w / 2;
            p.y = pair.b.y - p.h / 2;
            p.portalCooldown = 1.1;
            sound.portal();
            this.spawnBurst(pair.a.x, pair.a.y, pair.a.color, 12);
            this.spawnBurst(pair.b.x, pair.b.y, pair.b.color, 16);
            break;
          } else if (distB < 32) {
            p.x = pair.a.x - p.w / 2;
            p.y = pair.a.y - p.h / 2;
            p.portalCooldown = 1.1;
            sound.portal();
            this.spawnBurst(pair.b.x, pair.b.y, pair.b.color, 12);
            this.spawnBurst(pair.a.x, pair.a.y, pair.a.color, 16);
            break;
          }
        }
      }

      // Power-up pickup
      if (this.powerup) {
        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        if (Math.hypot(cx - this.powerup.x, cy - this.powerup.y) < 32) {
          p.speedBoostTimer = 5.0;
          sound.powerup();
          this.spawnBurst(this.powerup.x, this.powerup.y, '#facc15', 18);
          this.spawnFloatingText(p.x + p.w / 2, p.y - 16, '⚡ SPEED BOOST!', '#facc15');
          this.powerup = null;
          this.powerupTimer = 11;
        }
      }

      // Squash & stretch recovery
      p.scaleX += (1 - p.scaleX) * 0.22;
      p.scaleY += (1 - p.scaleY) * 0.22;

      // Speed trail particles
      p.trailTimer -= dt;
      if ((p.isIt || p.speedBoostTimer > 0) && p.trailTimer <= 0 && (Math.abs(p.vx) > 2 || Math.abs(p.vy) > 2)) {
        p.trailTimer = 0.045;
        this.particles.push({
          x: p.x + p.w / 2,
          y: p.y + p.h / 2,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          r: 5 + Math.random() * 4,
          color: p.speedBoostTimer > 0 ? '#facc15' : '#ff4757',
          alpha: 0.65,
          decay: 2.2
        });
      }
    }

    // Check Tag Collision between "IT" and runners
    if (this.tagImmunityTimer <= 0) {
      const itPlayer = this.players.find(p => p.isIt);
      if (itPlayer) {
        for (const other of this.players) {
          if (other.id === itPlayer.id) continue;
          const overlap =
            Math.abs((itPlayer.x + itPlayer.w / 2) - (other.x + other.w / 2)) < 34 &&
            Math.abs((itPlayer.y + itPlayer.h / 2) - (other.y + other.h / 2)) < 34;

          if (overlap) {
            itPlayer.isIt = false;
            other.isIt = true;
            this.tagImmunityTimer = 1.25;
            this.screenShake = 9;

            // Knockback & squash
            const dir = other.x >= itPlayer.x ? 1 : -1;
            other.vx = dir * 8.5;
            other.vy = -7.5;
            other.scaleX = 1.35;
            other.scaleY = 0.68;

            sound.tag();
            this.spawnBurst(other.x + other.w / 2, other.y + other.h / 2, '#ff4757', 26);
            this.spawnFloatingText(other.x + other.w / 2, other.y - 24, `${other.shortName} TAGGED!`, '#ff4757');
            this.updateHUD();
            break;
          }
        }
      }
    }

    // Update particles & floating text
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= pt.decay * dt;
      if (pt.alpha <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 38 * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  computeBotInput(bot, dt) {
    bot.botJumpTimer -= dt;
    const itPlayer = this.players.find(p => p.isIt);
    if (!itPlayer) return { left: false, right: false, jump: false };

    let left = false;
    let right = false;
    let jump = false;

    if (bot.isIt) {
      // Chase closest runner
      let closest = null;
      let bestDist = Infinity;
      for (const other of this.players) {
        if (other.id === bot.id) continue;
        const d = Math.hypot(other.x - bot.x, other.y - bot.y);
        if (d < bestDist) {
          bestDist = d;
          closest = other;
        }
      }
      if (closest) {
        if (closest.x < bot.x - 10) left = true;
        else if (closest.x > bot.x + 10) right = true;

        if (closest.y < bot.y - 45 && bot.botJumpTimer <= 0) {
          jump = true;
          bot.botJumpTimer = 0.38;
        }
      }
    } else {
      // Flee from IT player
      const dx = bot.x - itPlayer.x;
      const dy = bot.y - itPlayer.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 360) {
        if (dx < 0) left = true;
        else right = true;

        // Turn back toward center if cornered against wall
        if (bot.x < 75) { left = false; right = true; }
        if (bot.x > this.width - 115) { right = false; left = true; }

        if ((Math.abs(dy) < 90 || bot.x < 90 || bot.x > this.width - 130) && bot.botJumpTimer <= 0) {
          jump = true;
          bot.botJumpTimer = 0.42;
        }
      } else if (this.powerup) {
        // Go grab powerup if safe
        if (this.powerup.x < bot.x - 12) left = true;
        else if (this.powerup.x > bot.x + 12) right = true;
        if (this.powerup.y < bot.y - 40 && bot.botJumpTimer <= 0) {
          jump = true;
          bot.botJumpTimer = 0.45;
        }
      }
    }

    return { left, right, jump };
  }

  finishRound() {
    this.roundOver = true;
    sound.roundEnd();

    const loser = this.players.find(p => p.isIt);
    // Survivors each earn +1 point!
    for (const p of this.players) {
      if (!p.isIt) {
        this.scores[p.id] += 1;
      }
    }

    this.updateHUD();

    // Check if someone won the match trophy
    const topScore = Math.max(...this.players.map(p => this.scores[p.id]));
    const winners = this.players.filter(p => this.scores[p.id] >= this.winsNeeded && this.scores[p.id] === topScore);

    const overlay = document.getElementById('roundOverlay');
    const badge = document.getElementById('overlayBadge');
    const title = document.getElementById('overlayTitle');
    const subtitle = document.getElementById('overlaySubtitle');
    const scoreboard = document.getElementById('overlayScoreboard');
    const nextBtn = document.getElementById('nextRoundBtn');

    if (winners.length > 0) {
      this.matchOver = true;
      const anyHumanWon = winners.some(w => w.mode === 'human');
      const coinPrize = anyHumanWon ? 100 : 25;
      this.onCoinsEarned(coinPrize, '🏆 Match Victory');
      badge.textContent = `🏆 CHAMPION CROWNED! (+${coinPrize} 🪙)`;
      const names = winners.map(w => `${w.name} (${w.charObj.name})`).join(' & ');
      title.textContent = `${names} Wins the Match!`;
      subtitle.textContent = loser
        ? `${loser.name} got stuck as IT when time ran out! Earned +${coinPrize} 🪙 Coins!`
        : `What a match! Earned +${coinPrize} 🪙 Coins!`;
      nextBtn.textContent = 'Play New Match 🔄';
    } else {
      const anyHumanSurvived = this.players.some(p => !p.isIt && p.mode === 'human');
      const coinPrize = anyHumanSurvived ? 25 : 10;
      this.onCoinsEarned(coinPrize, '⏱️ Round Survived');
      badge.textContent = `⏱️ TIME IS UP! (+${coinPrize} 🪙)`;
      title.textContent = loser
        ? `${loser.name} Was Caught Holding the Tag!`
        : 'Round Complete!';
      subtitle.textContent = `Survivors earn +1 point & +${coinPrize} 🪙 Coins! (First to ${this.winsNeeded} wins)`;
      nextBtn.textContent = 'Next Round ▶';
    }

    scoreboard.innerHTML = this.players
      .map(
        p => `
        <div class="score-box" style="border-bottom-color: ${p.color}">
          <strong>${p.name} ${p.isIt ? '💣' : '✨'}</strong>
          <span>${this.scores[p.id]} / ${this.winsNeeded}</span>
        </div>
      `
      )
      .join('');

    overlay.classList.remove('hidden');
  }

  spawnBurst(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 2 + Math.random() * 5.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        r: 4 + Math.random() * 5,
        color,
        alpha: 1,
        decay: 1.8 + Math.random() * 0.8
      });
    }
  }

  spawnFloatingText(x, y, text, color) {
    this.floatingTexts.push({ x, y, text, color, life: 1.15 });
  }

  updateHUDTimer() {
    const timerEl = document.getElementById('hudTimer');
    const secs = Math.max(0, Math.ceil(this.timeRemaining));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (secs <= 10) {
      timerEl.classList.add('danger');
    } else {
      timerEl.classList.remove('danger');
    }
  }

  updateHUD() {
    this.updateHUDTimer();
    const leftContainer = document.getElementById('hudPlayersLeft');
    const rightContainer = document.getElementById('hudPlayersRight');
    const itBanner = document.getElementById('hudItBanner');

    const itPlayer = this.players.find(p => p.isIt);
    if (itPlayer) {
      itBanner.textContent = `🚨 ${itPlayer.shortName} IS IT! RUN!`;
      itBanner.style.background = `${itPlayer.color}33`;
      itBanner.style.color = '#fff';
    }

    const renderPill = (p) => `
      <div class="hud-player-pill ${p.isIt ? 'is-it' : ''}">
        <div class="hud-dot" style="background: ${p.color}"></div>
        <div class="hud-p-meta">
          <div class="hud-p-name">
            ${p.shortName} ${p.mode === 'bot' ? '🤖' : ''} ${p.isIt ? '💣' : ''}
          </div>
          <div class="hud-p-score">⭐ ${this.scores[p.id]} / ${this.winsNeeded}</div>
        </div>
      </div>
    `;

    const half = Math.ceil(this.players.length / 2);
    leftContainer.innerHTML = this.players.slice(0, half).map(renderPill).join('');
    rightContainer.innerHTML = this.players.slice(half).map(renderPill).join('');
  }

  renderControlsFooter() {
    const footer = document.getElementById('controlsFooter');
    footer.innerHTML = this.players
      .map(
        p => `
        <div class="footer-ctrl-item">
          <span class="footer-ctrl-swatch" style="background:${p.color}"></span>
          <strong>${p.shortName}:</strong>
          <span>${
            p.mode === 'bot'
              ? 'AI Bot 🤖'
              : `${p.keyLabels.left} / ${p.keyLabels.up} / ${p.keyLabels.right}`
          }</span>
        </div>
      `
      )
      .join('');
  }

  draw() {
    const ctx = this.ctx;
    const map = this.currentMap;

    ctx.save();
    if (this.screenShake > 0) {
      const dx = (Math.random() - 0.5) * this.screenShake;
      const dy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(dx, dy);
    }

    // 1. Sky / Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, map.bgTop);
    grad.addColorStop(1, map.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Ambient Map Backdrop Details
    this.drawBackdrop(ctx, map);

    // 3. Portals
    if (map.portals) {
      for (const pair of map.portals) {
        this.drawPortal(ctx, pair.a.x, pair.a.y, pair.a.color);
        this.drawPortal(ctx, pair.b.x, pair.b.y, pair.b.color);
      }
    }

    // 4. Platforms (TagGame.io rounded 2-layer blocks)
    for (const plat of map.platforms) {
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      this.roundRect(ctx, plat.x, plat.y + 6, plat.w, plat.h, 11);
      ctx.fill();

      // Base body
      ctx.fillStyle = map.platformBody;
      this.roundRect(ctx, plat.x, plat.y, plat.w, plat.h, 11);
      ctx.fill();

      // Top cap highlight
      ctx.fillStyle = map.platformTop;
      this.roundRect(ctx, plat.x, plat.y, plat.w, Math.min(13, plat.h * 0.55), 10);
      ctx.fill();
    }

    // 5. Jump Pads
    for (const pad of map.jumpPads) {
      if (pad.pulse && pad.pulse > 0) {
        pad.pulse = Math.max(0, pad.pulse - 0.08);
      }
      const lift = (pad.pulse || 0) * 6;
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, pad.x + 6, pad.y + 6, pad.w - 12, pad.h - 4, 4);
      ctx.fill();

      ctx.fillStyle = map.accentColor;
      ctx.shadowColor = map.accentColor;
      ctx.shadowBlur = 12;
      this.roundRect(ctx, pad.x, pad.y - lift, pad.w, 10, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 6. Speed Boost Power-Up Orb
    if (this.powerup) {
      const py = this.powerup.y + Math.sin(this.powerup.bob) * 6;
      ctx.save();
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(this.powerup.x, py, this.powerup.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡', this.powerup.x, py + 1);
      ctx.restore();
    }

    // 7. Particles
    for (const pt of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.alpha);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 8. Players
    for (const p of this.players) {
      this.drawPlayer(ctx, p);
    }

    // 9. Floating Texts
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, ft.life);
      ctx.font = '800 20px Fredoka, Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  drawBackdrop(ctx, map) {
    if (map.decorType === 'grid') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < this.width; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
        ctx.stroke();
      }
      for (let y = 0; y < this.height; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle =
        map.decorType === 'snow'
          ? 'rgba(255, 255, 255, 0.25)'
          : 'rgba(255, 255, 255, 0.18)';
      for (const c of this.decorClouds) {
        c.x += c.speed;
        if (c.x - c.r > this.width) c.x = -c.r;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawPortal(ctx, x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.portalAngle);

    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 1.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 13, Math.PI * 0.5, Math.PI * 1.8);
    ctx.stroke();
    ctx.restore();
  }

  drawPlayer(ctx, p) {
    const cx = p.x + p.w / 2;
    const bottomY = p.y + p.h;

    ctx.save();
    ctx.translate(cx, bottomY);
    ctx.scale(p.scaleX, p.scaleY);

    // Glow ring if "IT" or Speed Boosted
    if (p.isIt) {
      ctx.beginPath();
      ctx.arc(0, -p.h / 2, 26, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 71, 87, 0.28)';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ff4757';
      ctx.stroke();
    } else if (p.speedBoostTimer > 0) {
      ctx.beginPath();
      ctx.arc(0, -p.h / 2, 25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
      ctx.fill();
    }

    // Render BerryBox Cute Chubby Character!
    drawChubbyCharacter(ctx, 0, -p.h / 2, 19, p.charObj, {
      vx: p.vx,
      angle: p.vx * 0.018,
      time: this.portalAngle * 1.6
    });

    ctx.restore();

    // Floating Player Badge & "IT" Tag Pointer above head
    const tagBounce = Math.sin(this.portalAngle * 2.2) * 5;
    if (p.isIt) {
      ctx.save();
      ctx.fillStyle = '#ff4757';
      ctx.strokeStyle = '#0a0f1d';
      ctx.lineWidth = 2.5;
      const pointerY = p.y - 24 + tagBounce;
      ctx.beginPath();
      ctx.moveTo(cx, pointerY + 10);
      ctx.lineTo(cx - 10, pointerY - 4);
      ctx.lineTo(cx + 10, pointerY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 13px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0a0f1d';
      ctx.lineWidth = 3.5;
      ctx.strokeText('IT!', cx, pointerY - 9);
      ctx.fillText('IT!', cx, pointerY - 9);
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = '800 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#0a0f1d';
      ctx.lineWidth = 3;
      ctx.strokeText(p.shortName, cx, p.y - 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(p.shortName, cx, p.y - 10);
      ctx.restore();
    }
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
}
