import "./style.css";

// Canvas and Simulation Renderer setup
const canvas = document.getElementById("sim-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

function resizeCanvas() {
  const container = canvas.parentElement;
  if (!container) return;
  width = container.clientWidth;
  height = container.clientHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Visual test simulation particles
const particles = [];
for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * (width || 800),
    y: Math.random() * (height || 600),
    speed: 2 + Math.random() * 4,
    length: 10 + Math.random() * 15,
    opacity: 0.2 + Math.random() * 0.6,
  });
}

function render() {
  ctx.fillStyle = "rgba(12, 16, 23, 0.35)";
  ctx.fillRect(0, 0, width, height);

  // Draw rain particles
  ctx.strokeStyle = "rgba(79, 172, 254, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const p of particles) {
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y + p.length);

    p.y += p.speed;
    if (p.y > height) {
      p.y = -p.length;
      p.x = Math.random() * width;
    }
  }
  ctx.stroke();

  // Terrain / Water base line
  ctx.fillStyle = "#1e3a5f";
  ctx.fillRect(0, height - 40, width, 40);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);

// Sidebar slider bindings
const rainInput = document.getElementById("rain-intensity");
const phMetric = document.getElementById("ph-metric");

if (rainInput && phMetric) {
  rainInput.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    const calculatedPh = (6.0 - (val / 100) * 2.0).toFixed(1);
    phMetric.textContent = calculatedPh;
  });
}

console.log("Acid Rain simulation frontend initialized via Vite.");
