// Generates a transparent forest-themed foreground PNG for your game
// Run: npm install canvas
// Then: node generate_forest_foreground.js

const { createCanvas } = require("canvas");
const fs = require("fs");

const width = 1667;
const height = 500;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Transparent background
ctx.clearRect(0, 0, width, height);

// Mist effect
ctx.globalAlpha = 0.15;
ctx.fillStyle = "#aaa"; // light grey mist
ctx.beginPath();
ctx.ellipse(width / 2, height - 80, width / 2, 60, 0, 0, Math.PI * 2);
ctx.fill();
ctx.globalAlpha = 1.0;

// Light rays
let rayCount = 6;
let raySpacing = width / rayCount;
for (let i = 0; i < rayCount; i++) {
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.translate(raySpacing * i, 0);
  ctx.rotate((Math.PI / 12) * 2);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height + 100);
  ctx.lineWidth = 60;
  ctx.strokeStyle = "#eee"; // light grey rays
  ctx.stroke();
  ctx.restore();
}

// Faint foliage silhouettes
// Single tree trunk in the foreground

// Greyscale trunk spanning full image height with irregular sides
ctx.globalAlpha = 0.8;
const trunkWidth = 60;
const trunkHeight = height;
const trunkX = width / 2 - trunkWidth / 2;
const trunkY = 0;
ctx.save();
ctx.beginPath();
// Draw irregular sides using Bezier curves
ctx.moveTo(trunkX, trunkY);
// Left side: wider at bottom, gently narrows as it goes up
ctx.bezierCurveTo(
  trunkX - 8,
  trunkY + trunkHeight * 0.25,
  trunkX - 6,
  trunkY + trunkHeight * 0.75,
  trunkX,
  trunkY + trunkHeight
);
ctx.lineTo(trunkX + trunkWidth, trunkY + trunkHeight);
// Right side: wider at bottom, gently narrows as it goes up
ctx.bezierCurveTo(
  trunkX + trunkWidth + 8,
  trunkY + trunkHeight * 0.75,
  trunkX + trunkWidth + 6,
  trunkY + trunkHeight * 0.25,
  trunkX + trunkWidth,
  trunkY
);
ctx.closePath();
ctx.fillStyle = "#888"; // medium grey trunk
ctx.fill();
ctx.restore();
ctx.globalAlpha = 1.0;

// More surface features: side ridges and knots
ctx.save();
ctx.globalAlpha = 0.4;
// Left side ridges
for (let i = 0; i < 4; i++) {
  ctx.beginPath();
  ctx.moveTo(trunkX + 2, trunkY + 40 + i * 90);
  ctx.bezierCurveTo(
    trunkX - 6,
    trunkY + 60 + i * 90,
    trunkX + 10,
    trunkY + 80 + i * 90,
    trunkX + 6,
    trunkY + 100 + i * 90
  );
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#aaa"; // light grey ridges
  ctx.stroke();
}
// Right side ridges
for (let i = 0; i < 4; i++) {
  ctx.beginPath();
  ctx.moveTo(trunkX + trunkWidth - 2, trunkY + 60 + i * 90);
  ctx.bezierCurveTo(
    trunkX + trunkWidth + 6,
    trunkY + 80 + i * 90,
    trunkX + trunkWidth - 10,
    trunkY + 100 + i * 90,
    trunkX + trunkWidth - 6,
    trunkY + 120 + i * 90
  );
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#aaa";
  ctx.stroke();
}
ctx.globalAlpha = 1.0;
ctx.restore();

// Embellish trunk with surface features
// Vertical lines for bark texture
ctx.save();
ctx.globalAlpha = 0.3;
for (let i = 0; i < 6; i++) {
  ctx.beginPath();
  ctx.moveTo(trunkX + 10 + i * 8, trunkY + 10);
  ctx.lineTo(trunkX + 10 + i * 8, trunkY + trunkHeight - 10);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#999"; // grey vertical bark lines
  ctx.stroke();
}
ctx.globalAlpha = 1.0;
ctx.restore();

// Draw knots
ctx.save();
ctx.globalAlpha = 0.5;
ctx.fillStyle = "#444"; // dark grey knots
ctx.beginPath();
ctx.ellipse(trunkX + trunkWidth / 2, trunkY + trunkHeight / 3, 8, 12, 0, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.ellipse(trunkX + trunkWidth / 3, trunkY + trunkHeight / 1.5, 6, 9, 0, 0, Math.PI * 2);
ctx.fill();
ctx.restore();

// Subtle color variation
const gradient = ctx.createLinearGradient(trunkX, trunkY, trunkX + trunkWidth, trunkY + trunkHeight);
gradient.addColorStop(0, "#888");
gradient.addColorStop(0.5, "#aaa");
gradient.addColorStop(1, "#555");
ctx.globalAlpha = 0.25;
ctx.fillStyle = gradient;
ctx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);
ctx.globalAlpha = 1.0;

// Save PNG
const out = fs.createWriteStream("assets/background/forest/fglayer-forest.png");
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on("finish", () => console.log("Foreground PNG created: assets/background/forest/fglayer-forest.png"));
