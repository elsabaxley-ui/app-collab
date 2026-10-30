import { TagGame, PLAYER_CONFIGS } from './games/tag/tagGame.js';
import { TAG_MAPS } from './games/tag/maps.js';
import { sound } from './audio.js';

const hubScreen = document.getElementById('hubScreen');
const tagSetupScreen = document.getElementById('tagSetupScreen');
const tagArenaScreen = document.getElementById('tagArenaScreen');

const hubNavBtn = document.getElementById('hubNavBtn');
const mapSwitchBtn = document.getElementById('mapSwitchBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const backToHubBtn = document.getElementById('backToHubBtn');

const canvas = document.getElementById('tagCanvas');
const tagGame = new TagGame(canvas);

function showScreen(screenEl) {
  [hubScreen, tagSetupScreen, tagArenaScreen].forEach(s => s.classList.remove('active'));
  screenEl.classList.add('active');

  if (screenEl === hubScreen) {
    tagGame.stop();
    hubNavBtn.classList.add('hidden');
    mapSwitchBtn.classList.add('hidden');
  } else if (screenEl === tagSetupScreen) {
    tagGame.stop();
    hubNavBtn.classList.remove('hidden');
    mapSwitchBtn.classList.add('hidden');
    renderSetupLobby();
  } else if (screenEl === tagArenaScreen) {
    hubNavBtn.classList.remove('hidden');
    mapSwitchBtn.classList.remove('hidden');
  }
}

function renderSetupLobby() {
  // 1. Render 4 Player Slots with WAD / TFH / IJL / Arrows pyramids
  const slotsGrid = document.getElementById('playerSlotsGrid');
  slotsGrid.innerHTML = PLAYER_CONFIGS.map((cfg, idx) => {
    const mode = tagGame.playerModes[idx];
    return `
      <div class="player-slot-card ${mode === 'off' ? 'inactive' : ''}" style="border-color: ${mode !== 'off' ? cfg.color + '66' : 'rgba(255,255,255,0.08)'}">
        <div class="slot-avatar" style="background: ${cfg.color}">
          <div class="eyes"><span></span><span></span></div>
        </div>
        <div class="slot-name" style="color: ${cfg.color}">${cfg.name}</div>

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

  // 2. Render Map Selector
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

// Duration & Wins selectors
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

// Navigation Buttons
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

soundToggleBtn.addEventListener('click', () => {
  const on = sound.toggle();
  soundToggleBtn.textContent = on ? '🔊 Sound: ON' : '🔇 Sound: OFF';
});
