const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

function fadeLinks() {
  links.forEach((link) => {
    link.classList.toggle("fade");
  });
}

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  fadeLinks();
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    fadeLinks();
  });
});
