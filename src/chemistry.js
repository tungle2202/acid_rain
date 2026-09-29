/**
 * Chemistry Engine & Gamified Molecule Geometry
 * Defines:
 * - 2D geometric ball-and-stick structures for atmospheric molecules
 * - Reaction discovery rules & synthesis logic
 * - Minecraft-style Advancement/Tech Tree data
 * 
 * NOTE: Text fields contain placeholders waiting to be hydrated by the active language script.
 */

export const MOLECULES = {
  SO2: {
    id: "SO2",
    formula: "SO₂",
    name: "{{chemistry.molecules.SO2.name}}",
    color: "#f59e0b",
    type: "pollutant",
    desc: "{{chemistry.molecules.SO2.desc}}",
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
    name: "{{chemistry.molecules.O2.name}}",
    color: "#38bdf8",
    type: "atmospheric",
    desc: "{{chemistry.molecules.O2.desc}}",
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
    name: "{{chemistry.molecules.H2O.name}}",
    color: "#60a5fa",
    type: "atmospheric",
    desc: "{{chemistry.molecules.H2O.desc}}",
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
    name: "{{chemistry.molecules.SO3.name}}",
    color: "#fb923c",
    type: "intermediate",
    desc: "{{chemistry.molecules.SO3.desc}}",
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
    name: "{{chemistry.molecules.NO.name}}",
    color: "#a78bfa",
    type: "pollutant",
    desc: "{{chemistry.molecules.NO.desc}}",
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
    name: "{{chemistry.molecules.NO2.name}}",
    color: "#f43f5e",
    type: "intermediate",
    desc: "{{chemistry.molecules.NO2.desc}}",
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
    name: "{{chemistry.molecules.H2SO4.name}}",
    color: "#ef4444",
    type: "acid",
    pH: "2.8",
    tier: "legendary",
    desc: "{{chemistry.molecules.H2SO4.desc}}",
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
    name: "{{chemistry.molecules.HNO3.name}}",
    color: "#ec4899",
    type: "acid",
    pH: "3.2",
    tier: "legendary",
    desc: "{{chemistry.molecules.HNO3.desc}}",
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
    name: "{{chemistry.molecules.H2SO3.name}}",
    color: "#eab308",
    type: "acid",
    pH: "4.2",
    tier: "rare",
    desc: "{{chemistry.molecules.H2SO3.desc}}",
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
    title: "{{chemistry.advancements.root_emissions.title}}",
    subtitle: "{{chemistry.advancements.root_emissions.subtitle}}",
    desc: "{{chemistry.advancements.root_emissions.desc}}",
    tier: "root",
    icon: "🌋",
    parent: null,
    unlocked: true,
  },
  // Sulfur branch
  {
    id: "so3_oxidation",
    title: "{{chemistry.advancements.so3_oxidation.title}}",
    subtitle: "2SO₂ + O₂ ➔ 2SO₃",
    desc: "{{chemistry.advancements.so3_oxidation.desc}}",
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
    title: "{{chemistry.advancements.h2so3_formation.title}}",
    subtitle: "SO₂ + H₂O ➔ H₂SO₃",
    desc: "{{chemistry.advancements.h2so3_formation.desc}}",
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
    title: "{{chemistry.advancements.h2so4_master.title}}",
    subtitle: "SO₃ + H₂O ➔ H₂SO₄",
    desc: "{{chemistry.advancements.h2so4_master.desc}}",
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
    title: "{{chemistry.advancements.no2_oxidation.title}}",
    subtitle: "2NO + O₂ ➔ 2NO₂",
    desc: "{{chemistry.advancements.no2_oxidation.desc}}",
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
    title: "{{chemistry.advancements.hno3_master.title}}",
    subtitle: "3NO₂ + H₂O ➔ 2HNO₃ + NO",
    desc: "{{chemistry.advancements.hno3_master.desc}}",
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
    this.failReason = "No spontaneous reaction between these molecules. Try combining an oxide with O₂ or H₂O!";
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
      reason: this.failReason,
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

/**
 * Hydrate chemistry data and engine instances with the active locale translations
 */
export function applyChemistryLocale(localeData) {
  if (!localeData?.chemistry) return;

  if (localeData.chemistry.molecules) {
    for (const [id, mol] of Object.entries(MOLECULES)) {
      if (localeData.chemistry.molecules[id]) {
        mol.name = localeData.chemistry.molecules[id].name;
        mol.desc = localeData.chemistry.molecules[id].desc;
      }
    }
  }

  if (localeData.chemistry.advancements) {
    for (const node of ADVANCEMENT_NODES) {
      const adv = localeData.chemistry.advancements[node.id];
      if (adv) {
        if (adv.title) node.title = adv.title;
        if (adv.subtitle) node.subtitle = adv.subtitle;
        if (adv.desc) node.desc = adv.desc;
      }
    }

    if (chemistryEngine?.advancements) {
      for (const node of chemistryEngine.advancements) {
        const adv = localeData.chemistry.advancements[node.id];
        if (adv) {
          if (adv.title) node.title = adv.title;
          if (adv.subtitle) node.subtitle = adv.subtitle;
          if (adv.desc) node.desc = adv.desc;
        }
      }
    }
  }

  if (chemistryEngine && localeData.chemistry.default_no_reaction) {
    chemistryEngine.failReason = localeData.chemistry.default_no_reaction;
  }
}
