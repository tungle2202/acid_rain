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
    name: "Lưu huỳnh Đioxit",
    color: "#f59e0b",
    type: "pollutant",
    desc: "Khí độc gây ngạt sinh ra từ quá trình đốt than và núi lửa phun trào.",
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
    name: "Oxi Khí Quyển",
    color: "#38bdf8",
    type: "atmospheric",
    desc: "Khí thiết yếu tham gia oxi hóa quang hóa các chất ô nhiễm thành axit.",
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
    name: "Hơi Nước",
    color: "#60a5fa",
    type: "atmospheric",
    desc: "Độ ẩm khí quyển hydrat hóa các oxit lơ lửng thành giọt axit lỏng.",
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
    name: "Lưu huỳnh Trioxit",
    color: "#fb923c",
    type: "intermediate",
    desc: "Chất trung gian anhydrit hoạt tính cực cao; phản ứng tức thì với hơi ẩm đám mây.",
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
    name: "Nitơ Monoxit",
    color: "#a78bfa",
    type: "pollutant",
    desc: "Oxit nitơ sơ cấp sinh ra từ sấm sét, lò đốt công nghiệp và nhiệt độ núi lửa.",
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
    name: "Nitơ Đioxit",
    color: "#f43f5e",
    type: "intermediate",
    desc: "Khí màu nâu đỏ có mùi hắc đặc trưng, tác nhân chính gây khói mù đô thị và núi lửa.",
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
    name: "Axit Sunfuric",
    color: "#ef4444",
    type: "acid",
    pH: "2.8",
    tier: "legendary",
    desc: "Vua của các loại axit. Axit vô cơ cực mạnh ăn mòn tàn phá hệ sinh thái thủy sinh và rừng cây.",
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
    name: "Axit Nitric",
    color: "#ec4899",
    type: "acid",
    pH: "3.2",
    tier: "legendary",
    desc: "Axit ăn mòn mạnh làm rửa trôi magiê và canxi khỏi lá cây, gây nhiễm độc thổ nhưỡng.",
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
    name: "Axit Sunfurơ",
    color: "#eab308",
    type: "acid",
    pH: "4.2",
    tier: "rare",
    desc: "Sản phẩm hòa tan trực tiếp của khí lưu huỳnh thô vào các giọt nước mưa rơi xuống.",
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
    title: "Nguồn Phát Thải Nặng",
    subtitle: "Cội Nguồn Ô Nhiễm",
    desc: "Nhà máy nhiệt điện than và núi lửa xả lượng khổng lồ khí SO₂ và NO vào bầu trời.",
    tier: "root",
    icon: "🌋",
    parent: null,
    unlocked: true,
  },
  // Sulfur branch
  {
    id: "so3_oxidation",
    title: "Oxi Hóa Trong Không Khí",
    subtitle: "2SO₂ + O₂ ➔ 2SO₃",
    desc: "Oxi hóa lưu huỳnh đioxit trong khí quyển để tạo thành lưu huỳnh trioxit hoạt tính cao.",
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
    title: "Cơn Mưa Sunfurơ",
    subtitle: "SO₂ + H₂O ➔ H₂SO₃",
    desc: "Khói lưu huỳnh thô hòa tan trực tiếp vào hạt mưa, khởi phát tác hại axit ban đầu.",
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
    title: "Vua Ăn Mòn (H₂SO₄)",
    subtitle: "SO₃ + H₂O ➔ H₂SO₄",
    desc: "Tổng hợp thành công Axit Sunfuric! Tác nhân hủy diệt hàng đầu trong hiện tượng mưa axit nghiêm trọng.",
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
    title: "Bùng Phát Khói Nâu",
    subtitle: "2NO + O₂ ➔ 2NO₂",
    desc: "Nitơ monoxit nhanh chóng bị oxi hóa trong không khí, tạo ra khói mù nitơ đioxit màu nâu đỏ.",
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
    title: "Thảm Họa Axit Nitric (HNO₃)",
    subtitle: "3NO₂ + H₂O ➔ 2HNO₃ + NO",
    desc: "Tổng hợp thành công Axit Nitric! Cơn mưa nitrat độc hại hòa tan chất dinh dưỡng trong đất và làm hỏng mang cá.",
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
      reason: "Không có phản ứng tự phát giữa các phân tử này. Hãy thử kết hợp một oxit với O₂ hoặc H₂O!",
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
