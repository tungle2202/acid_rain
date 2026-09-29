/**
 * Chemistry Engine & Gamified Molecule Geometry
 * Defines:
 * - 2D geometric ball-and-stick structures for atmospheric molecules
 * - Reaction discovery rules & synthesis logic
 * - Minecraft-style Advancement/Tech Tree data
 */

export const MOLECULES = {
  SO2: {
    id: "SO2",
    formula: "SO₂",
    name: "Sulfur Dioxide",
    color: "#f59e0b",
    type: "pollutant",
    desc: "Toxic choking gas from coal combustion and volcanic eruptions.",
    // Bent geometry: S at origin, 2 O at ~119°
    atoms: [
      { x: 0, y: -6, symbol: "S", color: "#f59e0b", r: 16 },
      { x: -18, y: 14, symbol: "O", color: "#ef4444", r: 12 },
      { x: 18, y: 14, symbol: "O", color: "#ef4444", r: 12 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
    ],
  },
  O2: {
    id: "O2",
    formula: "O₂",
    name: "Atmospheric Oxygen",
    color: "#38bdf8",
    type: "atmospheric",
    desc: "Essential gas that photochemically oxidizes pollutants into acids.",
    // Linear diatomic: 2 O atoms
    atoms: [
      { x: -14, y: 0, symbol: "O", color: "#38bdf8", r: 13 },
      { x: 14, y: 0, symbol: "O", color: "#38bdf8", r: 13 },
    ],
    bonds: [{ from: 0, to: 1, type: "double" }],
  },
  H2O: {
    id: "H2O",
    formula: "H₂O",
    name: "Water Vapor",
    color: "#60a5fa",
    type: "atmospheric",
    desc: "Atmospheric humidity that hydrates airborne oxides into liquid acids.",
    // Bent geometry: O at origin, 2 H at ~104.5°
    atoms: [
      { x: 0, y: -5, symbol: "O", color: "#3b82f6", r: 14 },
      { x: -15, y: 11, symbol: "H", color: "#f8fafc", r: 8 },
      { x: 15, y: 11, symbol: "H", color: "#f8fafc", r: 8 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
    ],
  },
  SO3: {
    id: "SO3",
    formula: "SO₃",
    name: "Sulfur Trioxide",
    color: "#fb923c",
    type: "intermediate",
    desc: "Aggressive anhydride intermediate; instantaneously reacts with cloud moisture.",
    // Trigonal planar: 3 O atoms around central S at 120°
    atoms: [
      { x: 0, y: 0, symbol: "S", color: "#f59e0b", r: 16 },
      { x: 0, y: -24, symbol: "O", color: "#ef4444", r: 12 },
      { x: 21, y: 12, symbol: "O", color: "#ef4444", r: 12 },
      { x: -21, y: 12, symbol: "O", color: "#ef4444", r: 12 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
      { from: 0, to: 3, type: "double" },
    ],
  },
  NO: {
    id: "NO",
    formula: "NO",
    name: "Nitric Oxide",
    color: "#a78bfa",
    type: "pollutant",
    desc: "Primary nitrogen oxide generated from lightning, furnaces, and volcanic heat.",
    // Diatomic: N - O
    atoms: [
      { x: -13, y: 0, symbol: "N", color: "#8b5cf6", r: 13 },
      { x: 13, y: 0, symbol: "O", color: "#ef4444", r: 12 },
    ],
    bonds: [{ from: 0, to: 1, type: "double" }],
  },
  NO2: {
    id: "NO2",
    formula: "NO₂",
    name: "Nitrogen Dioxide",
    color: "#f43f5e",
    type: "intermediate",
    desc: "Pungent reddish-brown gas creating heavy urban and volcanic smog.",
    // Bent geometry: N with 2 O
    atoms: [
      { x: 0, y: -6, symbol: "N", color: "#8b5cf6", r: 14 },
      { x: -17, y: 13, symbol: "O", color: "#ef4444", r: 12 },
      { x: 17, y: 13, symbol: "O", color: "#ef4444", r: 12 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
    ],
  },
  H2SO4: {
    id: "H2SO4",
    formula: "H₂SO₄",
    name: "Sulfuric Acid",
    color: "#ef4444",
    type: "acid",
    pH: "2.8",
    tier: "legendary",
    desc: "King of Acids. Highly corrosive strong mineral acid that decimates aquatic and forest ecosystems.",
    atoms: [
      { x: 0, y: 0, symbol: "S", color: "#f59e0b", r: 16 },
      { x: 0, y: -24, symbol: "O", color: "#ef4444", r: 12 },
      { x: 0, y: 24, symbol: "O", color: "#ef4444", r: 12 },
      { x: -24, y: 0, symbol: "O", color: "#ef4444", r: 12 },
      { x: -36, y: -12, symbol: "H", color: "#f8fafc", r: 8 },
      { x: 24, y: 0, symbol: "O", color: "#ef4444", r: 12 },
      { x: 36, y: 12, symbol: "H", color: "#f8fafc", r: 8 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
      { from: 0, to: 3, type: "single" },
      { from: 3, to: 4, type: "single" },
      { from: 0, to: 5, type: "single" },
      { from: 5, to: 6, type: "single" },
    ],
  },
  HNO3: {
    id: "HNO3",
    formula: "HNO₃",
    name: "Nitric Acid",
    color: "#ec4899",
    type: "acid",
    pH: "3.2",
    tier: "legendary",
    desc: "Corrosive acid that strips tree leaves of magnesium and calcium, poisoning soil.",
    atoms: [
      { x: 0, y: 0, symbol: "N", color: "#8b5cf6", r: 14 },
      { x: 0, y: -22, symbol: "O", color: "#ef4444", r: 12 },
      { x: 20, y: 10, symbol: "O", color: "#ef4444", r: 12 },
      { x: -20, y: 10, symbol: "O", color: "#ef4444", r: 12 },
      { x: -34, y: 2, symbol: "H", color: "#f8fafc", r: 8 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 3, to: 4, type: "single" },
    ],
  },
  H2SO3: {
    id: "H2SO3",
    formula: "H₂SO₃",
    name: "Sulfurous Acid",
    color: "#eab308",
    type: "acid",
    pH: "4.2",
    tier: "rare",
    desc: "Direct dissolution product of raw sulfur smoke into falling rainwater droplets.",
    atoms: [
      { x: 0, y: -6, symbol: "S", color: "#f59e0b", r: 15 },
      { x: 0, y: 18, symbol: "O", color: "#ef4444", r: 12 },
      { x: -20, y: -6, symbol: "O", color: "#ef4444", r: 12 },
      { x: -32, y: -16, symbol: "H", color: "#f8fafc", r: 8 },
      { x: 20, y: -6, symbol: "O", color: "#ef4444", r: 12 },
      { x: 32, y: -16, symbol: "H", color: "#f8fafc", r: 8 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 2, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
      { from: 4, to: 5, type: "single" },
    ],
  },
};

// ========================================================
// REACTION DISCOVERY REGISTRY & MINECRAFT ADVANCEMENT TREE
// ========================================================
export const ADVANCEMENT_NODES = [
  {
    id: "root_emissions",
    title: "Heavy Emitters",
    subtitle: "Root of Pollution",
    desc: "Coal plants & volcanoes expel massive volumes of SO₂ and NO into the sky.",
    tier: "root",
    icon: "🌋",
    parent: null,
    unlocked: true,
  },
  // Sulfur branch
  {
    id: "so3_oxidation",
    title: "Airborne Oxidation",
    subtitle: "2SO₂ + O₂ ➔ 2SO₃",
    desc: "Oxidize sulfur dioxide in the atmosphere to produce reactive sulfur trioxide.",
    tier: "rare",
    icon: "🔥",
    parent: "root_emissions",
    reaction: {
      reactants: ["SO2", "O2"],
      product: "SO3",
      equation: "2SO₂ + O₂ ➔ 2SO₃",
    },
    unlocked: false,
  },
  {
    id: "h2so3_formation",
    title: "Sulfurous Shower",
    subtitle: "SO₂ + H₂O ➔ H₂SO₃",
    desc: "Raw sulfur fumes dissolve directly into raindrops, starting initial acid damage.",
    tier: "rare",
    icon: "🌧️",
    parent: "root_emissions",
    reaction: {
      reactants: ["SO2", "H2O"],
      product: "H2SO3",
      equation: "SO₂ + H₂O ➔ H₂SO₃",
    },
    unlocked: false,
  },
  {
    id: "h2so4_master",
    title: "King of Corrosion (H₂SO₄)",
    subtitle: "SO₃ + H₂O ➔ H₂SO₄",
    desc: "Synthesize Sulfuric Acid! The paramount agent of severe environmental acid rain.",
    tier: "legendary",
    icon: "💀",
    parent: "so3_oxidation",
    reaction: {
      reactants: ["SO3", "H2O"],
      product: "H2SO4",
      equation: "SO₃ + H₂O ➔ H₂SO₄",
    },
    unlocked: false,
  },
  // Nitrogen branch
  {
    id: "no2_oxidation",
    title: "Brown Smog Bloom",
    subtitle: "2NO + O₂ ➔ 2NO₂",
    desc: "Nitric oxide oxidizes rapidly in fresh air, generating reddish nitrogen dioxide smog.",
    tier: "rare",
    icon: "💨",
    parent: "root_emissions",
    reaction: {
      reactants: ["NO", "O2"],
      product: "NO2",
      equation: "2NO + O₂ ➔ 2NO₂",
    },
    unlocked: false,
  },
  {
    id: "hno3_master",
    title: "Nitric Catastrophe (HNO₃)",
    subtitle: "3NO₂ + H₂O ➔ 2HNO₃ + NO",
    desc: "Synthesize Nitric Acid! Toxic nitrate deluge that dissolves soil nutrients and fish gills.",
    tier: "legendary",
    icon: "⚡",
    parent: "no2_oxidation",
    reaction: {
      reactants: ["NO2", "H2O"],
      product: "HNO3",
      equation: "3NO₂ + H₂O ➔ 2HNO₃ + NO",
    },
    unlocked: false,
  },
];

class GamifiedChemistryEngine {
  constructor() {
    this.advancements = JSON.parse(JSON.stringify(ADVANCEMENT_NODES));
    this.unlockedMolecules = new Set(["SO2", "O2", "H2O", "NO"]);
    this.discoveryHistory = [];
  }

  getAvailableMolecules() {
    return Array.from(this.unlockedMolecules).map((id) => MOLECULES[id]);
  }

  checkReaction(reactantA, reactantB) {
    if (!reactantA || !reactantB) return null;

    const pair = [reactantA, reactantB].sort();

    for (const node of this.advancements) {
      if (!node.reaction) continue;
      const rxPair = [...node.reaction.reactants].sort();

      if (pair[0] === rxPair[0] && pair[1] === rxPair[1]) {
        const isNew = !node.unlocked;
        node.unlocked = true;

        // Unlock product molecule into field
        if (MOLECULES[node.reaction.product]) {
          this.unlockedMolecules.add(node.reaction.product);
        }

        if (isNew) {
          this.discoveryHistory.unshift(node);
        }

        return {
          success: true,
          advancement: node,
          equation: node.reaction.equation,
          product: node.reaction.product,
          isNew,
        };
      }
    }

    return {
      success: false,
      reason: "No spontaneous reaction between these molecules. Try combining an oxide with O₂ or H₂O!",
    };
  }

  getProgress() {
    const total = this.advancements.filter((n) => n.reaction).length;
    const completed = this.advancements.filter((n) => n.reaction && n.unlocked).length;
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100),
    };
  }
}

export const chemistryEngine = new GamifiedChemistryEngine();
