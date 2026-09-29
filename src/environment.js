/**
 * Environment Rendering and Simulation Module
 * Features:
 * - Volcano on the left, Factory to its right
 * - Soil layer drawn over bottom parts to hide underground structures
 * - Dynamic fish population & floating fish skeletons based on lake pH
 * - Dynamic tree health & dead skeleton trees based on rain pH
 * - Unified merged smoke plume with selective outer-border glow
 */

// Live Swimming Fish
export class Fish {
  constructor(lakeBounds) {
    this.lake = lakeBounds;
    this.reset();
  }

  reset() {
    this.x = this.lake.x + 30 + Math.random() * (this.lake.width - 60);
    this.y = this.lake.y + 25 + Math.random() * (this.lake.height - 45);
    this.speed = 0.6 + Math.random() * 0.9;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.size = 14 + Math.random() * 8;
    this.tailAngle = 0;
    this.tailSpeed = 0.15 + Math.random() * 0.1;
    this.color = Math.random() > 0.4 ? "#f97316" : "#eab308";
    this.bellyColor = "#fef08a";
    this.bubbleTimer = Math.random() * 200;
  }

  update(bubbles, isStressed = false) {
    const curSpeed = isStressed ? this.speed * 0.55 : this.speed;
    this.x += curSpeed * this.direction;
    this.tailAngle += this.tailSpeed * (isStressed ? 0.6 : 1);

    if (this.x > this.lake.x + this.lake.width - 25) {
      this.direction = -1;
    } else if (this.x < this.lake.x + 25) {
      this.direction = 1;
    }

    this.bubbleTimer--;
    if (this.bubbleTimer <= 0) {
      this.bubbleTimer = 180 + Math.random() * 200;
      bubbles.push({
        x: this.x + (this.direction > 0 ? this.size : -this.size),
        y: this.y,
        radius: 2 + Math.random() * 2.5,
        speed: 0.5 + Math.random() * 0.4,
      });
    }
  }

  draw(ctx, isStressed = false) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.direction < 0) {
      ctx.scale(-1, 1);
    }

    const s = this.size;
    const tailWiggle = Math.sin(this.tailAngle) * (isStressed ? 3 : 5);

    // Body (dulled tone if stressed)
    ctx.fillStyle = isStressed ? "#a16207" : this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = isStressed ? "#ca8a04" : this.bellyColor;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.18, s * 0.7, s * 0.22, 0, 0, Math.PI);
    ctx.fill();

    // Tail fin
    ctx.fillStyle = isStressed ? "#a16207" : this.color;
    ctx.beginPath();
    ctx.moveTo(-s * 0.8, 0);
    ctx.lineTo(-s * 1.5, -s * 0.5 + tailWiggle);
    ctx.lineTo(-s * 1.2, 0);
    ctx.lineTo(-s * 1.5, s * 0.5 + tailWiggle);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(s * 0.6, -s * 0.12, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(s * 0.65, -s * 0.12, s * 0.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Dead Floating Fish Skeleton (Acid Rain Casualty)
export class FishSkeleton {
  constructor(lakeBounds, x) {
    this.lake = lakeBounds;
    this.x = x || this.lake.x + 35 + Math.random() * (this.lake.width - 70);
    this.y = this.lake.y + 6 + Math.random() * 12; // Floats near water surface
    this.size = 14 + Math.random() * 6;
    this.floatOffset = Math.random() * Math.PI * 2;
    this.driftSpeed = (Math.random() - 0.5) * 0.2;
    this.direction = Math.random() > 0.5 ? 1 : -1;
  }

  update(time) {
    this.x += this.driftSpeed;
    if (this.x < this.lake.x + 30) this.driftSpeed = Math.abs(this.driftSpeed);
    if (this.x > this.lake.x + this.lake.width - 30) this.driftSpeed = -Math.abs(this.driftSpeed);
    // Bob on water surface
    this.currentY = this.y + Math.sin(time * 0.003 + this.floatOffset) * 2.5;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.currentY);
    if (this.direction < 0) ctx.scale(-1, 1);

    const s = this.size;
    ctx.strokeStyle = "#e2e8f0"; // Bone white
    ctx.fillStyle = "#cbd5e1";
    ctx.lineWidth = 1.6;

    // 1. Skull bone
    ctx.beginPath();
    ctx.ellipse(s * 0.6, -s * 0.05, s * 0.32, s * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eye socket (empty dark hole)
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(s * 0.65, -s * 0.08, s * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // 2. Spine
    ctx.beginPath();
    ctx.moveTo(s * 0.3, 0);
    ctx.lineTo(-s * 0.9, 0);
    ctx.stroke();

    // 3. Rib bones branching off spine
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const rx = s * 0.2 - i * (s * 0.22);
      ctx.moveTo(rx, -s * 0.35);
      ctx.lineTo(rx, s * 0.35);
    }
    ctx.stroke();

    // 4. Skeletal Tail Fin
    ctx.beginPath();
    ctx.moveTo(-s * 0.9, 0);
    ctx.lineTo(-s * 1.4, -s * 0.4);
    ctx.moveTo(-s * 0.9, 0);
    ctx.lineTo(-s * 1.4, s * 0.4);
    ctx.moveTo(-s * 0.9, 0);
    ctx.lineTo(-s * 1.3, 0);
    ctx.stroke();

    ctx.restore();
  }
}

// Unified Smoke Particle
export class SmokeParticle {
  constructor(x, y, productivity, isVolcanic = false) {
    this.x = x + (Math.random() - 0.5) * 12;
    this.y = y;
    this.radius = isVolcanic ? 16 + Math.random() * 12 : 12 + Math.random() * 8;
    this.maxRadius = isVolcanic ? 85 + Math.random() * 50 : 65 + Math.random() * 40;
    this.vx = 0.9 + Math.random() * 1.3;
    this.vy = -(1.3 + Math.random() * 1.5);
    this.growth = 0.38 + Math.random() * 0.26;
    this.life = 0;
    this.maxLife = 170 + Math.random() * 90;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    this.isVolcanic = isVolcanic;
    this.updateShade(productivity);
  }

  updateShade(productivity) {
    const norm = Math.max(0, Math.min(100, productivity)) / 100;
    if (this.isVolcanic) {
      this.r = 35;
      this.g = 32;
      this.b = 30;
      this.baseAlpha = 0.85;
    } else {
      const darkness = Math.floor(105 - norm * 88);
      this.r = darkness;
      this.g = darkness;
      this.b = darkness + 4;
      this.baseAlpha = 0.45 + norm * 0.45;
    }
  }

  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.996;
    this.radius = Math.min(this.maxRadius, this.radius + this.growth);
    this.rotation += this.rotSpeed;
  }

  isDead() {
    return this.life >= this.maxLife;
  }

  draw(ctx) {
    const progress = this.life / this.maxLife;
    const alpha = this.baseAlpha * (1 - progress);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    if (this.isVolcanic && Math.random() > 0.88 && progress < 0.5) {
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(
        (Math.random() - 0.5) * this.radius * 0.7,
        (Math.random() - 0.5) * this.radius * 0.7,
        1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }
}

// Outer Border Glow for Smoke Cloud (Outer boundary only, interior stays dark)
export function drawSmokeOuterBorderGlow(ctx, smokeParticles) {
  if (smokeParticles.length < 3) return;

  ctx.save();
  ctx.shadowColor = "#c084fc";
  ctx.shadowBlur = 18;
  ctx.strokeStyle = `rgba(192, 132, 252, ${0.5 + 0.3 * Math.sin(Date.now() * 0.006)})`;
  ctx.lineWidth = 2.5;

  let sumX = 0;
  let sumY = 0;
  for (const p of smokeParticles) {
    sumX += p.x;
    sumY += p.y;
  }
  const centerX = sumX / smokeParticles.length;
  const centerY = sumY / smokeParticles.length;

  const sectors = 18;
  const sectorExtremes = new Array(sectors).fill(null);

  for (const p of smokeParticles) {
    const dx = p.x - centerX;
    const dy = p.y - centerY;
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;
    const sectorIndex = Math.floor((angle / (Math.PI * 2)) * sectors) % sectors;
    const dist = Math.hypot(dx, dy) + p.radius * 0.95;

    if (!sectorExtremes[sectorIndex] || dist > sectorExtremes[sectorIndex].dist) {
      const nx = dx / (Math.hypot(dx, dy) || 1);
      const ny = dy / (Math.hypot(dx, dy) || 1);
      sectorExtremes[sectorIndex] = {
        x: centerX + nx * dist,
        y: centerY + ny * dist,
        dist,
      };
    }
  }

  const validPoints = sectorExtremes.filter((pt) => pt !== null);
  if (validPoints.length >= 4) {
    ctx.beginPath();
    const first = validPoints[0];
    ctx.moveTo(first.x, first.y);

    for (let i = 0; i < validPoints.length; i++) {
      const curr = validPoints[i];
      const next = validPoints[(i + 1) % validPoints.length];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
    }

    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}

// Tree drawing helper (Healthy vs Chlorosis vs Dead Withered Skeleton Tree)
export function drawTree(ctx, x, groundY, scale = 1, rainPh = 4.2) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(scale, scale);

  const isDead = rainPh < 4.1;
  const isStressed = rainPh >= 4.1 && rainPh < 5.2;

  if (isDead) {
    // ----------------------------------------------------
    // DEAD SKELETON TREE (Devastated by severe acid rain)
    // ----------------------------------------------------
    ctx.fillStyle = "#2d231e"; // Ash gray-brown dead wood
    ctx.strokeStyle = "#2d231e";
    ctx.lineCap = "round";

    // Main gnarled bare trunk
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(-4, -40);
    ctx.lineTo(4, -40);
    ctx.lineTo(6, 0);
    ctx.closePath();
    ctx.fill();

    // Twisted bare dead branches
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, -38);
    ctx.lineTo(-18, -65);
    ctx.lineTo(-28, -80);
    ctx.moveTo(-18, -65);
    ctx.lineTo(-12, -88);

    ctx.moveTo(0, -38);
    ctx.lineTo(16, -60);
    ctx.lineTo(26, -78);
    ctx.moveTo(16, -60);
    ctx.lineTo(8, -85);

    ctx.moveTo(0, -38);
    ctx.lineTo(2, -92);
    ctx.lineTo(-6, -105);
    ctx.stroke();

    // Spiky twigs
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-24, -75);
    ctx.lineTo(-34, -82);
    ctx.moveTo(22, -72);
    ctx.lineTo(32, -80);
    ctx.moveTo(0, -85);
    ctx.lineTo(10, -96);
    ctx.stroke();

    ctx.restore();
    return;
  }

  // ----------------------------------------------------
  // LIVING TREE (Healthy Green or Stressed Yellow-Brown)
  // ----------------------------------------------------
  const foliageHue = isStressed ? 65 : 125;

  // Trunk
  ctx.fillStyle = "#5c3d2e";
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(-5, -45);
  ctx.lineTo(5, -45);
  ctx.lineTo(7, 0);
  ctx.closePath();
  ctx.fill();

  // Bark lines
  ctx.strokeStyle = "#412a1f";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-1, -10);
  ctx.lineTo(-2, -35);
  ctx.stroke();

  // Canopies
  ctx.fillStyle = `hsl(${foliageHue}, 55%, 26%)`;
  ctx.beginPath();
  ctx.arc(-16, -50, 22, 0, Math.PI * 2);
  ctx.arc(16, -50, 22, 0, Math.PI * 2);
  ctx.arc(0, -62, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `hsl(${foliageHue}, 60%, 34%)`;
  ctx.beginPath();
  ctx.arc(-10, -66, 18, 0, Math.PI * 2);
  ctx.arc(12, -66, 18, 0, Math.PI * 2);
  ctx.arc(0, -78, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `hsl(${foliageHue}, 65%, 42%)`;
  ctx.beginPath();
  ctx.arc(-4, -84, 14, 0, Math.PI * 2);
  ctx.arc(6, -82, 12, 0, Math.PI * 2);
  ctx.arc(0, -92, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Soil & Grass Terrain rendering (Drawn ON TOP of factory/volcano lower bases)
export function drawSoil(ctx, width, height, groundY) {
  const lakeStartX = width * 0.58;

  // Bedrock & subsoil gradient
  const soilGrad = ctx.createLinearGradient(0, groundY, 0, height);
  soilGrad.addColorStop(0, "#4a3525");
  soilGrad.addColorStop(0.35, "#382315");
  soilGrad.addColorStop(1, "#1c120a");

  ctx.fillStyle = soilGrad;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(lakeStartX, groundY);
  ctx.quadraticCurveTo(lakeStartX + 20, groundY + 15, lakeStartX + 35, groundY + 45);
  ctx.lineTo(lakeStartX + 35, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Loam and grass top
  ctx.fillStyle = "#2d1c10";
  ctx.fillRect(0, groundY, lakeStartX, 10);

  ctx.fillStyle = "#3f6212";
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= lakeStartX; x += 12) {
    const tipY = groundY - 4 - (x % 5);
    ctx.lineTo(x + 6, tipY);
    ctx.lineTo(x + 12, groundY);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#4d7c0f";
  ctx.fillRect(0, groundY - 2, lakeStartX, 3);
}

// Lake & Water rendering
export function drawLake(ctx, width, height, groundY, time, bubbles) {
  const lakeStartX = width * 0.58;
  const lakeWidth = width - lakeStartX;

  const waterGrad = ctx.createLinearGradient(0, groundY, 0, height);
  waterGrad.addColorStop(0, "rgba(14, 116, 144, 0.85)");
  waterGrad.addColorStop(0.4, "rgba(8, 47, 73, 0.92)");
  waterGrad.addColorStop(1, "rgba(4, 20, 36, 0.98)");

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(lakeStartX + 25, groundY + 18);

  const wavePoints = 30;
  for (let i = 0; i <= wavePoints; i++) {
    const px = lakeStartX + 25 + (lakeWidth - 25) * (i / wavePoints);
    const py = groundY + 18 + Math.sin(time * 0.003 + i * 0.5) * 3;
    ctx.lineTo(px, py);
  }

  ctx.lineTo(width, height);
  ctx.lineTo(lakeStartX + 25, height);
  ctx.closePath();
  ctx.fillStyle = waterGrad;
  ctx.fill();

  // Water surface line
  ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= wavePoints; i++) {
    const px = lakeStartX + 25 + (lakeWidth - 25) * (i / wavePoints);
    const py = groundY + 18 + Math.sin(time * 0.003 + i * 0.5) * 3;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Rising bubbles
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.y -= b.speed;
    b.x += Math.sin(b.y * 0.08) * 0.4;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();

    if (b.y < groundY + 18) {
      bubbles.splice(i, 1);
    }
  }

  ctx.restore();
}

// ========================================================
// VOLCANO COMPONENT (ON THE FAR LEFT)
// ========================================================
export function drawVolcano(ctx, volcano, isHovered, isErupting, lavaSparks) {
  const { x, y, width: w, height: h } = volcano;
  const craterX = x + w * 0.5;
  const craterY = y;
  const craterW = 38;

  ctx.save();

  if (isHovered) {
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 26;
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 3.5;
  } else {
    ctx.strokeStyle = "#271d18";
    ctx.lineWidth = 1;
  }

  // Volcanic mountain cone (extends into soil)
  const coneGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  coneGrad.addColorStop(0, "#2c1c16");
  coneGrad.addColorStop(0.5, "#1e130f");
  coneGrad.addColorStop(1, "#120b08");

  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(craterX - craterW / 2, craterY);
  ctx.lineTo(x + w * 0.25, y + h * 0.35);
  ctx.lineTo(x + w * 0.15, y + h * 0.65);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w * 0.85, y + h * 0.65);
  ctx.lineTo(x + w * 0.75, y + h * 0.35);
  ctx.lineTo(craterX + craterW / 2, craterY);
  ctx.closePath();
  ctx.fill();
  if (isHovered) ctx.stroke();

  // Fissures & glowing lava veins
  ctx.strokeStyle = isErupting ? "#ef4444" : "rgba(249, 115, 22, 0.75)";
  ctx.lineWidth = isErupting ? 3.5 : 2;
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = isErupting ? 16 : 6;

  ctx.beginPath();
  ctx.moveTo(craterX - 6, craterY + 4);
  ctx.lineTo(craterX - 18, craterY + 35);
  ctx.lineTo(craterX - 12, craterY + 70);
  ctx.lineTo(craterX - 32, craterY + h - 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(craterX + 8, craterY + 4);
  ctx.lineTo(craterX + 16, craterY + 40);
  ctx.lineTo(craterX + 28, craterY + 85);
  ctx.lineTo(craterX + 35, craterY + h - 10);
  ctx.stroke();

  // Crater rim & bubbling magma pool
  ctx.fillStyle = isErupting ? "#facc15" : "#ea580c";
  ctx.shadowColor = "#f97316";
  ctx.shadowBlur = isErupting ? 28 : 14;
  ctx.beginPath();
  ctx.ellipse(craterX, craterY, craterW / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Active flying lava sparks
  for (let i = lavaSparks.length - 1; i >= 0; i--) {
    const s = lavaSparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.12;
    s.life++;

    ctx.fillStyle = s.color;
    ctx.shadowColor = "#f97316";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();

    if (s.y > y + h || s.life > s.maxLife) {
      lavaSparks.splice(i, 1);
    }
  }

  ctx.restore();
}

// ========================================================
// FACTORY DRAWING (TO THE RIGHT OF THE VOLCANO)
// ========================================================
export function drawFactory(ctx, factory, isHovered) {
  const { x, y, width: w, height: h } = factory;

  ctx.save();

  if (isHovered) {
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 24;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3.5;
  } else {
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
  }

  // Chimneys
  const stack1X = x + 30;
  const stack2X = x + 72;
  const stackTopY = y - 62;

  const stackGrad = ctx.createLinearGradient(stack1X - 12, 0, stack1X + 12, 0);
  stackGrad.addColorStop(0, "#475569");
  stackGrad.addColorStop(0.5, "#94a3b8");
  stackGrad.addColorStop(1, "#334155");

  ctx.fillStyle = stackGrad;
  ctx.beginPath();
  ctx.moveTo(stack1X - 10, stackTopY);
  ctx.lineTo(stack1X + 10, stackTopY);
  ctx.lineTo(stack1X + 14, y);
  ctx.lineTo(stack1X - 14, y);
  ctx.closePath();
  ctx.fill();
  if (isHovered) ctx.stroke();

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(stack1X - 12, stackTopY - 4, 24, 5);

  ctx.fillStyle = stackGrad;
  ctx.beginPath();
  ctx.moveTo(stack2X - 9, stackTopY + 16);
  ctx.lineTo(stack2X + 9, stackTopY + 16);
  ctx.lineTo(stack2X + 13, y);
  ctx.lineTo(stack2X - 13, y);
  ctx.closePath();
  ctx.fill();
  if (isHovered) ctx.stroke();

  ctx.fillStyle = "#f97316";
  ctx.fillRect(stack2X - 11, stackTopY + 12, 22, 5);

  // Main Factory Building (base extends down into soil)
  const bldgGrad = ctx.createLinearGradient(x, y, x + w, y);
  bldgGrad.addColorStop(0, "#1e293b");
  bldgGrad.addColorStop(0.5, "#334155");
  bldgGrad.addColorStop(1, "#1e293b");

  ctx.fillStyle = bldgGrad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w * 0.35, y - 22);
  ctx.lineTo(x + w * 0.35, y - 4);
  ctx.lineTo(x + w * 0.7, y - 22);
  ctx.lineTo(x + w * 0.7, y - 4);
  ctx.lineTo(x + w, y - 14);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  if (isHovered) ctx.stroke();

  // Windows
  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#fbbf24";
  const rows = 3;
  const cols = 3;
  const winStartX = x + 20;
  const winStartY = y + 25;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillRect(winStartX + c * 24, winStartY + r * 22, 13, 11);
    }
  }

  // Cargo Door
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(x + w * 0.62, y + h - 45, 42, 45);
  ctx.strokeStyle = "#475569";
  ctx.strokeRect(x + w * 0.62, y + h - 45, 42, 45);

  ctx.fillStyle = "#eab308";
  ctx.fillRect(x + w * 0.62, y + h - 48, 42, 4);

  ctx.restore();
}

// Hit-testing helpers
export function isPointInFactory(px, py, factory) {
  const { x, y, width: w, height: h } = factory;
  const inBuilding = px >= x && px <= x + w + 10 && py >= y - 25 && py <= y + h;
  const inChimneys = px >= x + 15 && px <= x + 90 && py >= y - 72 && py <= y;
  return inBuilding || inChimneys;
}

export function isPointInVolcano(px, py, volcano) {
  const { x, y, width: w, height: h } = volcano;
  if (px >= x && px <= x + w && py >= y && py <= y + h) {
    const relX = Math.abs(px - (x + w * 0.5)) / (w * 0.5);
    const relY = (py - y) / h;
    return relY >= relX * 0.85;
  }
  return false;
}

export function isPointInSmoke(px, py, smokeParticles, smokeBounds) {
  if (
    px >= smokeBounds.x &&
    px <= smokeBounds.x + smokeBounds.width &&
    py >= smokeBounds.y &&
    py <= smokeBounds.y + smokeBounds.height
  ) {
    for (const p of smokeParticles) {
      const dx = px - p.x;
      const dy = py - p.y;
      if (dx * dx + dy * dy <= (p.radius * 1.3) ** 2) {
        return true;
      }
    }
  }
  return false;
}
