document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const authButtons = document.querySelector('.auth-buttons');

  if (mobileMenuBtn && navLinks && authButtons) {
    mobileMenuBtn.addEventListener('click', function() {
      let mobileNav = document.querySelector('.mobile-nav');

      if (!mobileNav) {
        mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';

        // Clone and append navigation links and auth buttons
        const navClone = navLinks.cloneNode(true);
        const authClone = authButtons.cloneNode(true);

        mobileNav.appendChild(navClone);
        mobileNav.appendChild(authClone);

        // Close Button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileNav.prepend(closeBtn);

        document.body.appendChild(mobileNav);

        // Add styles only once
        if (!document.querySelector('#mobileNavStyles')) {
          const styleElement = document.createElement('style');
          styleElement.id = 'mobileNavStyles';
          styleElement.textContent = `
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
          document.head.appendChild(styleElement);
        }

        // Close Menu on Button Click
        closeBtn.addEventListener('click', function() {
          mobileNav.remove();
        });

        // Close Menu on Link Click
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
          link.addEventListener('click', function() {
            mobileNav.remove();
          });
        });

      } else {
        mobileNav.remove();
      }
    });
  }

  // Handle Active Navigation Links
  const navLinkElements = document.querySelectorAll('.nav-links a');
  navLinkElements.forEach(link => {
    link.addEventListener('click', function() {
      navLinkElements.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
