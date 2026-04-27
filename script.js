document.addEventListener("DOMContentLoaded", () => {

  // --- Team Members ---
  const teamMembers = [
    { name: "Jayson Pardo", role: "Developer" },
    { name: "Ade Lozada", role: "Designer" },
    { name: "Kyle Gimena", role: "Quality Assurance" }
  ];

  const cards = document.querySelectorAll(".team-card");
  const dots = document.querySelectorAll(".team-dot");
  const memberName = document.querySelector(".team-member-name");
  const memberRole = document.querySelector(".team-member-role");

  let currentIndex = 0;
  let isAnimating = false;

  function updateTeamCarousel(newIndex) {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (newIndex + cards.length) % cards.length;

    const isMobile = window.innerWidth <= 768;
    const xGap1 = isMobile ? 140 : 220;

    cards.forEach((card, i) => {
      let offset = i - currentIndex;
      if (offset > Math.floor(cards.length / 2)) offset -= cards.length;
      if (offset < -Math.floor(cards.length / 2)) offset += cards.length;

      let x = 0, z = 0, scale = 1, opacity = 1, grayscale = 100;
      let zIndex = 10 - Math.abs(offset);

      if (offset === 0) {
        scale = 1.1; grayscale = 0;
      } else if (offset === 1) {
        x = xGap1; z = -100; scale = 0.9; opacity = 0.9;
      } else if (offset === -1) {
        x = -xGap1; z = -100; scale = 0.9; opacity = 0.9;
      } else {
        x = offset > 0 ? 500 : -500; z = -400; scale = 0.5; opacity = 0;
      }

      gsap.set(card, { zIndex });
      gsap.to(card, {
        x, z, scale, opacity,
        filter: `grayscale(${grayscale}%)`,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    gsap.to(".member-info", {
      opacity: 0, y: 10, duration: 0.3,
      onComplete: () => {
        memberName.textContent = teamMembers[currentIndex].name;
        memberRole.textContent = teamMembers[currentIndex].role;
        gsap.to(".member-info", { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    setTimeout(() => { isAnimating = false; }, 800);
  }

  // --- Event Listeners ---
  document.querySelector(".team-nav-arrow.left").addEventListener("click", () => updateTeamCarousel(currentIndex - 1));
  document.querySelector(".team-nav-arrow.right").addEventListener("click", () => updateTeamCarousel(currentIndex + 1));

  dots.forEach((dot, i) => dot.addEventListener("click", () => updateTeamCarousel(i)));
  cards.forEach((card, i) => card.addEventListener("click", () => updateTeamCarousel(i)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") updateTeamCarousel(currentIndex - 1);
    if (e.key === "ArrowRight") updateTeamCarousel(currentIndex + 1);
  });

  let touchStartX = 0;
  document.addEventListener("touchstart", (e) => touchStartX = e.changedTouches[0].screenX);
  document.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) updateTeamCarousel(currentIndex + 1);
    if (touchEndX - touchStartX > 50) updateTeamCarousel(currentIndex - 1);
  });

  // Initialize
  updateTeamCarousel(0);
});
