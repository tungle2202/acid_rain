# Project Guidelines: Acid Rain Environmental Simulation

## 1. Project Overview & Goals

- **Objective:** Build an educational environmental simulation software (acid rain, chemical reactions of SO2/NOx, ecological impact on soil/water/plants).
- **UX Target:** Low-tech friendly, intuitive, zero configuration, single executable distribution.

## 2. Tech Stack

- **Backend (Core Simulation):** Rust (Edition 2021+), enforcing Data-Oriented Design (DOD) principles.
- **Frontend & UI:** Tauri v2, HTML5 Canvas for the simulation renderer, HTML/CSS/JS for the control panel UI.
- **Dev Environment:** Linux, Neovim, Cargo, Tauri CLI.
- **Target Platforms:** Cross-platform compilation for x86_64 (Windows/Linux) and ARM64 (Apple Silicon), follows POSIX rules strictly.

## 3. Core Architecture & Design Rules (CRITICAL)

- **Data-Oriented Design (DOD):**
  - **NO OOP:** Avoid heavy class/struct hierarchies or individual objects per particle.
  - **SoA (Struct of Arrays):** Use flat, contiguous memory vectors (`Vec<u8>`, `Vec<f32>`) for grid data (e.g., element types, pH levels, temperatures) to maximize CPU cache locality.
  - **Separation:** Strictly separate Data structures from Behavior/Systems logic.
- **Single-Window Layout:** Run entirely within a single Tauri window (Left: Simulation Canvas, Right: Control Panel sidebar).
- **Performance & Safety:** Leverage Rust's safe concurrency model (`Arc<Mutex<T>>` or channels) for IPC and data bridging between backend threads and frontend UI.

## 4. Directory Structure

```text
acid_rain/
├── package.json
├── src/                         # Frontend UI & Canvas Renderer
│   ├── index.html
│   └── main.js
└── src-tauri/                   # Rust Backend
    ├── Cargo.toml
    ├── tauri.conf.json
    └── src/
        ├── main.rs              # Tauri entry point
        ├── lib.rs               # Tauri IPC commands & bridge
        └── simulation/          # DOD Core Simulation Logic
            ├── mod.rs
            ├── grid.rs          # Flattened contiguous grid buffers
            └── systems.rs       # Pure data transformation functions
```

## 5. Development & Build Commands

- **Setup & Dependencies:**
  - Install frontend dependencies: `npm install` (or `pnpm install`)
  - Install Tauri CLI: `cargo install tauri-cli --version "^2.0.0"`
- **Development Server:**
  - Run app in dev mode: `npm run tauri dev` (or `cargo tauri dev`)
- **Backend (Rust):**
  - Check compilation: `cargo check --manifest-path src-tauri/Cargo.toml`
  - Run test suite: `cargo test --manifest-path src-tauri/Cargo.toml`
  - Linting: `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`
  - Format checking: `cargo fmt --manifest-path src-tauri/Cargo.toml --check`
- **Production Build:**
  - Bundle single executable: `npm run tauri build`

## 6. Agent Constraints & Directives

- **High-Performance Rust:** Always write idiomatic Rust code optimized for high-performance loops; strictly avoid heavy heap allocations inside the main simulation update loop.
- **DOD & Compatibility:** Ensure all proposed features adhere to the DOD paradigm and maintain compatibility across x86_64 and ARM64 targets, follow POSIX rules strictly.
- **Architecture Integrity:** Keep the codebase, modular, scalable, and directly aligned with the single-window Tauri architecture.
- **Verification:** Always verify code changes with `cargo check` and `cargo test` before concluding tasks.
