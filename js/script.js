document.addEventListener('DOMContentLoaded', () => {
  // ====== BURGER MENU TOGGLE ======
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Auto-close nav on link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ====== BACK TO TOP BUTTON ======
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ====== CONTACT FORM VALIDATION ======
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      let isValid = true;
      let errorMsg = "";

      if (name.length < 3) {
        isValid = false;
        errorMsg += "- Name must be at least 3 characters long.\n";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        isValid = false;
        errorMsg += "- Please enter a valid email address.\n";
      }

      if (message.length < 10) {
        isValid = false;
        errorMsg += "- Message must be at least 10 characters long.\n";
      }

      if (!isValid) {
        alert("Please fix the following:\n\n" + errorMsg);
        return;
      }

      alert("Message sent successfully!");
      contactForm.reset();
    });
  }

  // ====== SCROLL REVEAL ANIMATION ======
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(reveal => observer.observe(reveal));

  // ====== AOS LIBRARY INIT (OPTIONAL) ======
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  // ====== SIDEBAR SCROLL SPY ======
  const sections = document.querySelectorAll(".content-section");
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

  window.addEventListener("scroll", () => {
    let currentId = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentId = section.getAttribute("id");
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove("active-tab");
      if (link.getAttribute("href").includes(currentId)) {
        link.classList.add("active-tab");
      }
    });
  });
});
