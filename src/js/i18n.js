import { translations } from "./translations.js";

export function translate(lang, key) {
  const entry = translations[key];
  if (!entry) return null;
  return entry[lang] ?? entry.en ?? null;
}

function applyLanguage(lang) {
  const activeLang = lang === "vi" ? "vi" : "en";
  document.documentElement.lang = activeLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = translate(activeLang, el.getAttribute("data-i18n"));
    if (text !== null) el.textContent = text;
  });

  // Same as [data-i18n], but sets innerHTML instead of textContent - only
  // for keys whose translated string intentionally contains simple inline
  // markup (e.g. <strong> around a specific phrase). Content always comes
  // from our own translations.js, never user input.
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const text = translate(activeLang, el.getAttribute("data-i18n-html"));
    if (text !== null) el.innerHTML = text;
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.getAttribute("data-i18n-attr")
      .split(";")
      .forEach((pair) => {
        const [attr, key] = pair.split(":").map((part) => part.trim());
        if (!attr || !key) return;
        const text = translate(activeLang, key);
        if (text !== null) el.setAttribute(attr, text);
      });
  });

  document.querySelectorAll(".lang-option").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.lang === activeLang);
  });

  localStorage.setItem("ye-lang", activeLang);

  // For dynamic content that embeds a live value into a translated string
  // (e.g. the contact form's character counter) - [data-i18n] alone can't
  // handle that, since it fully overwrites textContent with the static
  // translation, losing the embedded value.
  document.dispatchEvent(new CustomEvent("languagechange"));
}

export function initLanguageToggle() {
  applyLanguage(localStorage.getItem("ye-lang") || "en");

  // Two toggle instances exist (mobile header bar + desktop nav row), both
  // sharing the .lang-toggle/.lang-option classes - wire up every instance.
  document.querySelectorAll(".lang-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      const option = event.target.closest(".lang-option");
      if (option) applyLanguage(option.dataset.lang);
    });
  });
}
