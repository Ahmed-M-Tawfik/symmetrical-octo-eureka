// copy-static-assets.js
// Copies static files (index.html, style.css, assets/) to the dist directory

const fs = require("fs");
const path = require("path");

const projectRoot = __dirname;
const distDir = path.join(projectRoot, "dist");
const srcDir = path.join(projectRoot, "src");

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyFileSync(source, target) {
  let targetFile = target;
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }
  fs.copyFileSync(source, targetFile);
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  const files = fs.readdirSync(source);
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  files.forEach(function (file) {
    const curSource = path.join(source, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, path.join(target, file));
    } else {
      copyFileSync(curSource, target);
    }
  });
}

// Copy index.html
copyFileSync(path.join(srcDir, "index.html"), path.join(distDir, "index.html"));
// Copy style.css
copyFileSync(path.join(srcDir, "style.css"), path.join(distDir, "style.css"));
// Copy assets folder
copyFolderRecursiveSync(path.join(projectRoot, "assets"), path.join(distDir, "assets"));

console.log("Static assets copied to dist/");
