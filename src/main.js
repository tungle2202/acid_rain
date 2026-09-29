import "./style.css";
import { initI18n, t } from "./i18n.js";
import { chemistryEngine, MOLECULES } from "./chemistry.js";
import {
  Fish,
  FishSkeleton,
  SmokeParticle,
  drawSoil,
  drawTree,
  drawLake,
  drawFactory,
  drawVolcano,
  drawSmokeOuterBorderGlow,
  drawEiffelTower,
  drawMoaiStatue,
  isPointInFactory,
  isPointInVolcano,
  isPointInSmoke,
  isPointInEiffel,
  isPointInMoai,
} from "./environment.js";
import {
  FloatingMolecule,
  ReactionBurst,
  layoutMoleculesGrid,
  findFreePosition,
} from "./moleculePlayground.js";

// ========================================================
// APPLICATION STATE
// ========================================================
const state = {
  productivity: 70, // Factory productivity 10-100
  rainIntensity: 50,
  so2: 70,
  nox: 60,
  rainPh: 4.2,
  lakePh: 5.4,
  hoverTarget: null, // 'factory' | 'volcano' | 'smoke' | 'eiffel' | 'moai' | null
  activeView: "overview", // 'overview' | 'research'
  researchTarget: "smoke", // 'smoke' | 'eiffel' | 'moai'
  factoryPanelOpen: false,
  treeModalOpen: false,
  landscapePan: 0, // 0.0 (left: volcano/factory) to 1.0 (right: eiffel/moai)
  panOffset: 0, // camera horizontal offset in world coordinates
  isPanning: false,
  hasDragged: false,
  panStartX: 0,
  panStartOffset: 0,
  mouseScreenX: 0,
  mouseScreenY: 0,
  camera: {
    zoom: 1.0,
    targetZoom: 1.0,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  },
  volcano: {
    x: 16,
    y: 0,
    width: 150,
    height: 160,
    isErupting: false,
    eruptionTimer: 0,
    lavaSparks: [],
  },
  eiffel: {
    x: 1140,
    y: 0,
    width: 170,
    height: 280,
  },
  moai: {
    x: 1460,
    y: 0,
    width: 130,
    height: 210,
  },
  draggedMolecule: null,
  hoveredMolecule: null,
};

// ========================================================
// CANVAS & ENTITIES
// ========================================================
const canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");
const killFeed = document.getElementById("kill-feed");

let width = 0;
let height = 0;
let groundY = 0;
let worldWidth = 1850;
let lakeStartX = 540;
let lakeEndX = 980;

// Unified smoke particles (factory + volcano merged into single sky cloud)
const smokeParticles = [];
let liveFishes = [];
const deadSkeletons = [];
const bubbles = [];
const rainDrops = [];

// Floating geometric molecules & bursts for research mode
let floatingMolecules = [];
const reactionBursts = [];

const factory = {
  x: 180,
  y: 0,
  width: 175,
  height: 160,
};

let lakeBounds = {
  x: 540,
  y: 0,
  width: 440,
  height: 0,
};

function resize() {
  const container = canvas.parentElement;
  if (!container) return;
  width = container.clientWidth;
  height = container.clientHeight;
  canvas.width = width;
  canvas.height = height;

  groundY = Math.floor(height * 0.72);
  worldWidth = Math.max(1850, Math.floor(width * 1.85));

  // Position Volcano on the very left
  state.volcano.x = 16;
  state.volcano.y = groundY - 145;
  state.volcano.height = height - state.volcano.y;

  // Position Factory to the right of the volcano
  factory.x = state.volcano.x + state.volcano.width + 12;
  factory.y = groundY - 145;
  factory.height = height - factory.y;

  // Lake bounds between left bank and right bank
  lakeStartX = 540;
  lakeEndX = 980;
  lakeBounds = {
    x: lakeStartX,
    y: groundY + 18,
    width: lakeEndX - lakeStartX,
    height: height - (groundY + 18),
  };

  // Eiffel Tower on the right side of the lake
  state.eiffel.width = 170;
  state.eiffel.height = 280;
  state.eiffel.x = 1140;
  state.eiffel.y = groundY - state.eiffel.height;

  // Moai Statue to the right of Eiffel Tower
  state.moai.width = 130;
  state.moai.height = 210;
  state.moai.x = 1460;
  state.moai.y = groundY - state.moai.height;

  // Re-link fish lake bounds
  for (const f of liveFishes) {
    f.lake = lakeBounds;
  }
  for (const s of deadSkeletons) {
    s.lake = lakeBounds;
  }

  // Update pan offset if in overview
  const maxPanX = Math.max(0, worldWidth - width);
  state.panOffset = state.landscapePan * maxPanX;
  if (state.activeView === "overview") {
    state.camera.targetX = state.panOffset;
  }

  // Rain across full panoramic width
  if (rainDrops.length === 0) {
    const rainCount = Math.floor(worldWidth * 0.1);
    for (let i = 0; i < rainCount; i++) {
      rainDrops.push({
        x: Math.random() * worldWidth,
        y: Math.random() * height,
        speed: 4 + Math.random() * 5,
        len: 12 + Math.random() * 12,
      });
    }
  }
}

window.addEventListener("resize", resize);
resize();

// ========================================================
// ECOLOGY & METRICS (LAKE PH, FISH POPULATION, DEAD SKELETONS)
// ========================================================
function updateEcologyMetrics() {
  const emissionSum = state.so2 * 0.6 + state.nox * 0.4;

  // Rain pH
  const rPh = Math.max(2.8, (6.5 - (emissionSum / 100) * 3.5)).toFixed(1);
  state.rainPh = parseFloat(rPh);

  // Lake pH
  const lPh = Math.max(3.2, (7.0 - (emissionSum / 100) * 3.6)).toFixed(1);
  state.lakePh = parseFloat(lPh);

  // Update UI cards
  const phEl = document.getElementById("ph-metric");
  const phStatus = document.getElementById("ph-status");
  if (phEl) phEl.textContent = rPh;
  if (phStatus) {
    if (state.rainPh < 4.1) {
      phStatus.textContent = t("metrics_status.rain_apocalypse");
      phStatus.className = "metric-status danger-text";
    } else if (state.rainPh < 5.0) {
      phStatus.textContent = t("metrics_status.rain_severe");
      phStatus.className = "metric-status danger-text";
    } else {
      phStatus.textContent = t("metrics_status.rain_normal");
      phStatus.className = "metric-status";
    }
  }

  const lakeEl = document.getElementById("lake-metric");
  const lakeStatus = document.getElementById("lake-status");
  if (lakeEl) lakeEl.textContent = lPh;
  if (lakeStatus) {
    if (state.lakePh < 4.8) {
      lakeStatus.textContent = t("metrics_status.lake_mortality");
      lakeStatus.className = "metric-status danger-text";
    } else if (state.lakePh < 5.8) {
      lakeStatus.textContent = t("metrics_status.lake_stress");
      lakeStatus.className = "metric-status text-danger";
    } else {
      lakeStatus.textContent = t("metrics_status.lake_thriving");
      lakeStatus.className = "metric-status";
    }
  }

  const treeEl = document.getElementById("tree-metric");
  const treeStatus = document.getElementById("tree-status");
  if (treeEl) {
    const health = state.rainPh < 4.1 ? 0 : Math.max(25, Math.floor(100 - (emissionSum / 100) * 55));
    treeEl.textContent = `${health}%`;
    if (treeStatus) {
      treeStatus.textContent =
        state.rainPh < 4.1
          ? t("metrics_status.tree_dead")
          : state.rainPh < 5.0
          ? t("metrics_status.tree_chlorosis")
          : t("metrics_status.tree_healthy");
      treeStatus.className = state.rainPh < 4.1 ? "metric-status danger-text" : "metric-status";
    }
  }

  // Adjust Fish Population & Dead Skeletons based on Lake pH
  syncFishPopulation();
}

function syncFishPopulation() {
  if (lakeBounds.width <= 0) return;

  let targetLive = 6;
  let targetSkeletons = 0;

  if (state.lakePh >= 6.0) {
    targetLive = 7;
    targetSkeletons = 0;
  } else if (state.lakePh >= 5.0) {
    targetLive = 4;
    targetSkeletons = 0;
  } else if (state.lakePh >= 4.4) {
    targetLive = 1;
    targetSkeletons = 3;
  } else {
    // Insanely low pH (< 4.4): All fish die! Floating skeletons appear
    targetLive = 0;
    targetSkeletons = 5;
  }

  // Sync live fishes
  while (liveFishes.length < targetLive) {
    liveFishes.push(new Fish(lakeBounds));
  }
  while (liveFishes.length > targetLive) {
    liveFishes.pop();
  }

  // Sync dead skeletons
  while (deadSkeletons.length < targetSkeletons) {
    deadSkeletons.push(new FishSkeleton(lakeBounds));
  }
  while (deadSkeletons.length > targetSkeletons) {
    deadSkeletons.pop();
  }
}

// Initial fish population
syncFishPopulation();

// ========================================================
// SIMULATION RENDERING LOOP
// ========================================================
let lastFactorySmoke = 0;
let lastVolcanoSmoke = 0;
let simTime = 0;

function render() {
  simTime += 16.6;

  // 1. Smooth Camera Interpolation
  const cam = state.camera;
  cam.zoom += (cam.targetZoom - cam.zoom) * 0.08;
  cam.x += (cam.targetX - cam.x) * 0.08;
  cam.y += (cam.targetY - cam.y) * 0.08;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Apply Camera Transform
  ctx.translate(width / 2, height / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-width / 2 - cam.x, -height / 2 - cam.y);

  // 2. Sky Atmosphere (Dark Atmospheric Sky spanning full panoramic world)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, "#080d14");
  skyGrad.addColorStop(0.6, "#132133");
  skyGrad.addColorStop(1, "#1c2e42");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, worldWidth, groundY);

  // 3. Smoke Emissions (Factory & Volcano merging into single pile)
  lastFactorySmoke++;
  const emitInterval = Math.max(2, Math.floor(14 - (state.productivity / 100) * 11));
  if (lastFactorySmoke >= emitInterval) {
    lastFactorySmoke = 0;
    smokeParticles.push(new SmokeParticle(factory.x + 30, factory.y - 62, state.productivity, false));
    if (state.productivity > 40) {
      smokeParticles.push(new SmokeParticle(factory.x + 72, factory.y - 44, state.productivity, false));
    }
  }

  // Volcano Eruption updates
  if (state.volcano.isErupting) {
    state.volcano.eruptionTimer--;
    lastVolcanoSmoke++;

    if (lastVolcanoSmoke >= 3) {
      lastVolcanoSmoke = 0;
      const craterX = state.volcano.x + state.volcano.width * 0.5;
      const craterY = state.volcano.y;
      smokeParticles.push(new SmokeParticle(craterX, craterY, 95, true));
      smokeParticles.push(new SmokeParticle(craterX + (Math.random() - 0.5) * 20, craterY - 10, 95, true));
    }

    if (Math.random() > 0.4) {
      const craterX = state.volcano.x + state.volcano.width * 0.5;
      state.volcano.lavaSparks.push({
        x: craterX + (Math.random() - 0.5) * 14,
        y: state.volcano.y,
        vx: (Math.random() - 0.5) * 4.5,
        vy: -(4.5 + Math.random() * 5),
        radius: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? "#facc15" : "#f97316",
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    }

    if (state.volcano.eruptionTimer <= 0) {
      state.volcano.isErupting = false;
    }
  }

  // 4. Draw Unified Merged Smoke Particles
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const p = smokeParticles[i];
    p.update();
    p.draw(ctx);
    if (p.isDead()) {
      smokeParticles.splice(i, 1);
    }
  }

  // 5. Draw OUTSIDE BORDER GLOW ONLY if smoke is hovered (No inner glow)
  if (state.hoverTarget === "smoke") {
    drawSmokeOuterBorderGlow(ctx, smokeParticles);
  }

  // 6. Volcano (Far Left) & Factory (to its right)
  // Drawn BEFORE soil so soil cleanly hides their underground lower bases!
  const isVolcanoHovered = state.hoverTarget === "volcano";
  drawVolcano(
    ctx,
    state.volcano,
    isVolcanoHovered,
    state.volcano.isErupting,
    state.volcano.lavaSparks
  );

  const isFactoryHovered = state.hoverTarget === "factory";
  drawFactory(ctx, factory, isFactoryHovered);

  // 7. Raindrops spanning full panoramic landscape
  if (state.rainIntensity > 0) {
    const isAcidic = state.rainPh < 4.8;
    ctx.strokeStyle = isAcidic ? "rgba(248, 113, 113, 0.45)" : "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (const r of rainDrops) {
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x + 1.2, r.y + r.len);
      r.y += r.speed * (state.rainIntensity / 50);
      r.x += 0.8;
      if (r.y > groundY + 50) {
        r.y = -r.len;
        r.x = Math.random() * worldWidth;
      }
    }
    ctx.stroke();
  }

  // 8. Soil & Terrain (Drawn OVER factory & volcano bases to hide underground parts)
  drawSoil(ctx, worldWidth, height, groundY, lakeStartX, lakeEndX);

  // 9. Lake & Aquatic Life (Live Fish vs Dead Floating Skeletons)
  drawLake(ctx, height, groundY, simTime, bubbles, lakeStartX, lakeEndX);

  const isFishStressed = state.lakePh < 5.8;
  for (const f of liveFishes) {
    f.update(bubbles, isFishStressed);
    f.draw(ctx, isFishStressed);
  }

  // Draw floating dead skeletons if lake is severely acidic
  for (const s of deadSkeletons) {
    s.update(simTime);
    s.draw(ctx);
  }

  // 10. Left Bank Trees
  drawTree(ctx, 390, groundY, 1.05, state.rainPh);
  drawTree(ctx, 465, groundY, 0.9, state.rainPh);

  // 11. Eiffel Tower (Metal) & Moai Statue (Rock) on Right Bank
  drawEiffelTower(ctx, state.eiffel, state.hoverTarget === "eiffel", state.rainPh);
  drawMoaiStatue(ctx, state.moai, state.hoverTarget === "moai", state.rainPh);

  // 12. Right Bank Trees
  drawTree(ctx, 1040, groundY, 0.95, state.rainPh);
  drawTree(ctx, 1360, groundY, 1.0, state.rainPh);
  drawTree(ctx, 1660, groundY, 1.1, state.rainPh);
  drawTree(ctx, 1750, groundY, 0.85, state.rainPh);

  // 13. Research Mode: Stationary Geometric Molecules & Reaction Bursts
  if (cam.zoom > 1.4) {
    drawMoleculePlayground(ctx);
  }

  ctx.restore();

  // 14. Floating Hover Tooltip (drawn on top of screen in overview mode)
  drawHoverTooltip(ctx, state.hoverTarget, state.mouseScreenX, state.mouseScreenY);

  requestAnimationFrame(render);
}

// ========================================================
// HOVER TOOLTIPS IN OVERVIEW MODE
// ========================================================
function drawHoverTooltip(ctx, target, mouseX, mouseY) {
  if (!target || state.activeView !== "overview" || state.isPanning) return;
  let text = "";
  if (target === "volcano") text = t("dock.hover_volcano");
  else if (target === "factory") text = t("dock.hover_factory");
  else if (target === "smoke") text = t("dock.hover_smoke");
  else if (target === "eiffel") text = t("dock.hover_eiffel");
  else if (target === "moai") text = t("dock.hover_moai");
  if (!text) return;

  ctx.save();
  ctx.font = "600 12px Inter, system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const textW = metrics.width;
  const padX = 10;
  const boxW = textW + padX * 2;
  const boxH = 26;

  let tipX = mouseX - boxW / 2;
  let tipY = mouseY - 36;
  if (tipX < 10) tipX = 10;
  if (tipX + boxW > width - 10) tipX = width - boxW - 10;
  if (tipY < 10) tipY = mouseY + 24;

  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.strokeStyle = target === "moai" ? "rgba(192, 132, 252, 0.8)" : "rgba(56, 189, 248, 0.8)";
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.roundRect(tipX, tipY, boxW, boxH, 6);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, tipX + boxW / 2, tipY + boxH / 2);
  ctx.restore();
}

// ========================================================
// RESEARCH MODE: GEOMETRIC MOLECULE PLAYGROUND
// ========================================================
function getResearchBounds() {
  if (state.researchTarget === "eiffel") {
    return {
      x: state.eiffel.x - 70,
      y: state.eiffel.y + 10,
      width: state.eiffel.width + 140,
      height: 240,
    };
  } else if (state.researchTarget === "moai") {
    return {
      x: state.moai.x - 70,
      y: state.moai.y + 10,
      width: state.moai.width + 140,
      height: 220,
    };
  } else {
    // smoke plume
    return {
      x: state.volcano.x + 40,
      y: factory.y - 280,
      width: 360,
      height: 250,
    };
  }
}

function initMoleculePlayground() {
  const bounds = getResearchBounds();
  let types = [];
  if (state.researchTarget === "eiffel") {
    // Iron framework with acid rain agents
    types = ["Fe", "H2SO4", "HNO3", "Fe", "H2SO4", "HNO3", "O2"];
  } else if (state.researchTarget === "moai") {
    // Calcite volcanic rock with acid rain agents
    types = ["CaCO3", "H2SO4", "HNO3", "CaCO3", "H2SO4", "HNO3"];
  } else {
    // Tropospheric smoke pollutants
    types = ["SO2", "O2", "H2O", "NO", "SO2", "O2", "H2O", "NO"];
  }
  floatingMolecules = layoutMoleculesGrid(types, bounds);
}

function drawMoleculePlayground(ctx) {
  // Reaction bursts
  for (let i = reactionBursts.length - 1; i >= 0; i--) {
    const b = reactionBursts[i];
    b.update();
    b.draw(ctx);
    if (b.isDead()) {
      reactionBursts.splice(i, 1);
    }
  }

  // Bonding attraction line when dragging close to another molecule
  if (state.draggedMolecule) {
    for (const m of floatingMolecules) {
      if (m === state.draggedMolecule) continue;
      const dist = Math.hypot(m.x - state.draggedMolecule.x, m.y - state.draggedMolecule.y);
      if (dist < 80) {
        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 80})`;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(state.draggedMolecule.x, state.draggedMolecule.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Draw stationary molecules (Labels hidden by default, shown ONLY on hover/drag)
  for (const m of floatingMolecules) {
    const isHovered = m === state.hoveredMolecule;
    m.draw(ctx, isHovered);
  }
}

requestAnimationFrame(render);

// ========================================================
// PANORAMIC SLIDER & CANVAS CONTROLS
// ========================================================
const panSlider = document.getElementById("landscape-pan-slider");
const panLeftBtn = document.getElementById("pan-left-btn");
const panRightBtn = document.getElementById("pan-right-btn");

function setLandscapePan(ratio) {
  state.landscapePan = Math.max(0, Math.min(1, ratio));
  const maxPanX = Math.max(0, worldWidth - width);
  state.panOffset = state.landscapePan * maxPanX;
  if (state.activeView === "overview") {
    state.camera.targetX = state.panOffset;
  }
  if (panSlider && document.activeElement !== panSlider) {
    panSlider.value = Math.round(state.landscapePan * 100);
  }
}

if (panSlider) {
  panSlider.addEventListener("input", (e) => {
    setLandscapePan(Number(e.target.value) / 100);
  });
}

if (panLeftBtn) {
  panLeftBtn.addEventListener("click", () => {
    setLandscapePan(state.landscapePan - 0.25);
  });
}

if (panRightBtn) {
  panRightBtn.addEventListener("click", () => {
    setLandscapePan(state.landscapePan + 0.25);
  });
}

// ========================================================
// MOUSE & HOVER INTERACTION
// ========================================================
function getSmokeBounds() {
  return {
    x: state.volcano.x,
    y: factory.y - 280,
    width: 380,
    height: 280,
  };
}

function screenToWorld(screenX, screenY) {
  const cam = state.camera;
  return {
    x: (screenX - width / 2) / cam.zoom + width / 2 + cam.x,
    y: (screenY - height / 2) / cam.zoom + height / 2 + cam.y,
  };
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  state.mouseScreenX = screenX;
  state.mouseScreenY = screenY;
  const { x: worldX, y: worldY } = screenToWorld(screenX, screenY);

  // If in research view: handle dragging or molecule hover for label reveal
  if (state.activeView === "research") {
    if (state.draggedMolecule) {
      state.draggedMolecule.x = worldX + state.draggedMolecule.dragOffsetX;
      state.draggedMolecule.y = worldY + state.draggedMolecule.dragOffsetY;
      return;
    }

    // Check molecule hover to reveal label
    let foundHovered = null;
    for (let i = floatingMolecules.length - 1; i >= 0; i--) {
      if (floatingMolecules[i].contains(worldX, worldY)) {
        foundHovered = floatingMolecules[i];
        break;
      }
    }
    state.hoveredMolecule = foundHovered;
    canvas.style.cursor = foundHovered ? "grab" : "default";
    return;
  }

  // Handle canvas drag-panning in overview
  if (state.isPanning) {
    const dx = screenX - state.panStartX;
    if (Math.abs(dx) > 5) {
      state.hasDragged = true;
    }
    const maxPanX = Math.max(0, worldWidth - width);
    if (maxPanX > 0) {
      const newOffset = state.panStartOffset - dx;
      setLandscapePan(newOffset / maxPanX);
    }
    return;
  }

  // Overview hover checking
  let newHover = null;
  if (isPointInVolcano(worldX, worldY, state.volcano)) {
    newHover = "volcano";
  } else if (isPointInFactory(worldX, worldY, factory)) {
    newHover = "factory";
  } else if (isPointInSmoke(worldX, worldY, smokeParticles, getSmokeBounds())) {
    newHover = "smoke";
  } else if (isPointInEiffel(worldX, worldY, state.eiffel)) {
    newHover = "eiffel";
  } else if (isPointInMoai(worldX, worldY, state.moai)) {
    newHover = "moai";
  }

  if (newHover !== state.hoverTarget) {
    state.hoverTarget = newHover;
    canvas.style.cursor = state.hoverTarget ? "pointer" : "default";
  }
});

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const screenX = e.clientX - rect.left;
  const screenY = e.clientY - rect.top;
  const { x: worldX, y: worldY } = screenToWorld(screenX, screenY);

  if (state.activeView === "research") {
    for (let i = floatingMolecules.length - 1; i >= 0; i--) {
      const m = floatingMolecules[i];
      if (m.contains(worldX, worldY)) {
        state.draggedMolecule = m;
        m.isDragging = true;
        m.dragOffsetX = m.x - worldX;
        m.dragOffsetY = m.y - worldY;
        canvas.style.cursor = "grabbing";
        break;
      }
    }
  } else if (state.activeView === "overview") {
    // Start drag-panning
    state.hasDragged = false;
    state.isPanning = true;
    state.panStartX = screenX;
    state.panStartOffset = state.panOffset;
  }
});

canvas.addEventListener("wheel", (e) => {
  if (state.activeView !== "overview") return;
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  const maxPanX = Math.max(0, worldWidth - width);
  if (maxPanX <= 0) return;
  e.preventDefault();
  const panStep = delta / maxPanX;
  setLandscapePan(state.landscapePan + panStep * 0.4);
}, { passive: false });

window.addEventListener("mouseup", () => {
  if (state.isPanning) {
    state.isPanning = false;
  }

  if (!state.draggedMolecule) return;

  const dragged = state.draggedMolecule;
  dragged.isDragging = false;
  state.draggedMolecule = null;
  canvas.style.cursor = "default";

  // Check collision with other molecules
  for (let i = floatingMolecules.length - 1; i >= 0; i--) {
    const target = floatingMolecules[i];
    if (target === dragged) continue;

    const dist = Math.hypot(target.x - dragged.x, target.y - dragged.y);
    if (dist < dragged.radius + target.radius + 18) {
      const result = chemistryEngine.checkReaction(dragged.molType, target.molType);

      if (result && result.success) {
        // Synthesis explosion!
        const midX = (dragged.x + target.x) / 2;
        const midY = (dragged.y + target.y) / 2;
        const color = MOLECULES[result.product]?.color || "#fbbf24";
        reactionBursts.push(new ReactionBurst(midX, midY, color));

        const reactant1Type = dragged.molType;
        const reactant2Type = target.molType;

        // Remove reactants
        const idx1 = floatingMolecules.indexOf(dragged);
        if (idx1 !== -1) floatingMolecules.splice(idx1, 1);
        const idx2 = floatingMolecules.indexOf(target);
        if (idx2 !== -1) floatingMolecules.splice(idx2, 1);

        // Spawn product molecule
        floatingMolecules.push(new FloatingMolecule(result.product, midX, midY));

        // Auto-replenish reactants based on active research target
        const bounds = getResearchBounds();
        const replenish = (type) => {
          const pos = findFreePosition(floatingMolecules, bounds);
          floatingMolecules.push(new FloatingMolecule(type, pos.x, pos.y));
        };

        if (state.researchTarget === "eiffel") {
          if (reactant1Type === "Fe" || reactant2Type === "Fe") replenish("Fe");
          if (reactant1Type === "H2SO4" || reactant2Type === "H2SO4") replenish("H2SO4");
          if (reactant1Type === "HNO3" || reactant2Type === "HNO3") replenish("HNO3");
          if (reactant1Type === "O2" || reactant2Type === "O2") replenish("O2");
        } else if (state.researchTarget === "moai") {
          if (reactant1Type === "CaCO3" || reactant2Type === "CaCO3") replenish("CaCO3");
          if (reactant1Type === "H2SO4" || reactant2Type === "H2SO4") replenish("H2SO4");
          if (reactant1Type === "HNO3" || reactant2Type === "HNO3") replenish("HNO3");
        } else {
          if (reactant1Type === "H2O" || reactant2Type === "H2O") replenish("H2O");
          if (reactant1Type === "O2" || reactant2Type === "O2") replenish("O2");
          if (reactant1Type === "SO2" || reactant2Type === "SO2") replenish("SO2");
          if (reactant1Type === "NO" || reactant2Type === "NO") replenish("NO");
        }

        // Trigger Kill-Feed
        triggerKillFeed(result);

        // Update Advancement Tree
        renderAdvancementTree();
        return;
      }
    }
  }
});

canvas.addEventListener("mouseleave", () => {
  state.hoverTarget = null;
  canvas.style.cursor = "default";
});

// ========================================================
// CLICK HANDLING: VOLCANO, FACTORY, SMOKE, EIFFEL, MOAI
// ========================================================
canvas.addEventListener("click", () => {
  if (state.activeView === "research") return;
  if (state.hasDragged) {
    state.hasDragged = false;
    return;
  }

  if (state.hoverTarget === "volcano") {
    // Direct eruption! No caution, no pop-up, no panel.
    triggerVolcanoEruption();
  } else if (state.hoverTarget === "factory") {
    // Focus factory: Show productivity controller in left panel
    openFactoryPanel();
  } else if (state.hoverTarget === "smoke") {
    openResearchMode("smoke");
  } else if (state.hoverTarget === "eiffel") {
    openResearchMode("eiffel");
  } else if (state.hoverTarget === "moai") {
    openResearchMode("moai");
  } else {
    // Clicking canvas outside hides focused factory panel
    if (state.factoryPanelOpen) {
      closeFactoryPanel();
    }
  }
});

// ========================================================
// DIRECT VOLCANO ERUPTION
// ========================================================
function triggerVolcanoEruption() {
  state.volcano.isErupting = true;
  state.volcano.eruptionTimer = 240;

  // Immediate surge in environmental SO2 and NOx emissions
  state.so2 = Math.min(100, state.so2 + 25);
  state.nox = Math.min(100, state.nox + 20);

  updateEcologyMetrics();
}

// ========================================================
// KILL-FEED SYSTEM (FPS SHOOTING GAME STYLE)
// ========================================================
function triggerKillFeed(result) {
  if (!killFeed) return;

  const card = document.createElement("div");
  const isAcid = result.product === "H2SO4" || result.product === "HNO3";
  const isMetalSalt = result.product === "FeSO4" || result.product === "Fe(NO3)2";
  const isRust = result.product === "Fe2O3";
  const isStoneSalt = result.product === "CaSO4" || result.product === "Ca(NO3)2";

  let tagText = t("kill_feed.oxidized");
  let tagClass = "";
  if (isAcid) {
    tagText = t("kill_feed.acid_formed");
    tagClass = "acid";
  } else if (isMetalSalt) {
    tagText = t("kill_feed.metal_corroded");
    tagClass = "corrosion";
  } else if (isRust) {
    tagText = t("kill_feed.rust_formed");
    tagClass = "rust";
  } else if (isStoneSalt) {
    tagText = t("kill_feed.stone_eroded");
    tagClass = "eroded";
  }

  card.className = `kf-entry ${isAcid || isMetalSalt || isStoneSalt ? "legendary" : ""}`;
  card.innerHTML = `
    <div class="kf-main-row">
      <span class="kf-reactants">${result.advancement.reaction.reactants.join(" + ")}</span>
      <span class="kf-symbol">⚡➔</span>
      <span class="kf-product">${result.product}</span>
      <span class="kf-tag ${tagClass}">${tagText}</span>
    </div>
    <div class="kf-title">${result.advancement.title} (${result.advancement.reaction.equation})</div>
  `;

  killFeed.prepend(card);

  setTimeout(() => {
    card.classList.add("fade-out");
    setTimeout(() => {
      card.remove();
    }, 450);
  }, 3800);
}

// ========================================================
// RESEARCH MODE & DYNAMIC SPAWNERS
// ========================================================
const researchTopBar = document.getElementById("research-top-bar");
const backToEnvBtn = document.getElementById("back-to-env-btn");
const resetMoleculesBtn = document.getElementById("reset-molecules-btn");

function spawnMolecule(type) {
  const bounds = getResearchBounds();
  const pos = findFreePosition(floatingMolecules, bounds);
  floatingMolecules.push(new FloatingMolecule(type, pos.x, pos.y));
}

function setupSpawnerButtons(target) {
  const container = document.getElementById("spawner-buttons-container");
  if (!container) return;
  container.innerHTML = "";

  let types = [];
  if (target === "eiffel") {
    types = ["Fe", "H2SO4", "HNO3", "O2"];
  } else if (target === "moai") {
    types = ["CaCO3", "H2SO4", "HNO3"];
  } else {
    types = ["SO2", "NO2", "H2O", "O2"];
  }

  types.forEach((type) => {
    const btn = document.createElement("button");
    btn.className = "spawn-btn";
    btn.setAttribute("data-type", type);
    const mol = MOLECULES[type];
    btn.textContent = `+ ${mol?.formula || type}`;
    btn.addEventListener("click", () => spawnMolecule(type));
    container.appendChild(btn);
  });
}

function openResearchMode(target = "smoke") {
  state.activeView = "research";
  state.researchTarget = target;

  if (target === "eiffel") {
    state.camera.targetZoom = 2.2;
    state.camera.targetX = state.eiffel.x + state.eiffel.width * 0.5 - width / 2;
    state.camera.targetY = state.eiffel.y + state.eiffel.height * 0.45 - height / 2;
    const titleEl = document.getElementById("rt-title");
    if (titleEl) titleEl.textContent = t("research_bar.title_eiffel");
  } else if (target === "moai") {
    state.camera.targetZoom = 2.3;
    state.camera.targetX = state.moai.x + state.moai.width * 0.5 - width / 2;
    state.camera.targetY = state.moai.y + state.moai.height * 0.45 - height / 2;
    const titleEl = document.getElementById("rt-title");
    if (titleEl) titleEl.textContent = t("research_bar.title_moai");
  } else {
    state.camera.targetZoom = 2.4;
    state.camera.targetX = state.volcano.x + 150 - width / 2;
    state.camera.targetY = factory.y - 140 - height / 2;
    const titleEl = document.getElementById("rt-title");
    if (titleEl) titleEl.textContent = t("research_bar.title_smoke");
  }

  // Hide pan slider while focused in research
  const panBar = document.getElementById("landscape-pan-bar");
  if (panBar) panBar.classList.add("hidden");

  researchTopBar.classList.remove("hidden");
  closeFactoryPanel();
  closeTreeModal();

  setupSpawnerButtons(target);
  initMoleculePlayground();
}

function closeResearchMode() {
  state.activeView = "overview";

  state.camera.targetZoom = 1.0;
  state.camera.targetX = state.panOffset;
  state.camera.targetY = 0;

  // Restore pan slider in overview mode
  const panBar = document.getElementById("landscape-pan-bar");
  if (panBar) panBar.classList.remove("hidden");

  researchTopBar.classList.add("hidden");
  state.hoveredMolecule = null;
  state.draggedMolecule = null;
}

if (backToEnvBtn) {
  backToEnvBtn.addEventListener("click", closeResearchMode);
}

if (resetMoleculesBtn) {
  resetMoleculesBtn.addEventListener("click", initMoleculePlayground);
}

// ========================================================
// FACTORY CONTROLLER (LEFT PANEL - SHOWN ONLY WHEN FOCUSED)
// ========================================================
const factoryPanel = document.getElementById("factory-panel");
const closeFactoryBtn = document.getElementById("close-factory-btn");
const productivitySlider = document.getElementById("factory-productivity");
const productivityVal = document.getElementById("productivity-val");
const smokeDensityText = document.getElementById("smoke-density-text");
const so2RateText = document.getElementById("so2-rate-text");
const noxRateText = document.getElementById("nox-rate-text");
const thermalVal = document.getElementById("thermal-val");

function openFactoryPanel() {
  state.factoryPanelOpen = true;
  factoryPanel.classList.remove("hidden");
  closeTreeModal();
}

function closeFactoryPanel() {
  state.factoryPanelOpen = false;
  factoryPanel.classList.add("hidden");
}

if (closeFactoryBtn) {
  closeFactoryBtn.addEventListener("click", closeFactoryPanel);
}

function updateProductivity(val) {
  state.productivity = Number(val);
  if (productivityVal) productivityVal.textContent = `${state.productivity}%`;
  if (productivitySlider) productivitySlider.value = state.productivity;

  for (const p of smokeParticles) {
    p.updateShade(state.productivity);
  }

  const so2Kg = Math.floor(state.productivity * 2.1);
  const noxKg = Math.floor(state.productivity * 1.4);
  const mw = Math.floor(300 + state.productivity * 8);

  if (so2RateText) so2RateText.textContent = `${so2Kg} kg/h`;
  if (noxRateText) noxRateText.textContent = `${noxKg} kg/h`;
  if (thermalVal) thermalVal.textContent = `${mw} MW`;

  if (smokeDensityText) {
    if (state.productivity < 35) {
      smokeDensityText.textContent = t("metrics_status.smoke_light");
      smokeDensityText.className = "val";
    } else if (state.productivity < 70) {
      smokeDensityText.textContent = t("metrics_status.smoke_moderate");
      smokeDensityText.className = "val";
    } else {
      smokeDensityText.textContent = t("metrics_status.smoke_dense");
      smokeDensityText.className = "val text-danger";
    }
  }

  state.so2 = state.productivity;
  state.nox = Math.floor(state.productivity * 0.85);

  const so2Input = document.getElementById("so2-emissions");
  const noxInput = document.getElementById("nox-emissions");
  if (so2Input) so2Input.value = state.so2;
  if (noxInput) noxInput.value = state.nox;

  updateEcologyMetrics();
}

if (productivitySlider) {
  productivitySlider.addEventListener("input", (e) => updateProductivity(e.target.value));
}

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-val");
    if (val) updateProductivity(val);
  });
});

// ========================================================
// MINECRAFT ADVANCEMENT TECH TREE MODAL
// ========================================================
const treeModal = document.getElementById("tree-modal");
const treeBackdrop = document.getElementById("tree-backdrop");
const openTreeBtn = document.getElementById("open-tree-btn");
const closeTreeBtn = document.getElementById("close-tree-btn");
const mcTreeGrid = document.getElementById("mc-tree-grid");
const mcXpLevel = document.getElementById("mc-xp-level");
const mcXpFill = document.getElementById("mc-xp-fill");
const mcXpText = document.getElementById("mc-xp-text");

function openTreeModal() {
  state.treeModalOpen = true;
  treeModal.classList.remove("hidden");
  closeFactoryPanel();
  renderAdvancementTree();
}

function closeTreeModal() {
  state.treeModalOpen = false;
  treeModal.classList.add("hidden");
}

if (openTreeBtn) {
  openTreeBtn.addEventListener("click", openTreeModal);
}
if (closeTreeBtn) {
  closeTreeBtn.addEventListener("click", closeTreeModal);
}
if (treeBackdrop) {
  treeBackdrop.addEventListener("click", closeTreeModal);
}

function renderAdvancementTree() {
  if (!mcTreeGrid) return;
  mcTreeGrid.innerHTML = "";

  const nodes = chemistryEngine.advancements;
  const progress = chemistryEngine.getProgress();

  if (mcXpLevel) mcXpLevel.textContent = t("tech_tree_modal.level", { level: progress.completed });
  if (mcXpFill) mcXpFill.style.width = `${progress.percent}%`;
  if (mcXpText) {
    mcXpText.textContent = t("tech_tree_modal.progress", {
      completed: progress.completed,
      total: progress.total,
      percent: progress.percent,
    });
  }

  for (const n of nodes) {
    const isUnlocked = n.unlocked;
    const isLegendary = n.tier === "legendary";

    const nodeEl = document.createElement("div");
    nodeEl.className = `mc-node ${isUnlocked ? "unlocked" : "locked"} ${isLegendary ? "legendary" : ""}`;

    const badgeText = isUnlocked ? t("tech_tree_modal.badge_done") : t("tech_tree_modal.badge_locked");
    const descText = isUnlocked ? n.desc : t("tech_tree_modal.locked_desc");

    nodeEl.innerHTML = `
      <div class="mc-frame-box">${isUnlocked ? n.icon : "🔒"}</div>
      <div class="mc-node-info">
        <div class="mc-node-header">
          <span class="mc-node-title">${n.title}</span>
          <span class="mc-badge ${isUnlocked ? "done" : "lock"}">${badgeText}</span>
        </div>
        <span class="mc-node-sub">${n.subtitle}</span>
        <p class="mc-node-desc">${descText}</p>
      </div>
    `;

    mcTreeGrid.appendChild(nodeEl);
  }
}

// Global Keyboard Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (state.activeView === "research") {
      closeResearchMode();
    } else if (state.treeModalOpen) {
      closeTreeModal();
    } else if (state.factoryPanelOpen) {
      closeFactoryPanel();
    }
  }
});

// ========================================================
// SIDEBAR SLIDERS BINDING
// ========================================================
const rainIntensityInput = document.getElementById("rain-intensity");
const so2Input = document.getElementById("so2-emissions");
const noxInput = document.getElementById("nox-emissions");

if (rainIntensityInput) {
  rainIntensityInput.addEventListener("input", (e) => {
    state.rainIntensity = Number(e.target.value);
    updateEcologyMetrics();
  });
}

if (so2Input) {
  so2Input.addEventListener("input", (e) => {
    state.so2 = Number(e.target.value);
    updateProductivity(state.so2);
  });
}

if (noxInput) {
  noxInput.addEventListener("input", (e) => {
    state.nox = Number(e.target.value);
    updateEcologyMetrics();
  });
}

// Initial setup
initI18n();
updateProductivity(70);
updateEcologyMetrics();
renderAdvancementTree();

console.log("Acid Rain Simulation Initialized.");
