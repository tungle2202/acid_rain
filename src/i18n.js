import { APP_CONFIG } from "./config.js";
import en from "./locales/en.js";
import vi from "./locales/vi.js";
import { applyChemistryLocale } from "./chemistry.js";

// Registry of available locales - easily extensible for new languages
export const LOCALES = {
  en,
  vi,
};

let currentLang = "en";
let currentLocale = en;

/**
 * Determine language preference in order of priority:
 * 1. URL search param (e.g. ?lang=vi)
 * 2. localStorage ('app_language')
 * 3. Environment variable (import.meta.env.VITE_LANGUAGE)
 * 4. Pre-launch config (APP_CONFIG.language in src/config.js)
 * 5. Fallback ('en')
 */
export function resolveLanguage() {
  // 1. URL param
  try {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam && LOCALES[langParam]) {
      return langParam;
    }
  } catch (e) {
    // Ignore in non-browser/restricted environments
  }

  // 2. localStorage
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("app_language");
      if (stored && LOCALES[stored]) {
        return stored;
      }
    }
  } catch (e) {}

  // 3. Environment variable (Vite mode/env)
  const envLang = import.meta.env?.VITE_LANGUAGE;
  if (envLang && LOCALES[envLang]) {
    return envLang;
  }

  // 4. Pre-launch configuration file (src/config.js)
  if (APP_CONFIG?.language && LOCALES[APP_CONFIG.language]) {
    return APP_CONFIG.language;
  }

  return "en";
}

/**
 * Translate a key path (e.g. 'control_panel.title') with optional params
 */
export function t(key, params = {}) {
  const getNested = (obj, path) => {
    return path.split(".").reduce((curr, p) => (curr && curr[p] !== undefined ? curr[p] : undefined), obj);
  };

  let value = getNested(currentLocale, key);
  if (value === undefined) {
    // Fallback to English
    value = getNested(LOCALES.en, key);
  }

  if (typeof value !== "string") {
    return key;
  }

  // Replace {paramName} placeholders
  return value.replace(/\{(\w+)\}/g, (match, param) => {
    return params[param] !== undefined ? params[param] : match;
  });
}

export function getCurrentLang() {
  return currentLang;
}

export function getCurrentLocale() {
  return currentLocale;
}

/**
 * Sets active language and updates the DOM placeholders and chemistry data
 */
export function setLanguage(lang) {
  if (!LOCALES[lang]) {
    console.warn(`[i18n] Language '${lang}' not found, falling back to 'en'`);
    lang = "en";
  }

  currentLang = lang;
  currentLocale = LOCALES[lang];

  // Update HTML tag lang & title if document is available
  if (typeof document !== "undefined") {
    if (document.documentElement) {
      document.documentElement.lang = currentLang;
    }

    document.title = t("app.title");

    // Apply placeholders to DOM elements
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        el.textContent = t(key);
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key) {
        el.title = t(key);
      }
    });
  }

  // Apply chemistry translations
  applyChemistryLocale(currentLocale);
}

/**
 * Initialize i18n system before main app mechanisms start
 */
export function initI18n() {
  const resolved = resolveLanguage();
  setLanguage(resolved);
}
