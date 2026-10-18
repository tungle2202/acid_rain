# 🌧️ Acid Rain Environmental Simulation

> Caution: This project is AI-slop, don't take it serious

[![Rust](https://img.shields.io/badge/rust-2024%2B-orange.svg?logo=rust)](https://www.rust-lang.org/)
[![Tauri v2](https://img.shields.io/badge/tauri-v2.0-blue.svg?logo=tauri)](https://tauri.app/)
[![Vite](https://img.shields.io/badge/vite-6.x-646CFF.svg?logo=vite)](https://vitejs.dev/)

An interactive, gamified environmental simulation software exploring the photochemical formation, atmospheric transport, and ecological consequences of acid rain.

## ⚙️ Install

Visit [Release Tab](https://github.com/tungle2202/acid_rain/releases) to download prebuilt binary or install wizard for your Windows system.

## 🌐 Languages & Localization

The application supports 2 language options:

- **English (`en`):** `src/locales/en.js`
- **Vietnamese (`vi`):** `src/locales/vi.js`

### Choosing Language Before Launching

You can select your language preference before launching the application in several convenient ways:

1. **Via Configuration File (`src/config.js`):**
   Open `src/config.js` and set the `language` property:
   ```javascript
   export const APP_CONFIG = {
     language: "vi", // Set to "vi" for Vietnamese or "en" for English
   };
   ```

2. **Via Pre-Configured NPM Scripts:**
   ```bash
   # Launch in Vietnamese
   npm run dev:vi

   # Launch in English
   npm run dev:en
   ```

3. **Via Environment Variable:**
   ```bash
   VITE_LANGUAGE=vi npm run dev
   ```

4. **Via URL Parameter (Browser Preview):**
   Append `?lang=vi` or `?lang=en` to the local development URL.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher ([Download](https://nodejs.org/))
- **Rust & Cargo:** v1.80.0 or higher ([rustup.rs](https://rustup.rs/))
- **Tauri CLI:**

  ```bash
  cargo install tauri-cli --version "^2.0.0"
  ```

- **OS Dependencies (Linux only):**

  ```bash
  sudo apt-get update && sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```

### Installation & Development

1. **Clone the repository:**

   ```bash
   https://github.com/tungle2202/acid_rain
   cd acid_rain
   ```

2. **Install frontend packages:**

   ```bash
   npm install
   ```

3. **Run in Tauri Development Mode:**

   ```bash
   npm run tauri dev
   ```

   *This starts the Vite local server and launches the native Tauri desktop window.*

4. **Run Web-Only Preview (Browser Canvas):**

   ```bash
   npm run dev
   ```

---

## 🛠️ Verification

Run the verification suite across frontend and backend:

```bash
# Frontend build test
npm run build

# Rust checks & unit tests
cargo check --manifest-path src-tauri/Cargo.toml
cargo test --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

---

## 📦 Production Build & Releases

Bundle into an optimized, self-contained desktop package:

```bash
# Full build
npm run tauri build

# Specific Windows bundle (WiX MSI Installer)
npm run tauri build -- --bundles msi
```

### Windows Release Formats
- **MSI Wizard Installer (`.msi`)**: Full Windows Installer wizard built with WiX Toolset, featuring directory selection, Start Menu / Desktop shortcuts, and Windows uninstaller registration.
- **Portable Executable (`.exe`)**: Single standalone binary with statically linked runtimes. Download and launch directly without installation.
