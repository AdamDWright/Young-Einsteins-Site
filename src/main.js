import "./style.css";
import { initLanguageToggle, translate } from "./i18n.js";

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

function currentLang() {
  return document.documentElement.lang === "vi" ? "vi" : "en";
}

// --- Mobile nav ---
function closeMenu() {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.classList.remove("is-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

// --- Active nav link (per-page, since header is a shared static partial) ---
const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll(`[data-page-link="${currentPage}"]`).forEach((link) => {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  });
}

// --- Footer year ---
const footerYear = document.getElementById("footer-year");
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

// --- Scroll reveal ---
const revealTargets = document.querySelectorAll(".reveal");
if (revealTargets.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// --- Language toggle ---
initLanguageToggle();

// --- Contact form (Web3Forms) ---
function setStatus(key, type) {
  if (!formStatus) return;
  formStatus.textContent = translate(currentLang(), key);
  formStatus.dataset.i18n = key;
  formStatus.className = `form-status mt-4 font-bold ${
    type === "pending" ? "text-brand-blue" : type === "success" ? "text-brand-green" : type === "error" ? "text-brand-red" : ""
  }`.trim();
}

function validateForm(form) {
  const requiredFields = Array.from(form.querySelectorAll("[required]"));
  let isValid = true;

  requiredFields.forEach((field) => {
    const errorEl = field.closest(".form-group")?.querySelector(".field-error");
    const value = field.value.trim();
    let messageKey = "";

    if (!value) {
      messageKey = "contact.form.error.required";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      messageKey = "contact.form.error.email";
    }

    field.classList.toggle("is-error", Boolean(messageKey));

    if (errorEl) {
      if (messageKey) {
        errorEl.textContent = translate(currentLang(), messageKey);
        errorEl.dataset.i18n = messageKey;
      } else {
        errorEl.textContent = "";
        errorEl.removeAttribute("data-i18n");
      }
    }

    if (messageKey) isValid = false;
  });

  return isValid;
}

if (contactForm) {
  contactForm.querySelectorAll("[required]").forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("is-error");
      const errorEl = field.closest(".form-group")?.querySelector(".field-error");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.removeAttribute("data-i18n");
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm(contactForm)) {
      setStatus("contact.form.status.validation", "error");
      return;
    }

    setStatus("contact.form.status.sending", "pending");

    if (submitButton) submitButton.disabled = true;

    const accessKey = contactForm.dataset.web3formsAccessKey || "";

    if (!accessKey) {
      setStatus("contact.form.status.error", "error");
      if (submitButton) submitButton.disabled = false;
      return;
    }

    try {
      const formData = new FormData(contactForm);
      formData.append("access_key", accessKey);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        contactForm.reset();
        setStatus("contact.form.status.success", "success");
      } else {
        setStatus("contact.form.status.error", "error");
      }
    } catch {
      setStatus("contact.form.status.error", "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
