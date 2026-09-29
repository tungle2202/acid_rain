/**
 * Environment Rendering and Simulation Module
 * Features:
 * - Volcano on the left, Factory to its right
 * - Soil layer drawn over bottom parts to hide underground structures
 * - Dynamic fish population & floating fish skeletons based on lake pH
 * - Dynamic tree health & dead skeleton trees based on rain pH
 * - Unified merged smoke plume with selective outer-border glow
 * - Eiffel Tower (Metal) & Moai Statue (Rock) on the right of the lake
 * - Dynamic visual metal rusting and stone dissolution based on acid rain pH
 */

// Live Swimming Fish
export class Fish {
  constructor(lakeBounds) {
    this.lake = lakeBounds;
    this.reset();
  }

  reset() {
    this.x = this.lake.x + 30 + Math.random() * Math.max(20, this.lake.width - 60);
    this.y = this.lake.y + 25 + Math.random() * Math.max(20, this.lake.height - 45);
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
    this.x = x || this.lake.x + 35 + Math.random() * Math.max(20, this.lake.width - 70);
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
    ctx.translate(this.x, this.currentY || this.y);
    if (this.direction < 0) {
      ctx.scale(-1, 1);
    }

    const s = this.size;
    ctx.strokeStyle = "rgba(241, 245, 249, 0.85)";
    ctx.lineWidth = 1.4;

    // Spine
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.lineTo(s * 0.8, 0);
    ctx.stroke();

    // Skull
    ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
    ctx.beginPath();
    ctx.arc(s * 0.6, 0, s * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Eye socket
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(s * 0.65, -s * 0.05, s * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Rib cage
    ctx.beginPath();
    for (let i = -0.5; i <= 0.3; i += 0.25) {
      ctx.moveTo(s * i, -s * 0.35);
      ctx.lineTo(s * i, s * 0.35);
    }
    ctx.stroke();

    // Tail bone
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.lineTo(-s * 1.35, -s * 0.3);
    ctx.moveTo(-s, 0);
    ctx.lineTo(-s * 1.35, s * 0.3);
    ctx.stroke();

    ctx.restore();
  }
}

// Particle Class for Factory & Volcano Smoke
export class SmokeParticle {
  constructor(x, y, productivity = 70, isVolcanic = false) {
    this.x = x + (Math.random() - 0.5) * 14;
    this.y = y;
    this.radius = isVolcanic ? 22 + Math.random() * 16 : 14 + Math.random() * 10;
    this.maxRadius = isVolcanic ? 85 + Math.random() * 45 : 65 + Math.random() * 35;
    this.vx = (Math.random() - 0.5) * (isVolcanic ? 1.4 : 0.8) + (isVolcanic ? 0.35 : 0.6);
    this.vy = -(1.2 + Math.random() * (isVolcanic ? 1.6 : 1.1));
    this.alpha = isVolcanic ? 0.65 : 0.45;
    this.growth = 0.28 + Math.random() * 0.22;
    this.life = 0;
    this.maxLife = isVolcanic ? 380 + Math.random() * 120 : 320 + Math.random() * 90;
    this.isVolcanic = isVolcanic;

    this.updateShade(productivity);
  }

  updateShade(prod) {
    if (this.isVolcanic) {
      this.r = 45;
      this.g = 35;
      this.b = 35;
      return;
    }
    const ratio = Math.max(0, Math.min(1, prod / 100));
    const val = Math.floor(140 - ratio * 115);
    this.r = val + 10;
    this.g = val;
    this.b = val;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;

    if (this.radius < this.maxRadius) {
      this.radius += this.growth;
    }

    const lifeRatio = this.life / this.maxLife;
    if (lifeRatio > 0.65) {
      this.alpha = Math.max(0, (1 - lifeRatio) / 0.35) * (this.isVolcanic ? 0.65 : 0.45);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life >= this.maxLife || this.alpha <= 0.01;
  }
}

// Outer Borderline Glow for Smoke Hover (ONLY the very outer contour glows, no interior strokes)
let smokeGlowCanvas = null;
let smokeGlowCtx = null;

export function drawSmokeOuterBorderGlow(ctx, particles) {
  if (!particles || particles.length === 0) return;

  // 1. Calculate bounding box of all smoke particles
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const left = p.x - p.radius;
    const top = p.y - p.radius;
    const right = p.x + p.radius;
    const bottom = p.y + p.radius;
    if (left < minX) minX = left;
    if (top < minY) minY = top;
    if (right > maxX) maxX = right;
    if (bottom > maxY) maxY = bottom;
  }

  const pad = 28;
  minX = Math.floor(minX - pad);
  minY = Math.floor(minY - pad);
  maxX = Math.ceil(maxX + pad);
  maxY = Math.ceil(maxY + pad);
  const w = maxX - minX;
  const h = maxY - minY;
  if (w <= 0 || h <= 0) return;

  // 2. Lazy instantiate offscreen canvas
  if (!smokeGlowCanvas) {
    smokeGlowCanvas = document.createElement("canvas");
    smokeGlowCtx = smokeGlowCanvas.getContext("2d");
  }
  if (smokeGlowCanvas.width !== w || smokeGlowCanvas.height !== h) {
    smokeGlowCanvas.width = w;
    smokeGlowCanvas.height = h;
  }
  smokeGlowCtx.clearRect(0, 0, w, h);

  // 3. Draw outer stroke of all circles onto offscreen canvas
  smokeGlowCtx.save();
  smokeGlowCtx.translate(-minX, -minY);
  smokeGlowCtx.strokeStyle = "#38bdf8";
  smokeGlowCtx.lineWidth = 5.5;
  smokeGlowCtx.beginPath();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    smokeGlowCtx.moveTo(p.x + p.radius, p.y);
    smokeGlowCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  }
  smokeGlowCtx.stroke();

  // 4. Punch out the entire interior using destination-out
  // This erases ALL interior circles and lines, leaving ONLY the very outer borderline!
  smokeGlowCtx.globalCompositeOperation = "destination-out";
  smokeGlowCtx.fillStyle = "#000000";
  smokeGlowCtx.beginPath();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    smokeGlowCtx.moveTo(p.x + p.radius, p.y);
    smokeGlowCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  }
  smokeGlowCtx.fill();
  smokeGlowCtx.restore();

  // 5. Draw the purely outer borderline with neon glow onto the main canvas
  ctx.save();
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 18;
  ctx.drawImage(smokeGlowCanvas, minX, minY);
  ctx.drawImage(smokeGlowCanvas, minX, minY);
  ctx.restore();
}

// Tree drawing reacting dynamically to rainfall pH
export function drawTree(ctx, x, groundY, scale = 1, rainPh = 4.2) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(scale, scale);

  const isDeadApocalypse = rainPh < 4.1;
  const isChlorosis = rainPh < 5.0;

  // Trunk
  ctx.fillStyle = isDeadApocalypse ? "#271d18" : "#451a03";
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(-4, -55);
  ctx.lineTo(4, -55);
  ctx.lineTo(7, 0);
  ctx.closePath();
  ctx.fill();

  // Root flare
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-4, -14);
  ctx.lineTo(4, -14);
  ctx.lineTo(10, 0);
  ctx.closePath();
  ctx.fill();

  // Dead Withered Skeleton Tree
  if (isDeadApocalypse) {
    ctx.strokeStyle = "#271d18";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(-18, -75);
    ctx.lineTo(-28, -90);
    ctx.moveTo(-18, -75);
    ctx.lineTo(-8, -95);

    ctx.moveTo(0, -45);
    ctx.lineTo(16, -70);
    ctx.lineTo(26, -85);
    ctx.moveTo(16, -70);
    ctx.lineTo(10, -96);

    ctx.moveTo(0, -55);
    ctx.lineTo(0, -82);
    ctx.lineTo(6, -100);
    ctx.stroke();

    ctx.restore();
    return;
  }

  // Living Canopy (Hue shifts from chlorosis yellow-brown 65 to healthy green 140)
  const foliageHue = isChlorosis ? 65 : 138;

  ctx.fillStyle = `hsl(${foliageHue}, 55%, 26%)`;
  ctx.beginPath();
  ctx.arc(-14, -52, 22, 0, Math.PI * 2);
  ctx.arc(14, -52, 22, 0, Math.PI * 2);
  ctx.arc(0, -60, 24, 0, Math.PI * 2);
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

// Soil & Grass Terrain rendering spanning panoramic world
export function drawSoil(ctx, worldWidth, height, groundY, lakeStartX, lakeEndX) {
  const soilGrad = ctx.createLinearGradient(0, groundY, 0, height);
  soilGrad.addColorStop(0, "#4a3525");
  soilGrad.addColorStop(0.35, "#382315");
  soilGrad.addColorStop(1, "#1c120a");
  ctx.fillStyle = soilGrad;

  // 1. Left Bank Bedrock
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(lakeStartX, groundY);
  ctx.quadraticCurveTo(lakeStartX + 20, groundY + 15, lakeStartX + 35, groundY + 45);
  ctx.lineTo(lakeStartX + 35, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // 2. Right Bank Bedrock (under Eiffel Tower & Moai)
  ctx.beginPath();
  ctx.moveTo(lakeEndX - 35, groundY + 45);
  ctx.quadraticCurveTo(lakeEndX - 20, groundY + 15, lakeEndX, groundY);
  ctx.lineTo(worldWidth, groundY);
  ctx.lineTo(worldWidth, height);
  ctx.lineTo(lakeEndX - 35, height);
  ctx.closePath();
  ctx.fill();

  // 3. Loam & Grass - Left Bank
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

  // 4. Loam & Grass - Right Bank
  ctx.fillStyle = "#2d1c10";
  ctx.fillRect(lakeEndX, groundY, worldWidth - lakeEndX, 10);

  ctx.fillStyle = "#3f6212";
  ctx.beginPath();
  ctx.moveTo(lakeEndX, groundY);
  for (let x = lakeEndX; x <= worldWidth; x += 12) {
    const tipY = groundY - 4 - (x % 5);
    ctx.lineTo(x + 6, tipY);
    ctx.lineTo(x + 12, groundY);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#4d7c0f";
  ctx.fillRect(lakeEndX, groundY - 2, worldWidth - lakeEndX, 3);
}

// Lake & Water rendering between left and right shores
export function drawLake(ctx, height, groundY, time, bubbles, lakeStartX, lakeEndX) {
  const lakeWidth = lakeEndX - lakeStartX;

  const waterGrad = ctx.createLinearGradient(0, groundY, 0, height);
  waterGrad.addColorStop(0, "rgba(14, 116, 144, 0.85)");
  waterGrad.addColorStop(0.4, "rgba(8, 47, 73, 0.92)");
  waterGrad.addColorStop(1, "rgba(4, 20, 36, 0.98)");

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(lakeStartX + 25, groundY + 18);

  const wavePoints = 30;
  for (let i = 0; i <= wavePoints; i++) {
    const px = lakeStartX + 25 + (lakeWidth - 50) * (i / wavePoints);
    const py = groundY + 18 + Math.sin(time * 0.003 + i * 0.5) * 3;
    ctx.lineTo(px, py);
  }

  ctx.lineTo(lakeEndX - 25, height);
  ctx.lineTo(lakeStartX + 25, height);
  ctx.closePath();
  ctx.fillStyle = waterGrad;
  ctx.fill();

  // Water surface line
  ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= wavePoints; i++) {
    const px = lakeStartX + 25 + (lakeWidth - 50) * (i / wavePoints);
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

// Volcano Component
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

// Factory Component
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

  // Main Factory Building
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

// ========================================================
// EIFFEL TOWER (METAL) WITH DYNAMIC pH RUST & WEAR VISUALIZATION
// ========================================================
export function drawEiffelTower(ctx, eiffel, isHovered, rainPh) {
  const { x, y, width: w, height: h } = eiffel;
  const groundY = y + h;
  const centerX = x + w * 0.5;

  // Acid corrosion intensity (0.0 for clean pH >= 5.8 to 1.0 for severe pH <= 4.0)
  const corrosion = Math.max(0, Math.min(1, (5.8 - rainPh) / 1.8));
  const isSevere = rainPh < 4.8;
  const isApocalypse = rainPh < 4.1;

  ctx.save();

  if (isHovered) {
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 26;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3.2;
  }

  const metalColor = isApocalypse
    ? "#451a03"
    : isSevere
    ? "#7c2d12"
    : corrosion > 0.3
    ? "#9a3412"
    : "#475569";

  const highlightColor = isApocalypse
    ? "#78350f"
    : isSevere
    ? "#b45309"
    : corrosion > 0.3
    ? "#c2410c"
    : "#94a3b8";

  // Foundation pedestals
  ctx.fillStyle = isSevere ? "#44403c" : "#64748b";
  ctx.fillRect(x + 4, groundY - 8, w * 0.22, 10);
  ctx.fillRect(x + w * 0.74, groundY - 8, w * 0.22, 10);

  const p1Y = y + h * 0.70; // Level 1 platform
  const p2Y = y + h * 0.44; // Level 2 platform
  const p3Y = y + h * 0.12; // Dome / Lantern base
  const tipY = y;           // Spire pinnacle

  // Lower Pillars (Legs)
  const legGrad = ctx.createLinearGradient(x, groundY, x + w, y);
  legGrad.addColorStop(0, metalColor);
  legGrad.addColorStop(0.5, highlightColor);
  legGrad.addColorStop(1, metalColor);

  ctx.fillStyle = legGrad;
  ctx.strokeStyle = metalColor;
  ctx.lineWidth = 2;

  // Left Leg
  ctx.beginPath();
  ctx.moveTo(x + 8, groundY - 8);
  ctx.lineTo(x + w * 0.24, groundY - 8);
  ctx.lineTo(centerX - w * 0.22, p1Y);
  ctx.lineTo(centerX - w * 0.38, p1Y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Leg
  ctx.beginPath();
  ctx.moveTo(x + w * 0.76, groundY - 8);
  ctx.lineTo(x + w - 8, groundY - 8);
  ctx.lineTo(centerX + w * 0.38, p1Y);
  ctx.lineTo(centerX + w * 0.22, p1Y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Central Grand Arch between legs
  ctx.beginPath();
  ctx.arc(centerX, p1Y + (groundY - p1Y) * 0.20, w * 0.24, Math.PI, 0, false);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = highlightColor;
  ctx.stroke();

  // Diagonal girder lattice on lower legs
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = isApocalypse ? "#571804" : "#334155";
  const numStepsLower = 5;
  for (let i = 0; i < numStepsLower; i++) {
    const frac1 = i / numStepsLower;
    const frac2 = (i + 1) / numStepsLower;
    const yA = (groundY - 8) - frac1 * (groundY - 8 - p1Y);
    const yB = (groundY - 8) - frac2 * (groundY - 8 - p1Y);

    const lx1A = x + 8 + frac1 * (centerX - w * 0.38 - (x + 8));
    const lx2A = x + w * 0.24 + frac1 * (centerX - w * 0.22 - (x + w * 0.24));
    const lx1B = x + 8 + frac2 * (centerX - w * 0.38 - (x + 8));
    const lx2B = x + w * 0.24 + frac2 * (centerX - w * 0.22 - (x + w * 0.24));
    ctx.beginPath();
    ctx.moveTo(lx1A, yA); ctx.lineTo(lx2B, yB);
    ctx.moveTo(lx2A, yA); ctx.lineTo(lx1B, yB);
    ctx.stroke();

    const rx1A = x + w * 0.76 + frac1 * (centerX + w * 0.22 - (x + w * 0.76));
    const rx2A = x + w - 8 + frac1 * (centerX + w * 0.38 - (x + w - 8));
    const rx1B = x + w * 0.76 + frac2 * (centerX + w * 0.22 - (x + w * 0.76));
    const rx2B = x + w - 8 + frac2 * (centerX + w * 0.38 - (x + w - 8));
    ctx.beginPath();
    ctx.moveTo(rx1A, yA); ctx.lineTo(rx2B, yB);
    ctx.moveTo(rx2A, yA); ctx.lineTo(rx1B, yB);
    ctx.stroke();
  }

  // Level 1 Platform Deck
  ctx.fillStyle = isSevere ? "#9a3412" : "#1e293b";
  ctx.fillRect(centerX - w * 0.42, p1Y - 7, w * 0.84, 8);
  ctx.fillStyle = highlightColor;
  ctx.fillRect(centerX - w * 0.40, p1Y - 9, w * 0.80, 2);

  // Middle Section (Between Platform 1 and 2)
  ctx.fillStyle = legGrad;
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.32, p1Y - 7);
  ctx.lineTo(centerX + w * 0.32, p1Y - 7);
  ctx.lineTo(centerX + w * 0.18, p2Y);
  ctx.lineTo(centerX - w * 0.18, p2Y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Middle lattice cross
  const numStepsMid = 4;
  for (let i = 0; i < numStepsMid; i++) {
    const frac1 = i / numStepsMid;
    const frac2 = (i + 1) / numStepsMid;
    const yA = (p1Y - 7) - frac1 * (p1Y - 7 - p2Y);
    const yB = (p1Y - 7) - frac2 * (p1Y - 7 - p2Y);
    const wA = w * 0.32 - frac1 * (w * 0.32 - w * 0.18);
    const wB = w * 0.32 - frac2 * (w * 0.32 - w * 0.18);
    ctx.beginPath();
    ctx.moveTo(centerX - wA, yA); ctx.lineTo(centerX + wB, yB);
    ctx.moveTo(centerX + wA, yA); ctx.lineTo(centerX - wB, yB);
    ctx.stroke();
  }

  // Level 2 Platform Deck
  ctx.fillStyle = isSevere ? "#7c2d12" : "#1e293b";
  ctx.fillRect(centerX - w * 0.22, p2Y - 6, w * 0.44, 7);
  ctx.fillStyle = highlightColor;
  ctx.fillRect(centerX - w * 0.20, p2Y - 8, w * 0.40, 2);

  // Upper Tower Shaft
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.14, p2Y - 6);
  ctx.lineTo(centerX + w * 0.14, p2Y - 6);
  ctx.lineTo(centerX + 6, p3Y);
  ctx.lineTo(centerX - 6, p3Y);
  ctx.closePath();
  ctx.fillStyle = legGrad;
  ctx.fill();
  ctx.stroke();

  // Upper shaft lattice
  const numStepsTop = 6;
  for (let i = 0; i < numStepsTop; i++) {
    const frac1 = i / numStepsTop;
    const frac2 = (i + 1) / numStepsTop;
    const yA = (p2Y - 6) - frac1 * (p2Y - 6 - p3Y);
    const yB = (p2Y - 6) - frac2 * (p2Y - 6 - p3Y);
    const wA = w * 0.14 - frac1 * (w * 0.14 - 6);
    const wB = w * 0.14 - frac2 * (w * 0.14 - 6);
    ctx.beginPath();
    ctx.moveTo(centerX - wA, yA); ctx.lineTo(centerX + wB, yB);
    ctx.moveTo(centerX + wA, yA); ctx.lineTo(centerX - wB, yB);
    ctx.stroke();
  }

  // Dome & Cupola & Pinnacle Spire
  ctx.fillStyle = isSevere ? "#7c2d12" : "#334155";
  ctx.beginPath();
  ctx.arc(centerX, p3Y, 8, Math.PI, 0);
  ctx.fill();

  ctx.strokeStyle = isHovered ? "#38bdf8" : highlightColor;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(centerX, p3Y);
  ctx.lineTo(centerX, tipY);
  ctx.stroke();

  // Top aeronautical beacon light
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(centerX, tipY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Acid Rain Rust & Wear Visualization
  if (corrosion > 0.05) {
    ctx.save();
    ctx.shadowBlur = 0;

    // Rust Patches on Joints
    const rustSeeds = [
      { rx: centerX - w * 0.32, ry: p1Y + 12, s: 8 },
      { rx: centerX + w * 0.28, ry: p1Y + 20, s: 10 },
      { rx: centerX - w * 0.12, ry: p2Y + 8, s: 7 },
      { rx: centerX + w * 0.08, ry: p2Y + 18, s: 9 },
      { rx: centerX - 3, ry: p3Y + 14, s: 5 },
      { rx: centerX - w * 0.35, ry: p1Y - 4, s: 11 },
      { rx: centerX + w * 0.12, ry: p1Y - 4, s: 14 },
      { rx: x + 16, ry: groundY - 14, s: 12 },
      { rx: x + w - 24, ry: groundY - 16, s: 13 },
      { rx: centerX, ry: p1Y + (groundY - p1Y) * 0.2, s: 15 },
    ];

    for (const r of rustSeeds) {
      ctx.fillStyle = isApocalypse
        ? "rgba(69, 26, 3, 0.88)"
        : isSevere
        ? "rgba(194, 65, 12, 0.82)"
        : "rgba(217, 119, 6, 0.65)";
      ctx.beginPath();
      ctx.arc(r.rx, r.ry, r.s * (0.6 + corrosion * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }

    // Vertical Rust Runoff Streaks
    if (isSevere) {
      ctx.strokeStyle = "rgba(180, 83, 9, 0.75)";
      ctx.lineWidth = 1.8;
      const dripLines = [
        { dx: centerX - w * 0.28, dy1: p1Y, dy2: p1Y + 35 * corrosion },
        { dx: centerX + w * 0.25, dy1: p1Y, dy2: p1Y + 45 * corrosion },
        { dx: centerX - w * 0.10, dy1: p2Y, dy2: p2Y + 28 * corrosion },
        { dx: centerX + w * 0.08, dy1: p2Y, dy2: p2Y + 32 * corrosion },
        { dx: x + w * 0.16, dy1: groundY - 15, dy2: groundY },
        { dx: x + w * 0.82, dy1: groundY - 15, dy2: groundY },
      ];
      for (const d of dripLines) {
        ctx.beginPath();
        ctx.moveTo(d.dx, d.dy1);
        ctx.lineTo(d.dx + (Math.sin(d.dy2) * 1.5), d.dy2);
        ctx.stroke();
      }
    }

    // Corrosion pits if apocalypse
    if (isApocalypse) {
      ctx.fillStyle = "#1c1917";
      for (let i = 0; i < 8; i++) {
        const pitX = centerX - w * 0.2 + (i * 8.5) % (w * 0.4);
        const pitY = p1Y - 2 + (i * 12) % 60;
        ctx.fillRect(pitX, pitY, 3, 3);
      }
    }

    ctx.restore();
  }

  if (isHovered) {
    ctx.stroke();
  }

  ctx.restore();
}

// ========================================================
// MOAI STATUE (ROCK) WITH DYNAMIC CALCITE DISSOLUTION VISUALIZATION
// ========================================================
export function drawMoaiStatue(ctx, moai, isHovered, rainPh) {
  const { x, y, width: w, height: h } = moai;
  const groundY = y + h;

  const corrosion = Math.max(0, Math.min(1, (5.8 - rainPh) / 1.8));
  const isSevere = rainPh < 4.8;
  const isApocalypse = rainPh < 4.1;

  ctx.save();

  if (isHovered) {
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 26;
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 3.2;
  }

  const baseStone = isApocalypse
    ? "#44403c"
    : isSevere
    ? "#57534e"
    : corrosion > 0.3
    ? "#6b7280"
    : "#78716c";

  const shadowStone = isApocalypse ? "#1c1917" : isSevere ? "#292524" : "#44403c";
  const lightStone = isApocalypse ? "#78716c" : isSevere ? "#a8a29e" : "#d6d3d1";

  // Pedestal Ahu
  ctx.fillStyle = shadowStone;
  ctx.fillRect(x - 6, groundY - 14, w + 12, 16);
  ctx.fillStyle = baseStone;
  ctx.fillRect(x - 4, groundY - 14, w + 8, 4);

  // Statue Monolithic Profile Silhouette looking slightly up
  const neckY = y + h * 0.68;
  const jawY = y + h * 0.62;
  const mouthY = y + h * 0.52;
  const noseTipY = y + h * 0.38;
  const browY = y + h * 0.22;
  const topY = y + h * 0.05;

  ctx.beginPath();
  // Bottom left (back base)
  ctx.moveTo(x + w * 0.12, groundY - 14);
  // Back
  ctx.lineTo(x + w * 0.16, neckY);
  ctx.lineTo(x + w * 0.18, browY);
  // Skull cap
  ctx.quadraticCurveTo(x + w * 0.22, topY, x + w * 0.48, topY);
  ctx.lineTo(x + w * 0.68, topY + 5);

  // Brow ridge
  const browProtrusion = isApocalypse ? w * 0.72 : isSevere ? w * 0.76 : w * 0.80;
  ctx.lineTo(x + browProtrusion, browY);

  // Recessed eye cavity
  const eyeRecess = isApocalypse ? w * 0.62 : w * 0.58;
  ctx.lineTo(x + eyeRecess, browY + (noseTipY - browY) * 0.25);

  // Nose bridge
  const noseProtrusion = isApocalypse ? w * 0.76 : isSevere ? w * 0.82 : w * 0.88;
  ctx.lineTo(x + noseProtrusion, noseTipY);
  ctx.lineTo(x + w * 0.68, noseTipY + 8);

  // Mouth & Lips
  ctx.lineTo(x + w * 0.65, mouthY - 3);
  ctx.lineTo(x + (isApocalypse ? w * 0.70 : w * 0.74), mouthY);
  ctx.lineTo(x + w * 0.66, mouthY + 5);

  // Chin
  const chinProtrusion = isApocalypse ? w * 0.72 : isSevere ? w * 0.76 : w * 0.80;
  ctx.lineTo(x + chinProtrusion, jawY);
  ctx.lineTo(x + w * 0.52, neckY);

  // Torso down to base
  ctx.lineTo(x + w * 0.74, groundY - 14);
  ctx.closePath();

  const stoneGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  stoneGrad.addColorStop(0, lightStone);
  stoneGrad.addColorStop(0.45, baseStone);
  stoneGrad.addColorStop(1, shadowStone);
  ctx.fillStyle = stoneGrad;
  ctx.fill();

  ctx.strokeStyle = shadowStone;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Internal Facial Carvings
  ctx.save();

  // Brow shadow
  ctx.fillStyle = shadowStone;
  ctx.beginPath();
  ctx.moveTo(x + eyeRecess, browY + 4);
  ctx.lineTo(x + w * 0.38, browY + 6);
  ctx.lineTo(x + w * 0.36, browY + 22);
  ctx.lineTo(x + eyeRecess + 4, browY + 20);
  ctx.closePath();
  ctx.fill();

  // Long carved ear
  ctx.strokeStyle = shadowStone;
  ctx.lineWidth = isApocalypse ? 1 : 2.5;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.28, browY + 15);
  ctx.lineTo(x + w * 0.26, jawY - 5);
  ctx.quadraticCurveTo(x + w * 0.28, jawY + 6, x + w * 0.33, jawY + 2);
  ctx.stroke();

  // Jaw line
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.36, jawY);
  ctx.lineTo(x + chinProtrusion, jawY);
  ctx.stroke();

  // Lip cleft
  ctx.beginPath();
  ctx.moveTo(x + w * 0.52, mouthY);
  ctx.lineTo(x + (isApocalypse ? w * 0.68 : w * 0.74), mouthY);
  ctx.stroke();

  // Calcite Dissolution & Gypsum Degradation
  if (corrosion > 0.05) {
    // Chalky Calcite wash lines
    ctx.strokeStyle = isApocalypse
      ? "rgba(241, 245, 249, 0.7)"
      : "rgba(226, 232, 240, 0.5)";
    ctx.lineWidth = 2.5;
    const washLines = [
      { x1: x + w * 0.45, y1: topY + 4, x2: x + w * 0.48, y2: browY + 10 },
      { x1: x + eyeRecess + 2, y1: browY + 18, x2: x + w * 0.56, y2: mouthY - 4 },
      { x1: x + noseProtrusion - 2, y1: noseTipY, x2: x + w * 0.64, y2: jawY - 2 },
      { x1: x + w * 0.32, y1: jawY + 4, x2: x + w * 0.36, y2: groundY - 14 },
    ];
    for (const wl of washLines) {
      ctx.beginPath();
      ctx.moveTo(wl.x1, wl.y1);
      ctx.lineTo(wl.x2, wl.y2);
      ctx.stroke();
    }

    // Blackened Gypsum Crust Encrustation in crevices
    if (isSevere) {
      ctx.fillStyle = "rgba(28, 25, 23, 0.88)";
      ctx.beginPath();
      ctx.ellipse(x + eyeRecess + 2, browY + 12, 8, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x + w * 0.66, noseTipY + 6, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x + w * 0.62, jawY + 6, 10, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Deep Stress Fractures & Dissolution Fissures
    if (isApocalypse) {
      ctx.strokeStyle = "#0c0a09";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.38, topY + 6);
      ctx.lineTo(x + w * 0.42, browY - 2);
      ctx.lineTo(x + w * 0.39, browY + 15);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + w * 0.52, mouthY + 8);
      ctx.lineTo(x + w * 0.46, jawY + 12);
      ctx.lineTo(x + w * 0.50, groundY - 14);
      ctx.stroke();

      // Fallen rock fragments at base
      ctx.fillStyle = "#292524";
      ctx.fillRect(x + w * 0.72, groundY - 18, 8, 5);
      ctx.fillRect(x + w * 0.65, groundY - 16, 6, 4);
      ctx.fillRect(x + w * 0.78, groundY - 17, 7, 5);
    }
  }

  ctx.restore();
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

export function isPointInEiffel(px, py, eiffel) {
  const { x, y, width: w, height: h } = eiffel;
  return px >= x && px <= x + w && py >= y - 10 && py <= y + h + 5;
}

export function isPointInMoai(px, py, moai) {
  const { x, y, width: w, height: h } = moai;
  return px >= x - 10 && px <= x + w + 10 && py >= y && py <= y + h + 5;
}
