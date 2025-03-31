// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const authButtons = document.querySelector('.auth-buttons');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      // Create mobile nav if it doesn't exist
      if (!document.querySelector('.mobile-nav')) {
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        
        // Clone navigation links and auth buttons
        const navClone = navLinks.cloneNode(true);
        const authClone = authButtons.cloneNode(true);
        
        mobileNav.appendChild(navClone);
        mobileNav.appendChild(authClone);
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileNav.prepend(closeBtn);
        
        document.body.appendChild(mobileNav);
        
        // Add styles
        const styles = `
          .mobile-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--primary);
            z-index: 999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: transform 0.3s ease;
          }
          
          .mobile-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
          }
          
          .mobile-nav .nav-links {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .mobile-nav .nav-links li {
            margin: 10px 0;
          }
          
          .mobile-nav .auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 80%;
            max-width: 300px;
          }
          
          .mobile-nav .btn {
            width: 100%;
          }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        
        // Handle close button
        closeBtn.addEventListener('click', function() {
          document.body.removeChild(mobileNav);
        });
        
        // Handle navigation clicks
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
          link.addEventListener('click', function() {
            document.body.removeChild(mobileNav);
          });
        });
      } else {
        const mobileNav = document.querySelector('.mobile-nav');
        document.body.removeChild(mobileNav);
      }
    });
  }
  
  // Handle active navigation links
  const navLinkElements = document.querySelectorAll('.nav-links a');
  navLinkElements.forEach(link => {
    link.addEventListener('click', function() {
      navLinkElements.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// Testimonial Slider
document.addEventListener('DOMContentLoaded', function() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (testimonialCards.length === 0) return;
  
  let currentIndex = 0;
  
  // Function to show current testimonial
  function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }
  
  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      let newIndex = currentIndex + 1;
      if (newIndex >= testimonialCards.length) {
        newIndex = 0;
      }
      showTestimonial(newIndex);
    });
  }
  
  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = testimonialCards.length - 1;
      }
      showTestimonial(newIndex);
    });
  }
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      showTestimonial(index);
    });
  });
  
  // Auto slide every 5 seconds
  setInterval(function() {
    let newIndex = currentIndex + 1;
    if (newIndex >= testimonialCards.length) {
      newIndex = 0;
    }
    showTestimonial(newIndex);
  }, 5000);
});

// Animated Counter Stats ONLY for the stats section (not hero)
document.addEventListener('DOMContentLoaded', function() {
  const statsSection = document.querySelector('.stats-section');
  // Only select counters in the stats section, not in the hero
  const counters = document.querySelectorAll('.stats-section .stat-number');
  
  if (!statsSection || counters.length === 0) return;
  
  // Stats values (only for the bottom stats section)
  const statsValues = {
    'users-count': 15000,
    'workouts-count': 125000,
    'meals-count': 85000,
    'challenges-count': 3500
  };
  
  let hasAnimated = false;
  
  function animateCounters() {
    if (hasAnimated) return;
    
    counters.forEach(counter => {
      const id = counter.id;
      const targetValue = statsValues[id] || 0;
      let currentValue = 0;
      const duration = 2000; // 2 seconds
      const interval = 20; // update every 20ms
      const steps = duration / interval;
      const increment = targetValue / steps;
      
      const timer = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(timer);
        }
        
        // Format larger numbers with commas
        counter.textContent = Math.floor(currentValue).toLocaleString();
      }, interval);
    });
    
    hasAnimated = true;
  }
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  // Check on scroll
  window.addEventListener('scroll', function() {
    if (isInViewport(statsSection)) {
      animateCounters();
    }
  });
  
  // Check on initial load
  if (isInViewport(statsSection)) {
    animateCounters();
  }
});

// Set static hero stats - these should not be affected by the counter animation
document.addEventListener('DOMContentLoaded', function() {
  // Find hero stats specifically (not the ones in the stats section)
  const heroStats = document.querySelectorAll('.hero-stats .stat-number');
  
  // Set their values directly - these will remain constant
  heroStats.forEach(stat => {
    if (stat.textContent.includes('10K+')) {
      stat.textContent = '10K+';
    } else if (stat.textContent.includes('500+')) {
      stat.textContent = '500+';
    } else if (stat.textContent.includes('4.9')) {
      stat.textContent = '4.9';
    }
  });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add sticky header effect
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.padding = '0.8rem 5%';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.padding = '1.2rem 5%';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  });
});

// Get Started buttons
document.addEventListener('DOMContentLoaded', function() {
  const getStartedButtons = document.querySelectorAll('.btn-primary');
  
  getStartedButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Registration modal or redirect to registration page
      // For demo purposes, we'll just show an alert
      alert('Welcome to Fitness Soul! Registration form would open here.');
      
      // In a real application, you would do something like:
      // window.location.href = '/register';
      // or
      // openModal('registration-modal');
    });
  });
});

// Parallax effect for CTA background
document.addEventListener('DOMContentLoaded', function() {
  const ctaSection = document.querySelector('.cta');
  
  if (!ctaSection) return;
  
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const ctaPosition = ctaSection.offsetTop;
    const distance = scrollPosition - ctaPosition;
    
    if (distance > -window.innerHeight && distance < ctaSection.offsetHeight) {
      ctaSection.style.backgroundPositionY = `${distance * 0.2}px`;
    }
  });
});

// Feature card hover effects
document.addEventListener('DOMContentLoaded', function() {
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
  });
});