// BerryBox 48 Cute Chubby Characters Data & Procedural Canvas Renderer

export const CHARACTERS = [
  // STARTER (FREE)
  { id: "c1",  name: "Lil Blueberry",    tier: "Starter",   cost: 0,     bodyColor: "#2563eb", bellyColor: "#93c5fd", earType: "leaf",   faceType: "kawaii",  accessory: "none",   species: "berry" },

  // COMMON (150 - 300 COINS)
  { id: "c2",  name: "Chubby Frog",      tier: "Common",    cost: 150,   bodyColor: "#22c55e", bellyColor: "#bbf7d0", earType: "frog",   faceType: "derp",    accessory: "blush",  species: "frog" },
  { id: "c3",  name: "Pink Mochi",       tier: "Common",    cost: 150,   bodyColor: "#f472b6", bellyColor: "#fbcfe8", earType: "round",  faceType: "kawaii",  accessory: "bow",    species: "mochi" },
  { id: "c4",  name: "Lil Chick",        tier: "Common",    cost: 175,   bodyColor: "#facc15", bellyColor: "#fef08a", earType: "tuft",   faceType: "beak",    accessory: "none",   species: "bird" },
  { id: "c5",  name: "Bouncy Bear",      tier: "Common",    cost: 175,   bodyColor: "#b45309", bellyColor: "#fde68a", earType: "bear",   faceType: "snout",   accessory: "none",   species: "bear" },
  { id: "c6",  name: "Minty Slime",      tier: "Common",    cost: 200,   bodyColor: "#10b981", bellyColor: "#a7f3d0", earType: "droplet",faceType: "happy",   accessory: "bubbles",species: "slime" },
  { id: "c7",  name: "Panda Puff",       tier: "Common",    cost: 200,   bodyColor: "#f8fafc", bellyColor: "#e2e8f0", earType: "panda",  faceType: "panda",   accessory: "bamboo", species: "panda" },
  { id: "c8",  name: "Orange Fox",       tier: "Common",    cost: 225,   bodyColor: "#f97316", bellyColor: "#ffedd5", earType: "pointy", faceType: "smirk",   accessory: "scarf",  species: "fox" },
  { id: "c9",  name: "Sleepy Koala",     tier: "Common",    cost: 225,   bodyColor: "#94a3b8", bellyColor: "#f1f5f9", earType: "koala",  faceType: "sleepy",  accessory: "none",   species: "koala" },
  { id: "c10", name: "Cloud Puff",       tier: "Common",    cost: 250,   bodyColor: "#e0f2fe", bellyColor: "#ffffff", earType: "cloud",  faceType: "kawaii",  accessory: "halo",   species: "cloud" },
  { id: "c11", name: "Bunny Hop",        tier: "Common",    cost: 250,   bodyColor: "#fda4af", bellyColor: "#fff1f2", earType: "bunny",  faceType: "buck",    accessory: "carrot", species: "bunny" },
  { id: "c12", name: "Baby Penguin",     tier: "Common",    cost: 275,   bodyColor: "#1e293b", bellyColor: "#ffffff", earType: "round",  faceType: "beak",    accessory: "beanie", species: "penguin" },
  { id: "c13", name: "Acorn Boi",        tier: "Common",    cost: 275,   bodyColor: "#d97706", bellyColor: "#fef3c7", earType: "acorn",  faceType: "happy",   accessory: "leaf",   species: "acorn" },
  { id: "c14", name: "Taco Buddy",       tier: "Common",    cost: 300,   bodyColor: "#eab308", bellyColor: "#fde047", earType: "wave",   faceType: "wink",    accessory: "sombrero",species:"taco" },

  // RARE (500 - 950 COINS)
  { id: "c15", name: "Chubby Shark",     tier: "Rare",      cost: 500,   bodyColor: "#0284c7", bellyColor: "#e0f2fe", earType: "fin",    faceType: "teeth",   accessory: "scuba",  species: "shark" },
  { id: "c16", name: "Lil Dino",         tier: "Rare",      cost: 500,   bodyColor: "#16a34a", bellyColor: "#dcfce7", earType: "spikes", faceType: "teeth",   accessory: "egg",    species: "dino" },
  { id: "c17", name: "Shadow Ninja",     tier: "Rare",      cost: 550,   bodyColor: "#0f172a", bellyColor: "#334155", earType: "round",  faceType: "ninja",   accessory: "headband",species:"ninja" },
  { id: "c18", name: "Samurai Pug",      tier: "Rare",      cost: 550,   bodyColor: "#d6d3d1", bellyColor: "#fafaf9", earType: "floppy", faceType: "pug",     accessory: "helmet", species: "dog" },
  { id: "c19", name: "Pirate Octo",      tier: "Rare",      cost: 600,   bodyColor: "#e11d48", bellyColor: "#ffe4e6", earType: "round",  faceType: "patch",   accessory: "pirate", species: "octo" },
  { id: "c20", name: "Wizard Owl",       tier: "Rare",      cost: 650,   bodyColor: "#7c3aed", bellyColor: "#ede9fe", earType: "tuft",   faceType: "glasses", accessory: "wizhat", species: "owl" },
  { id: "c21", name: "Viking Boar",      tier: "Rare",      cost: 700,   bodyColor: "#78350f", bellyColor: "#fed7aa", earType: "horns",  faceType: "tusks",   accessory: "axe",    species: "boar" },
  { id: "c22", name: "Cactus Pal",       tier: "Rare",      cost: 700,   bodyColor: "#15803d", bellyColor: "#86efac", earType: "flower", faceType: "happy",   accessory: "shades", species: "cactus" },
  { id: "c23", name: "Astro Chub",       tier: "Rare",      cost: 750,   bodyColor: "#f8fafc", bellyColor: "#cbd5e1", earType: "antenna",faceType: "visor",   accessory: "jetpack",species: "astro" },
  { id: "c24", name: "Detective Duck",   tier: "Rare",      cost: 800,   bodyColor: "#f59e0b", bellyColor: "#fef3c7", earType: "cap",    faceType: "monocle", accessory: "pipe",   species: "duck" },
  { id: "c25", name: "Chef Dumpling",    tier: "Rare",      cost: 850,   bodyColor: "#fffbeb", bellyColor: "#fef3c7", earType: "pleats", faceType: "mustache",accessory: "chef",   species: "dumpling" },
  { id: "c26", name: "Skater Capybara",  tier: "Rare",      cost: 900,   bodyColor: "#92400e", bellyColor: "#fde68a", earType: "bear",   faceType: "chill",   accessory: "shades", species: "capy" },
  { id: "c27", name: "Knight Potato",    tier: "Rare",      cost: 925,   bodyColor: "#a16207", bellyColor: "#fef08a", earType: "plume",  faceType: "helmet",  accessory: "shield", species: "potato" },
  { id: "c28", name: "DJ Hamster",       tier: "Rare",      cost: 950,   bodyColor: "#fb923c", bellyColor: "#ffedd5", earType: "bear",   faceType: "shades",  accessory: "phones", species: "hamster" },

  // EPIC (1,500 - 2,800 COINS)
  { id: "c29", name: "Cyber Bot 9000",   tier: "Epic",      cost: 1500,  bodyColor: "#06b6d4", bellyColor: "#cffafe", earType: "antenna",faceType: "laser",   accessory: "bolts",  species: "bot" },
  { id: "c30", name: "Neon Axolotl",     tier: "Epic",      cost: 1600,  bodyColor: "#ec4899", bellyColor: "#fce7f3", earType: "frills", faceType: "kawaii",  accessory: "glow",   species: "axolotl" },
  { id: "c31", name: "Lava Golem",       tier: "Epic",      cost: 1700,  bodyColor: "#dc2626", bellyColor: "#f97316", earType: "flames", faceType: "angry",   accessory: "magma",  species: "golem" },
  { id: "c32", name: "Frost Yeti",       tier: "Epic",      cost: 1800,  bodyColor: "#38bdf8", bellyColor: "#f0f9ff", earType: "horns",  faceType: "teeth",   accessory: "ice",    species: "yeti" },
  { id: "c33", name: "Marshmallow Ghost",tier: "Epic",      cost: 1900,  bodyColor: "#e2e8f0", bellyColor: "#ffffff", earType: "wisp",   faceType: "spooky",  accessory: "lantern",species: "ghost" },
  { id: "c34", name: "Mecha Kitty",      tier: "Epic",      cost: 2000,  bodyColor: "#6366f1", bellyColor: "#e0e7ff", earType: "pointy", faceType: "laser",   accessory: "jetpack",species: "cat" },
  { id: "c35", name: "Electric Raiju",   tier: "Epic",      cost: 2100,  bodyColor: "#eab308", bellyColor: "#fef9c3", earType: "bolts",  faceType: "smirk",   accessory: "sparks", species: "wolf" },
  { id: "c36", name: "Crystal Crab",     tier: "Epic",      cost: 2200,  bodyColor: "#f43f5e", bellyColor: "#ffe4e6", earType: "claws",  faceType: "derp",    accessory: "gem",    species: "crab" },
  { id: "c37", name: "Shadow Kitsune",   tier: "Epic",      cost: 2400,  bodyColor: "#312e81", bellyColor: "#818cf8", earType: "pointy", faceType: "mask",    accessory: "orbs",   species: "fox" },
  { id: "c38", name: "Plasma Blob",      tier: "Epic",      cost: 2500,  bodyColor: "#a855f7", bellyColor: "#f3e8ff", earType: "droplet",faceType: "cyclops", accessory: "rings",  species: "blob" },
  { id: "c39", name: "Steampunk Turtle", tier: "Epic",      cost: 2650,  bodyColor: "#047857", bellyColor: "#d97706", earType: "gears",  faceType: "goggles", accessory: "steam",  species: "turtle" },
  { id: "c40", name: "Alien Jelly",      tier: "Epic",      cost: 2800,  bodyColor: "#14b8a6", bellyColor: "#99f6e4", earType: "antenna",faceType: "alien",   accessory: "ufo",    species: "alien" },

  // LEGENDARY (4,000 - 10,000 COINS)
  { id: "c41", name: "Golden Berry King",tier: "Legendary", cost: 4000,  bodyColor: "#f59e0b", bellyColor: "#fef08a", earType: "crown",  faceType: "shades",  accessory: "cape",   species: "king" },
  { id: "c42", name: "Galaxy Dragon",    tier: "Legendary", cost: 4500,  bodyColor: "#4f46e5", bellyColor: "#c084fc", earType: "horns",  faceType: "dragon",  accessory: "wings",  species: "dragon" },
  { id: "c43", name: "Rainbow Chubicorn",tier: "Legendary", cost: 5000,  bodyColor: "#ec4899", bellyColor: "#38bdf8", earType: "unicorn",faceType: "star",    accessory: "rainbow",species: "unicorn" },
  { id: "c44", name: "Diamond Golem",    tier: "Legendary", cost: 6000,  bodyColor: "#0ea5e9", bellyColor: "#e0f2fe", earType: "crystal",faceType: "visor",   accessory: "aura",   species: "diamond" },
  { id: "c45", name: "Cosmic Shiba",     tier: "Legendary", cost: 7000,  bodyColor: "#d97706", bellyColor: "#ffffff", earType: "pointy", faceType: "shades",  accessory: "halo",   species: "shiba" },
  { id: "c46", name: "Void Emperor",     tier: "Legendary", cost: 8000,  bodyColor: "#090d16", bellyColor: "#3b82f6", earType: "crown",  faceType: "laser",   accessory: "flames", species: "void" },
  { id: "c47", name: "Glitch Overlord",  tier: "Legendary", cost: 9000,  bodyColor: "#06b6d4", bellyColor: "#f43f5e", earType: "glitch", faceType: "cyber",   accessory: "matrix", species: "glitch" },
  { id: "c48", name: "Omega SquareBerry",tier: "Legendary", cost: 10000, bodyColor: "#1d4ed8", bellyColor: "#60a5fa", earType: "crown",  faceType: "kawaii",  accessory: "wings",  species: "omega" }
];

export function getCharacterById(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
}

export function drawChubbyCharacter(ctx, x, y, r, charObj, opts = {}) {
  const c = charObj || CHARACTERS[0];
  const angle = opts.angle || 0;
  const vx = opts.vx || 0;
  const time = opts.time || performance.now() * 0.005;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const sq = 1 + Math.sin(time * 2.5) * 0.04;
  ctx.scale(sq, 2 - sq);

  if (c.accessory === "wings" || c.species === "dragon") {
    ctx.fillStyle = c.bellyColor;
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.ellipse(dir * r * 1.05, -r * 0.1, r * 0.45, r * 0.28, dir * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.accessory === "cape") {
    ctx.fillStyle = "#ef4444";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.7, -r * 0.3);
    ctx.lineTo(-r * 1.15, r * 0.95);
    ctx.lineTo(r * 1.15, r * 0.95);
    ctx.lineTo(r * 0.7, -r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const step = Math.sin(time * 4) * (Math.abs(vx) > 0.3 ? 3.5 : 1);
  ctx.fillStyle = "#0a0f1d";
  ctx.beginPath();
  ctx.ellipse(-r * 0.42, r * 0.92 + step, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.42, r * 0.92 - step, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = c.bodyColor;
  ctx.strokeStyle = "#0a0f1d";
  ctx.lineWidth = 2.6;
  if (c.earType === "frog" || c.earType === "bear" || c.earType === "panda" || c.earType === "koala") {
    ctx.fillStyle = c.earType === "panda" ? "#0a0f1d" : c.bodyColor;
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.arc(dir * r * 0.65, -r * 0.72, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.earType === "bunny") {
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.ellipse(dir * r * 0.42, -r * 1.15, r * 0.22, r * 0.52, dir * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.earType === "pointy") {
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.moveTo(dir * r * 0.3, -r * 0.75);
      ctx.lineTo(dir * r * 0.82, -r * 1.28);
      ctx.lineTo(dir * r * 0.85, -r * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  } else if (c.earType === "fin" || c.earType === "spikes") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -r * 0.85);
    ctx.lineTo(0, -r * 1.4);
    ctx.lineTo(r * 0.35, -r * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (c.earType === "horns") {
    ctx.fillStyle = "#fef08a";
    [-1, 1].forEach(dir => {
      ctx.beginPath();
      ctx.moveTo(dir * r * 0.45, -r * 0.75);
      ctx.quadraticCurveTo(dir * r * 1.0, -r * 1.35, dir * r * 0.65, -r * 1.42);
      ctx.lineTo(dir * r * 0.25, -r * 0.85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  // Chubby Body
  ctx.fillStyle = c.bodyColor;
  ctx.strokeStyle = "#0a0f1d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-r * 0.98, -r * 0.92, r * 1.96, r * 1.84, r * 0.72);
  ctx.fill();
  ctx.stroke();

  // Chubby Belly Patch
  ctx.fillStyle = c.bellyColor;
  ctx.beginPath();
  ctx.ellipse(0, r * 0.24, r * 0.62, r * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stubby Hands
  ctx.fillStyle = c.bodyColor;
  ctx.strokeStyle = "#0a0f1d";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(-r * 0.98, r * 0.1, r * 0.24, 0, Math.PI * 2);
  ctx.arc(r * 0.98, r * 0.1, r * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cheeks
  ctx.fillStyle = "rgba(244, 114, 182, 0.55)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.52, r * 0.04, r * 0.18, r * 0.11, 0, 0, Math.PI * 2);
  ctx.ellipse(r * 0.52, r * 0.04, r * 0.18, r * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes / Face
  if (c.faceType === "shades") {
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(-r * 0.65, -r * 0.32, r * 0.55, r * 0.34);
    ctx.fillRect(r * 0.1, -r * 0.32, r * 0.55, r * 0.34);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, -r * 0.18);
    ctx.lineTo(r * 0.9, -r * 0.18);
    ctx.stroke();
  } else if (c.faceType === "ninja" || c.faceType === "visor" || c.faceType === "laser") {
    ctx.fillStyle = c.faceType === "ninja" ? "#0a0f1d" : "#38bdf8";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-r * 0.72, -r * 0.35, r * 1.44, r * 0.42, 6);
    ctx.fill();
    ctx.stroke();
  } else {
    if (c.faceType === "panda") {
      ctx.fillStyle = "#0a0f1d";
      ctx.beginPath();
      ctx.ellipse(-r * 0.36, -r * 0.16, r * 0.22, r * 0.26, -0.2, 0, Math.PI * 2);
      ctx.ellipse(r * 0.36, -r * 0.16, r * 0.22, r * 0.26, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#0a0f1d";
    ctx.beginPath();
    ctx.ellipse(-r * 0.34, -r * 0.16, r * 0.16, r * 0.21, 0, 0, Math.PI * 2);
    ctx.ellipse(r * 0.34, -r * 0.16, r * 0.16, r * 0.21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-r * 0.38, -r * 0.22, r * 0.07, 0, Math.PI * 2);
    ctx.arc(r * 0.3, -r * 0.22, r * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }

  if (c.faceType === "beak") {
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(-r * 0.16, -r * 0.05);
    ctx.lineTo(r * 0.16, -r * 0.05);
    ctx.lineTo(0, r * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, r * 0.02, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  if (c.earType === "crown") {
    ctx.fillStyle = "#facc15";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.88);
    ctx.lineTo(-r * 0.42, -r * 1.35);
    ctx.lineTo(-r * 0.15, -r * 1.05);
    ctx.lineTo(0, -r * 1.42);
    ctx.lineTo(r * 0.15, -r * 1.05);
    ctx.lineTo(r * 0.42, -r * 1.35);
    ctx.lineTo(r * 0.5, -r * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (c.earType === "leaf") {
    ctx.fillStyle = "#22c55e";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.88);
    ctx.quadraticCurveTo(r * 0.55, -r * 1.42, r * 0.62, -r * 0.92);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.78, 0, -r * 0.88);
    ctx.fill();
    ctx.stroke();
  } else if (c.earType === "unicorn") {
    ctx.fillStyle = "#fef08a";
    ctx.strokeStyle = "#0a0f1d";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, -r * 0.88);
    ctx.lineTo(0, -r * 1.52);
    ctx.lineTo(r * 0.18, -r * 0.88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// Expose globally for non-module scripts or console inspection
window.BERRY_DATA = { characters: CHARACTERS };
window.drawChubbyCharacter = drawChubbyCharacter;
