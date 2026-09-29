export default {
  app: {
    title: "Acid Rain Environmental Simulation",
    window_title: "Acid Rain",
    version: "v0.1.0",
  },
  dock: {
    advancement_tree: "Advancement Tree",
    advancement_tree_title: "View Minecraft-Style Reaction Tech Tree",
    pan_left_title: "Pan Left (Volcano & Factory)",
    pan_right_title: "Pan Right (Eiffel Tower & Moai Statue)",
    pan_volcano_factory: "🌋 Factory & Volcano",
    pan_monuments: "🗼 Eiffel & Moai 🗿",
    hover_eiffel: "🗼 Eiffel Tower (Iron - Fe)",
    hover_moai: "🗿 Moai Statue (Calcite - CaCO₃)",
    hover_volcano: "🌋 Active Volcano (Click to Erupt)",
    hover_factory: "🏭 Coal Power Plant (Click to Control)",
    hover_smoke: "☁️ Smoke Plume (Click for Research Mode)",
  },
  research_bar: {
    back_to_env: "⬅ Return to Environment",
    back_to_env_title: "Return to Landscape (Esc)",
    title: "Atmospheric Chemistry",
    title_smoke: "Atmospheric Chemistry (Troposphere)",
    title_eiffel: "Eiffel Tower Metallurgy & Acid Corrosion",
    title_moai: "Moai Statue Calcite & Stone Dissolution",
    add_molecule: "Add Molecule:",
    reset_field: "Reset Field",
  },
  factory_panel: {
    title: "Coal Power Plant",
    sub_label: "Industrial Emission Station",
    close_title: "Close Panel (Esc)",
    work_productivity: "Work Productivity",
    productivity_idle: "10% Idle",
    productivity_mid: "50%",
    productivity_max: "100% Max",
    preset_eco: "Eco (25%)",
    preset_standard: "Standard (60%)",
    preset_overdrive: "Overdrive (100%)",
    stack_emissions_title: "Real-Time Stack Emissions",
    smoke_density_label: "Smoke Density:",
    so2_rate_label: "SO₂ Output Rate:",
    nox_rate_label: "NOₓ Output Rate:",
    thermal_output_label: "Thermal Output:",
  },
  tech_tree_modal: {
    title: "TROPOSPHERIC TECH TREE",
    level: "LVL {level}",
    level_prefix: "LVL",
    close_title: "Close (Esc)",
    progress: "{completed} / {total} Advancements ({percent}%)",
    badge_done: "DONE",
    badge_locked: "LOCKED",
    locked_desc: "??? Hidden reaction chain. Drag molecules in smoke, Eiffel Tower, or Moai POV to discover!",
  },
  control_panel: {
    title: "Acid Rain Sim",
    status_header: "Simulation Status",
    status_active: "Atmosphere Active (60 FPS)",
    controls_header: "Environment Controls",
    rain_intensity: "Rainfall Intensity",
    so2_emissions: "SO₂ Emissions",
    nox_emissions: "NOₓ Emissions",
    indicators_header: "Ecological Indicators",
    precipitation_ph: "Precipitation pH",
    lake_acidity: "Lake Acidity",
    soil_quality: "Soil Quality",
    foliage_health: "Foliage Health",
  },
  metrics_status: {
    rain_apocalypse: "Acid Apocalypse (Trees Dying)",
    rain_severe: "Severe Acid Rain",
    rain_normal: "Normal / Clean",
    lake_mortality: "Fish Mortality (Dead Skeletons)",
    lake_stress: "Acid Stress (Low Population)",
    lake_thriving: "Thriving Habitat",
    soil_leaching: "Nutrient Leaching",
    tree_dead: "Defoliated & Dead",
    tree_chlorosis: "Chlorosis Stress",
    tree_healthy: "Healthy Foliage",
    smoke_light: "Light Gray Vapor",
    smoke_moderate: "Moderate Smog",
    smoke_dense: "Dense Pitch-Black Soot",
  },
  kill_feed: {
    acid_formed: "ACID FORMED",
    oxidized: "OXIDIZED",
    metal_corroded: "METAL CORRODED",
    rust_formed: "RUST FORMED",
    stone_eroded: "STONE ERODED",
  },
  chemistry: {
    default_no_reaction: "No spontaneous reaction between these molecules. Try combining an acid with Fe or CaCO₃, or an oxide with O₂/H₂O!",
    molecules: {
      SO2: {
        name: "Sulfur Dioxide",
        desc: "Toxic choking gas from coal combustion and volcanic eruptions.",
      },
      O2: {
        name: "Atmospheric Oxygen",
        desc: "Essential gas that photochemically oxidizes pollutants into acids.",
      },
      H2O: {
        name: "Water Vapor",
        desc: "Atmospheric humidity that hydrates airborne oxides into liquid acids.",
      },
      SO3: {
        name: "Sulfur Trioxide",
        desc: "Aggressive anhydride intermediate; instantaneously reacts with cloud moisture.",
      },
      NO: {
        name: "Nitric Oxide",
        desc: "Primary nitrogen oxide generated from lightning, furnaces, and volcanic heat.",
      },
      NO2: {
        name: "Nitrogen Dioxide",
        desc: "Pungent reddish-brown gas creating heavy urban and volcanic smog.",
      },
      H2SO4: {
        name: "Sulfuric Acid",
        desc: "King of Acids. Highly corrosive strong mineral acid that decimates aquatic and forest ecosystems.",
      },
      HNO3: {
        name: "Nitric Acid",
        desc: "Corrosive acid that strips tree leaves of magnesium and calcium, poisoning soil.",
      },
      H2SO3: {
        name: "Sulfurous Acid",
        desc: "Direct dissolution product of raw sulfur smoke into falling rainwater droplets.",
      },
      Fe: {
        name: "Iron (Wrought Metal)",
        desc: "Structural metallic element forming the Eiffel Tower framework. Vulnerable to acid attack.",
      },
      FeSO4: {
        name: "Iron(II) Sulfate",
        desc: "Corrosion salt produced when sulfuric acid rain dissolves metallic iron, releasing H₂ gas.",
      },
      "Fe(NO3)2": {
        name: "Iron(II) Nitrate",
        desc: "Soluble nitrate salt formed from nitric acid attack on steel and iron architecture.",
      },
      Fe2O3: {
        name: "Iron(III) Oxide (Rust)",
        desc: "Flaking reddish-brown oxidation product that weakens and perforates structural metal.",
      },
      CaCO3: {
        name: "Calcium Carbonate (Calcite)",
        desc: "Principal mineral in limestone, marble, and volcanic tuff making up the Moai monument.",
      },
      CaSO4: {
        name: "Calcium Sulfate (Gypsum)",
        desc: "Crusty sulfate mineral formed on stone statues that spalls off, destroying carved features.",
      },
      "Ca(NO3)2": {
        name: "Calcium Nitrate",
        desc: "Highly soluble calcium salt that leaches out of stone monuments during acid downpours.",
      },
      "H+": {
        name: "Hydrogen Ion (Acid Proton)",
        desc: "Free reactive H⁺ cation from dissociated acid precipitation, driving rapid metal and stone corrosion.",
      },
      "Fe2+": {
        name: "Iron(II) Ion (Dissolved Metal)",
        desc: "Aqueous Fe²⁺ cation released when acid precipitation attacks the metallic iron lattice, pitting structural girders.",
      },
      "Ca2+": {
        name: "Calcium Ion (Dissolved Calcite)",
        desc: "Soluble Ca²⁺ cation produced as acidic rainfall leaches calcium carbonate out of the stone statue.",
      },
    },
    advancements: {
      root_emissions: {
        title: "Heavy Emitters",
        subtitle: "Root of Pollution",
        desc: "Coal plants & volcanoes expel massive volumes of SO₂ and NO into the sky.",
      },
      so3_oxidation: {
        title: "Airborne Oxidation",
        desc: "Oxidize sulfur dioxide in the atmosphere to produce reactive sulfur trioxide.",
      },
      h2so3_formation: {
        title: "Sulfurous Shower",
        desc: "Raw sulfur fumes dissolve directly into raindrops, starting initial acid damage.",
      },
      h2so4_master: {
        title: "King of Corrosion (H₂SO₄)",
        desc: "Synthesize Sulfuric Acid! The paramount agent of severe environmental acid rain.",
      },
      no2_oxidation: {
        title: "Brown Smog Bloom",
        desc: "Nitric oxide oxidizes rapidly in fresh air, generating reddish nitrogen dioxide smog.",
      },
      hno3_master: {
        title: "Nitric Catastrophe (HNO₃)",
        desc: "Synthesize Nitric Acid! Toxic nitrate deluge that dissolves soil nutrients and fish gills.",
      },
      fe_acid_corrosion: {
        title: "Acid Metal Corrosion",
        desc: "Acidic H⁺ protons strip electrons from structural iron, dissolving metallic girders into aqueous Fe²⁺ ions and releasing hydrogen gas.",
      },
      fe_sulfuric: {
        title: "Sulfuric Steel Eater",
        desc: "Sulfuric acid dissolves metallic iron into soluble sulfate, eroding the Eiffel Tower.",
      },
      fe_nitric: {
        title: "Nitrate Metallurgy Ruin",
        desc: "Nitric acid attacks iron framework, stripping structural integrity with gas evolution.",
      },
      fe_rust: {
        title: "Atmospheric Rusting",
        desc: "Oxygen oxidizes damp iron into brittle reddish-brown rust patina.",
      },
      caco3_acid_dissolution: {
        title: "Calcite Stone Dissolution",
        desc: "Acid H⁺ protons react violently with calcium carbonate, effervescing carbon dioxide and dissolving stone statues into soluble calcium.",
      },
      caco3_sulfuric: {
        title: "Gypsum Stone Decay",
        desc: "Sulfuric rain converts solid stone into crumbling gypsum, dissolving ancient Moai carvings.",
      },
      caco3_nitric: {
        title: "Calcite Leaching Wash",
        desc: "Nitric acid dissolves calcium carbonate, washing away stone monument features forever.",
      },
    },
  },
};
