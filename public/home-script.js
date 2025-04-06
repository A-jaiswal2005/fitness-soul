const stats = [
    { id: "users-count", end: 1200 },
    { id: "workouts-count", end: 350 },
    { id: "meals-count", end: 275 },
    { id: "challenges-count", end: 42 }
  ];

  let hasAnimated = false;

  function animateStats() {
    stats.forEach(stat => {
      const el = document.getElementById(stat.id);
      let start = 0;
      const duration = 2000;
      const increment = Math.ceil(stat.end / (duration / 30));

      const counter = setInterval(() => {
        start += increment;
        if (start >= stat.end) {
          el.textContent = stat.end;
          clearInterval(counter);
        } else {
          el.textContent = start;
        }
      }, 30);
    });
  }

  // Create an IntersectionObserver
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateStats();
        hasAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4 // Trigger when 40% of the section is visible
  });

  // Observe the stats section
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let current = 0;

  function showSlide(index) {
    cards.forEach((card, i) => {
      card.classList.remove('active');
      dots[i].classList.remove('active');
    });
    cards[index].classList.add('active');
    dots[index].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % cards.length;
    showSlide(current);
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + cards.length) % cards.length;
    showSlide(current);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      showSlide(current);
    });
  });

  // Optional: Auto-slide every 6 seconds
  setInterval(() => {
    current = (current + 1) % cards.length;
    showSlide(current);
  }, 6000);