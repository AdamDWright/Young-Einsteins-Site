import "../css/main.css";
import { initLanguageToggle } from "./i18n.js";
import { initContactForm } from "./form.js";
import { initCookieBanner } from "./cookie-banner.js";
import { initTestimonials } from "./reviews.js";

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

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

// --- Scroll reveal: trigger once per element, then a hard timeout backstop ---
// so nothing can ever get stuck invisible regardless of what goes wrong.
if ("IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(".reveal");

  if (revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealTargets.forEach((el) => {
      el.classList.add("pre-reveal");
      observer.observe(el);
    });

    window.setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
      observer.disconnect();
    }, 4000);
  }
}

initLanguageToggle();
initContactForm();
initCookieBanner();
initTestimonials();
