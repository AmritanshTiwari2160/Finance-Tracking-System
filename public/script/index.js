// Code for hamburger in index.html

const hamburger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
    // Toggle Nav
    navLinks.classList.toggle("open");
    // Animate Links
    links.forEach(link => {
        link.classList.toggle("fade");
    });
    // Burger Animation
    hamburger.classList.toggle("toggle");
}
);