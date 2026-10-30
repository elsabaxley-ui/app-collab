import { TagGame, PLAYER_CONFIGS } from './games/tag/tagGame.js';
import { TAG_MAPS } from './games/tag/maps.js';
import { sound } from './audio.js';
import { CHARACTERS, getCharacterById, drawChubbyCharacter } from './characters.js';

// ==================== ACCOUNT, COINS & 48 CHARACTERS STATE ====================
const STATE_KEY = 'berrybox_collab_state_v1';
const ACCOUNTS_DB_KEY = 'berrybox_collab_accounts_v1';

function makeNewAccount(username, password = '') {
  const clean = String(username || 'Byron').trim();
  const lower = clean.toLowerCase();
  const isFounder = lower === 'byron' || lower === 'elsa';
  return {
    username: clean,
    password: String(password || ''),
    coins: isFounder ? 1000 : 150,
    equippedCharId: 'c1',
    unlockedCharIds: ['c1']
  };
}

function loadAccountsDB() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveAccountsDB(db) {
  try {
    localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(db));
  } catch (e) {}
}

function loadState() {
  const db = loadAccountsDB();
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged = { ...makeNewAccount(parsed.username || 'Byron'), ...parsed };
      db[merged.username.toLowerCase()] = merged;
      saveAccountsDB(db);
      return merged;
    }
  } catch (e) {}
  const fresh = makeNewAccount('Byron');
  db[fresh.username.toLowerCase()] = fresh;
  saveAccountsDB(db);
  return fresh;
}

let state = loadState();
let activeTierFilter = 'All';

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    const db = loadAccountsDB();
    db[state.username.toLowerCase()] = state;
    saveAccountsDB(db);
  } catch (e) {}
  updateTopbarHUD();
}

function toast(msg) {
  const t = document.getElementById('toastBox');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.add('hidden'), 2800);
}

// ==================== DOM ELEMENTS & GAME INSTANCE ====================
const hubScreen = document.getElementById('hubScreen');
const tagSetupScreen = document.getElementById('tagSetupScreen');
const tagArenaScreen = document.getElementById('tagArenaScreen');
const shopScreen = document.getElementById('shopScreen');

const hubNavBtn = document.getElementById('hubNavBtn');
const mapSwitchBtn = document.getElementById('mapSwitchBtn');
const shopNavBtn = document.getElementById('shopNavBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const backToHubBtn = document.getElementById('backToHubBtn');

const canvas = document.getElementById('tagCanvas');
const tagGame = new TagGame(canvas, {
  onCoinsEarned: (amount, reason) => {
    state.coins += amount;
    saveState();
    toast(`${reason}: +${amount} 🪙 Coins!`);
  }
});

// Sync Player 1's character with your equipped character
tagGame.playerCharIds[0] = state.equippedCharId;

function updateTopbarHUD() {
  document.getElementById('coinBalanceText').textContent = state.coins;
  const shopCoins = document.getElementById('shopCoinText');
  if (shopCoins) shopCoins.textContent = state.coins;

  const eq = getCharacterById(state.equippedCharId);
  document.getElementById('equippedCharName').textContent = eq.name;
  document.getElementById('topbarUsername').textContent = `@${state.username}`;

  const topAvatar = document.getElementById('topbarAvatarCanvas');
  if (topAvatar) {
    const ctx = topAvatar.getContext('2d');
    ctx.clearRect(0, 0, 30, 30);
    drawChubbyCharacter(ctx, 15, 16, 9, eq);
  }

  drawHubPreviewCard();
}

function drawHubPreviewCard() {
  const cv = document.getElementById('hubPreviewCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);

  // Platforms
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0a0f1d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(24, 146, 332, 22, 8);
  ctx.roundRect(95, 88, 175, 18, 8);
  ctx.fill();
  ctx.stroke();

  // Draw 3 cute Chubby Characters chasing each other
  const c1 = getCharacterById(state.equippedCharId);
  const c2 = getCharacterById('c2');
  const c3 = getCharacterById('c3');
  drawChubbyCharacter(ctx, 145, 65, 18, c1, { vx: 3 });
  drawChubbyCharacter(ctx, 235, 123, 18, c2, { vx: 3 });
  drawChubbyCharacter(ctx, 305, 123, 18, c3, { vx: -3 });
}

function showScreen(screenEl) {
  [hubScreen, tagSetupScreen, tagArenaScreen, shopScreen].forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');

  if (screenEl === hubScreen) {
    tagGame.stop();
    hubNavBtn.classList.add('hidden');
    mapSwitchBtn.classList.add('hidden');
    drawHubPreviewCard();
  } else if (screenEl === tagSetupScreen) {
    tagGame.stop();
    hubNavBtn.classList.remove('hidden');
    mapSwitchBtn.classList.add('hidden');
    renderSetupLobby();
  } else if (screenEl === tagArenaScreen) {
    hubNavBtn.classList.remove('hidden');
    mapSwitchBtn.classList.remove('hidden');
  } else if (screenEl === shopScreen) {
    tagGame.stop();
    hubNavBtn.classList.remove('hidden');
    mapSwitchBtn.classList.add('hidden');
    renderShop();
  }
}

// ==================== SUPER TAG LOBBY (WITH CHUBBY CHARACTER PICKER) ====================
function getSelectableCharactersForSlot(slotIdx) {
  // Unlocked characters + starter characters for P2/P3/P4 so all 4 players have unique looks even at start
  const poolIds = new Set([...state.unlockedCharIds, 'c1', 'c2', 'c3', 'c4']);
  return CHARACTERS.filter(c => poolIds.has(c.id));
}

function renderSetupLobby() {
  const slotsGrid = document.getElementById('playerSlotsGrid');
  slotsGrid.innerHTML = PLAYER_CONFIGS.map((cfg, idx) => {
    const mode = tagGame.playerModes[idx];
    const charObj = getCharacterById(tagGame.playerCharIds[idx] || cfg.defaultCharId);
    return `
      <div class="player-slot-card ${mode === 'off' ? 'inactive' : ''}">
        <div class="slot-name" style="color: ${charObj.bodyColor}">${cfg.name}</div>

        <div class="slot-char-picker">
          <button class="char-arrow-btn" data-slot="${idx}" data-dir="-1">◀</button>
          <canvas class="slot-char-canvas" id="slotCanvas_${idx}" width="58" height="58"></canvas>
          <button class="char-arrow-btn" data-slot="${idx}" data-dir="1">▶</button>
        </div>
        <div class="slot-char-label">${charObj.name}</div>

        <div class="key-pyramid">
          <div class="key-row">
            <div class="keycap">${cfg.keyLabels.up}</div>
          </div>
          <div class="key-row">
            <div class="keycap">${cfg.keyLabels.left}</div>
            <div class="keycap">${cfg.keyLabels.right}</div>
          </div>
        </div>
        <div class="key-label-hint">Jump: ${cfg.keyLabels.up} • Move: ${cfg.keyLabels.left}/${cfg.keyLabels.right}</div>

        <div class="mode-toggle-group" data-player-idx="${idx}">
          <button class="mode-btn ${mode === 'human' ? 'active' : ''}" data-mode="human">👤 Human</button>
          <button class="mode-btn ${mode === 'bot' ? 'active' : ''}" data-mode="bot">🤖 Bot</button>
          <button class="mode-btn ${mode === 'off' ? 'active' : ''}" data-mode="off">Off</button>
        </div>
      </div>
    `;
  }).join('');

  // Draw Chubby Characters in each slot canvas
  PLAYER_CONFIGS.forEach((cfg, idx) => {
    const cv = document.getElementById(`slotCanvas_${idx}`);
    if (cv) {
      const ctx = cv.getContext('2d');
      const charObj = getCharacterById(tagGame.playerCharIds[idx] || cfg.defaultCharId);
      drawChubbyCharacter(ctx, 29, 32, 17, charObj);
    }
  });

  // Character cycle buttons
  slotsGrid.querySelectorAll('.char-arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = Number(btn.dataset.slot);
      const dir = Number(btn.dataset.dir);
      const pool = getSelectableCharactersForSlot(slot);
      const curIdx = Math.max(0, pool.findIndex(c => c.id === tagGame.playerCharIds[slot]));
      const nextChar = pool[(curIdx + dir + pool.length) % pool.length];
      tagGame.playerCharIds[slot] = nextChar.id;
      if (slot === 0 && state.unlockedCharIds.includes(nextChar.id)) {
        state.equippedCharId = nextChar.id;
        saveState();
      }
      sound.tick();
      renderSetupLobby();
    });
  });

  // Human / Bot / Off toggle
  slotsGrid.querySelectorAll('.mode-toggle-group').forEach(group => {
    const pIdx = Number(group.dataset.playerIdx);
    group.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tagGame.playerModes[pIdx] = btn.dataset.mode;
        sound.tick();
        renderSetupLobby();
      });
    });
  });

  // Map Selector
  const mapSelector = document.getElementById('mapSelector');
  mapSelector.innerHTML = TAG_MAPS.map(m => `
    <button class="map-card-btn ${tagGame.selectedMapId === m.id ? 'active' : ''}" data-map="${m.id}">
      <div class="map-swatch" style="background: ${m.swatch}"></div>
      <div class="map-card-info">
        <strong>${m.name}</strong>
        <span>${m.subtitle}</span>
      </div>
    </button>
  `).join('');

  mapSelector.querySelectorAll('.map-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tagGame.selectedMapId = btn.dataset.map;
      sound.tick();
      renderSetupLobby();
    });
  });
}

// ==================== 48-CHARACTER COIN SHOP ====================
function renderShop() {
  document.getElementById('shopCoinText').textContent = state.coins;
  const grid = document.getElementById('charShopGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const chars = CHARACTERS.filter(c =>
    activeTierFilter === 'All' ? true : c.tier === activeTierFilter
  );

  chars.forEach(c => {
    const isUnlocked = state.unlockedCharIds.includes(c.id);
    const isEquipped = state.equippedCharId === c.id;

    const card = document.createElement('div');
    card.className = `char-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;
    card.innerHTML = `
      <canvas width="68" height="68"></canvas>
      <div class="char-name">${c.name}</div>
      <div class="char-tier-tag">${c.tier}</div>
      <div class="char-price-btn">
        ${isEquipped ? '✅ Equipped' : (isUnlocked ? 'Equip' : `🔒 ${c.cost} 🪙`)}
      </div>
    `;

    const cv = card.querySelector('canvas');
    drawChubbyCharacter(cv.getContext('2d'), 34, 38, 20, c);

    card.addEventListener('click', () => {
      if (isUnlocked) {
        state.equippedCharId = c.id;
        tagGame.playerCharIds[0] = c.id;
        saveState();
        renderShop();
        sound.tick();
        toast(`Equipped ${c.name}!`);
      } else if (state.coins >= c.cost) {
        state.coins -= c.cost;
        state.unlockedCharIds.push(c.id);
        state.equippedCharId = c.id;
        tagGame.playerCharIds[0] = c.id;
        saveState();
        renderShop();
        sound.powerup();
        toast(`🎉 Unlocked & Equipped ${c.name}!`);
      } else {
        toast(`🔒 Need ${c.cost - state.coins} more 🪙 Coins! Play Super Tag to earn Coins!`);
      }
    });

    grid.appendChild(card);
  });
}

// ==================== ACCOUNT SWITCHER MODAL ====================
function openAuthModal() {
  const modal = document.getElementById('authModal');
  modal.classList.remove('hidden');
  const wrap = document.getElementById('savedAccountsWrap');
  const db = loadAccountsDB();
  const accounts = Object.values(db);

  if (accounts.length === 0) {
    wrap.innerHTML = '';
    return;
  }

  wrap.innerHTML = `
    <div style="font-size:0.75rem;font-weight:800;color:#475569;margin-bottom:6px;">
      Saved Accounts on this device:
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;" id="savedAccButtons"></div>
  `;
  const box = wrap.querySelector('#savedAccButtons');
  accounts.forEach(acc => {
    const btn = document.createElement('button');
    btn.className = 'pill-btn';
    btn.style.fontSize = '0.78rem';
    btn.innerHTML = `👤 <strong>@${acc.username}</strong> (${acc.coins} 🪙)`;
    btn.onclick = () => switchIntoAccount(acc.username, acc.password || '', true);
    box.appendChild(btn);
  });
}

function switchIntoAccount(username, password, skipPass = false) {
  const clean = String(username || '').trim();
  if (!clean) {
    toast('⚠️ Please enter a username!');
    return;
  }
  const key = clean.toLowerCase();
  const db = loadAccountsDB();

  if (db[key]) {
    if (!skipPass && db[key].password && password && db[key].password !== password) {
      toast('⚠️ Incorrect password/PIN!');
      return;
    }
    state = db[key];
  } else {
    state = makeNewAccount(clean, password);
    db[key] = state;
    saveAccountsDB(db);
  }

  tagGame.playerCharIds[0] = state.equippedCharId;
  saveState();
  document.getElementById('authModal').classList.add('hidden');
  renderShop();
  toast(`👋 Logged in as @${state.username} (${state.coins} 🪙)!`);
}

// ==================== EVENT LISTENERS ====================
document.querySelectorAll('#durationSelector .opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#durationSelector .opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tagGame.roundDuration = Number(btn.dataset.time);
    sound.tick();
  });
});

document.querySelectorAll('#winsSelector .opt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#winsSelector .opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tagGame.winsNeeded = Number(btn.dataset.wins);
    sound.tick();
  });
});

document.querySelectorAll('#tierFilterBar .tier-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeTierFilter = btn.dataset.tier;
    document.querySelectorAll('#tierFilterBar .tier-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderShop();
  });
});

document.getElementById('launchTagBtn').addEventListener('click', () => {
  sound.tick();
  showScreen(tagSetupScreen);
});

document.getElementById('startMatchBtn').addEventListener('click', () => {
  sound.roundEnd();
  showScreen(tagArenaScreen);
  tagGame.startNewMatch();
});

document.getElementById('nextRoundBtn').addEventListener('click', () => {
  sound.tick();
  if (tagGame.matchOver) {
    tagGame.startNewMatch();
  } else {
    tagGame.startRound();
  }
});

document.getElementById('changeSetupOverlayBtn').addEventListener('click', () => {
  sound.tick();
  showScreen(tagSetupScreen);
});

hubNavBtn.addEventListener('click', () => showScreen(hubScreen));
backToHubBtn.addEventListener('click', () => showScreen(hubScreen));
mapSwitchBtn.addEventListener('click', () => showScreen(tagSetupScreen));
shopNavBtn.addEventListener('click', () => showScreen(shopScreen));
document.getElementById('walletPillBtn').addEventListener('click', () => showScreen(shopScreen));

document.getElementById('switchAccountBtn').addEventListener('click', openAuthModal);
document.getElementById('closeAuthModalBtn').addEventListener('click', () => {
  document.getElementById('authModal').classList.add('hidden');
});
document.getElementById('authSubmitBtn').addEventListener('click', () => {
  switchIntoAccount(
    document.getElementById('authUsernameInput').value,
    document.getElementById('authPassInput').value,
    false
  );
});

soundToggleBtn.addEventListener('click', () => {
  const on = sound.toggle();
  soundToggleBtn.textContent = on ? '🔊' : '🔇';
});

updateTopbarHUD();
