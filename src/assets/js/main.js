import AOS from "aos";
import GLightbox from "glightbox";

export function initializeAOS() {
  AOS.init({
    duration: 600,
    easing: "ease-in-out",
    once: true,
    mirror: false,
  });
}

export function initializeGLightbox() {
  GLightbox({
    selector: ".glightbox",
  });
}

export function handlePreloader() {
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }
}

export function handleScroll() {
  const selectBody = document.querySelector("body");
  const selectHeader = document.querySelector("#header");
  const scrollTopButton = document.querySelector(".scroll-top");

  if (
    selectHeader &&
    (selectHeader.classList.contains("scroll-up-sticky") ||
      selectHeader.classList.contains("sticky-top") ||
      selectHeader.classList.contains("fixed-top"))
  ) {
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  if (scrollTopButton) {
    window.scrollY > 100
      ? scrollTopButton.classList.add("active")
      : scrollTopButton.classList.remove("active");
  }
}

export function initializeScrollTopButton() {
  const scrollTop = document.querySelector(".scroll-top");
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

export function initializeMobileNavToggle() {
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  function mobileNavToggle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }

  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      if (document.querySelector(".mobile-nav-active")) {
        e.preventDefault();
        this.parentNode.classList.toggle("active");
        this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
        e.stopImmediatePropagation();
      }
    });
  });
}

export function initializeFAQToggle() {
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });
}
