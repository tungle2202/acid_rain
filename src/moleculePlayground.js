/**
 * Geometric Molecule Drag-and-Drop Playground
 * - Stationary molecules (stay still, zero drift)
 * - Non-overlapping layout coordinates
 * - Hide formula tags by default, reveal on hover or drag
 * - Auto-replenish H2O and O2
 */

import { MOLECULES } from "./chemistry.js";

export class FloatingMolecule {
  constructor(molType, x, y) {
    this.molType = molType;
    this.molData = MOLECULES[molType] || MOLECULES.SO2;
    this.x = x;
    this.y = y;
    this.vx = 0; // Stationary
    this.vy = 0;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.radius = 34;
    this.angle = 0;
    this.isHovered = false;
  }

  update() {
    // Stays completely still when not dragging
  }

  draw(ctx, isHovered = false) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const active = this.isDragging || isHovered;
    const s = this.isDragging ? 1.15 : isHovered ? 1.08 : 1.0;
    ctx.scale(s, s);

    // Glowing aura if hovered or dragging
    if (active) {
      ctx.shadowColor = this.molData.color || "#38bdf8";
      ctx.shadowBlur = this.isDragging ? 26 : 18;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 1. Chemical Bonds
    const atoms = this.molData.atoms;
    const bonds = this.molData.bonds || [];

    for (const b of bonds) {
      const a1 = atoms[b.from];
      const a2 = atoms[b.to];
      if (!a1 || !a2) continue;

      const dx = a2.x - a1.x;
      const dy = a2.y - a1.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      ctx.strokeStyle = "#94a3b8";
      ctx.lineCap = "round";

      if (b.type === "double") {
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(a1.x + nx * 3.5, a1.y + ny * 3.5);
        ctx.lineTo(a2.x + nx * 3.5, a2.y + ny * 3.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(a1.x - nx * 3.5, a1.y - ny * 3.5);
        ctx.lineTo(a2.x - nx * 3.5, a2.y - ny * 3.5);
        ctx.stroke();
      } else {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(a1.x, a1.y);
        ctx.lineTo(a2.x, a2.y);
        ctx.stroke();
      }
    }

    // 2. Atoms (Shaded geometric spheres)
    for (const a of atoms) {
      ctx.save();
      ctx.translate(a.x, a.y);

      const grad = ctx.createRadialGradient(
        -a.r * 0.3,
        -a.r * 0.3,
        a.r * 0.1,
        0,
        0,
        a.r
      );
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.35, a.color);
      grad.addColorStop(1, "#0f172a");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, a.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Atom symbol label
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(9, a.r * 0.85)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(a.symbol, 0, 1);

      ctx.restore();
    }

    // 3. Formula Tag (ONLY SHOWN ON HOVER OR DRAG)
    if (active) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#000000";
      ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
      ctx.strokeStyle = this.molData.color || "#38bdf8";
      ctx.lineWidth = 1.4;

      const tagW = Math.max(60, (this.molData.formula?.length || 4) * 9 + 16);
      const tagH = 22;
      const tagY = this.radius + 6;

      ctx.beginPath();
      ctx.roundRect(-tagW / 2, tagY, tagW, tagH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = this.molData.color || "#ffffff";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.molData.formula, 0, tagY + tagH / 2);
    }

    ctx.restore();
  }

  contains(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return dx * dx + dy * dy <= (this.radius + 10) ** 2;
  }
}

// Particle burst effect during reaction synthesis
export class ReactionBurst {
  constructor(x, y, color = "#fbbf24") {
    this.x = x;
    this.y = y;
    this.color = color;
    this.ringRadius = 10;
    this.ringMaxRadius = 90;
    this.alpha = 1;
    this.life = 0;
    this.maxLife = 38;
    this.sparks = [];

    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5.5;
      this.sparks.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3,
        color: Math.random() > 0.4 ? color : "#ffffff",
      });
    }
  }

  update() {
    this.life++;
    this.ringRadius += (this.ringMaxRadius - this.ringRadius) * 0.12;
    this.alpha = 1 - this.life / this.maxLife;

    for (const s of this.sparks) {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.96;
      s.vy *= 0.96;
    }
  }

  isDead() {
    return this.life >= this.maxLife;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 16;
    ctx.lineWidth = 3.5 * this.alpha;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(0, 0, this.ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    for (const s of this.sparks) {
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * this.alpha, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Generate cleanly separated, non-overlapping grid layout for floating molecules
export function layoutMoleculesGrid(types, bounds) {
  const molecules = [];
  const count = types.length;
  if (count === 0) return molecules;

  // Compute optimal column count based on aspect ratio and molecule count
  // For 6 molecules (e.g. Eiffel, Moai), 3 cols x 2 rows gives generous spacing!
  // For 8 molecules (Smoke), 4 cols x 2 rows gives generous spacing!
  let cols = count <= 6 ? Math.min(count, 3) : Math.min(count, 4);
  let rows = Math.ceil(count / cols);

  const padX = 50;
  const padY = 45;
  const usableW = Math.max(120, bounds.width - padX * 2);
  const usableH = Math.max(100, bounds.height - padY * 2);

  const spacingX = cols > 1 ? usableW / (cols - 1) : 0;
  const spacingY = rows > 1 ? usableH / (rows - 1) : 0;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const countInRow = (row === rows - 1) ? (count - row * cols) : cols;

    // Horizontally center items if the last row has fewer items
    let x;
    if (countInRow === cols) {
      x = cols > 1 ? bounds.x + padX + col * spacingX : bounds.x + bounds.width * 0.5;
    } else {
      const rowUsableW = countInRow > 1 ? (countInRow - 1) * spacingX : 0;
      const rowStartX = bounds.x + (bounds.width - rowUsableW) * 0.5;
      x = countInRow > 1 ? rowStartX + col * spacingX : bounds.x + bounds.width * 0.5;
    }

    const y = rows > 1 ? bounds.y + padY + row * spacingY : bounds.y + bounds.height * 0.5;
    molecules.push(new FloatingMolecule(types[i], x, y));
  }

  return molecules;
}

// Find a free non-overlapping position in the bounds with guaranteed clearance
export function findFreePosition(existing, bounds, minDistance = 90) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const testX = bounds.x + 50 + Math.random() * Math.max(20, bounds.width - 100);
    const testY = bounds.y + 45 + Math.random() * Math.max(20, bounds.height - 90);

    let overlaps = false;
    for (const m of existing) {
      if (Math.hypot(m.x - testX, m.y - testY) < minDistance) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      return { x: testX, y: testY };
    }
  }

  // Fallback with minimal offset from edge
  return {
    x: bounds.x + 60 + Math.random() * Math.max(30, bounds.width - 120),
    y: bounds.y + 55 + Math.random() * Math.max(30, bounds.height - 110),
  };
}
