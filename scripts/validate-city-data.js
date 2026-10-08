"use strict";

const fs = require("node:fs");
const path = require("node:path");

const datasets = ["mesta-kraje.json", "mesta-okresy.json"];
const canvas = { width: 760, height: 460 };

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

for (const filename of datasets) {
  const filepath = path.join(__dirname, "..", "data", filename);
  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));
  if (data.type !== "point" || !Array.isArray(data.items)) {
    throw new Error(`${filename}: expected a point dataset with an items array`);
  }

  const names = new Set();
  const answers = new Map();

  for (const item of data.items) {
    if (names.has(item.name)) {
      throw new Error(`${filename}: duplicate city name "${item.name}"`);
    }
    names.add(item.name);

    if (
      !Array.isArray(item.point) ||
      item.point.length !== 2 ||
      !item.point.every(Number.isFinite) ||
      item.point[0] < 0 ||
      item.point[0] > canvas.width ||
      item.point[1] < 0 ||
      item.point[1] > canvas.height
    ) {
      throw new Error(`${filename}: invalid map coordinates for "${item.name}"`);
    }

    if (!Array.isArray(item.answers) || !item.answers.includes(normalize(item.name))) {
      throw new Error(`${filename}: missing normalized full-name answer for "${item.name}"`);
    }

    for (const answer of item.answers) {
      const normalized = normalize(answer);
      if (!normalized) {
        throw new Error(`${filename}: empty answer for "${item.name}"`);
      }
      if (answers.has(normalized)) {
        throw new Error(
          `${filename}: answer "${answer}" matches both "${answers.get(normalized)}" and "${item.name}"`,
        );
      }
      answers.set(normalized, item.name);
    }
  }

  console.log(`${filename}: ${data.items.length} cities validated`);
}
