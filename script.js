document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    const portfolioContent = document.getElementById('portfolio-content');
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const backToTopButton = document.createElement('button');

    // Create and append Back to Top Button
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.id = 'backToTopBtn';
    document.body.appendChild(backToTopButton);

    // Function to handle section fade-in animation using Intersection Observer
    let sectionObserver;

    const setupFadeInObserver = () => {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.15 // percentage of target visibility to trigger callback
        };

        if (sectionObserver) {
            sectionObserver.disconnect(); // Disconnect existing observer if re-initializing
        }

        sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        fadeInSections.forEach(section => {
            // Only observe sections that haven't been made visible yet
            if (!section.classList.contains('is-visible')) {
                sectionObserver.observe(section);
            }
        });

        // Crucial for content above the fold: manually check if sections are already in view
        // after portfolioContent becomes visible.
        fadeInSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Check if any part of the section is within the viewport
            // and if it's not already visible (to avoid re-animating)
            if (rect.top < window.innerHeight && rect.bottom > 0 && !section.classList.contains('is-visible')) {
                section.classList.add('is-visible');
            }
        });
    };


    // Event listener for the Enter button
    enterButton.addEventListener('click', () => {
        // Start splash screen fade out animation
        splashScreen.classList.add('fade-out');
        document.body.style.overflow = ''; // Immediately re-enable body scroll


        // --- KEY OPTIMIZATION HERE ---
        // Make portfolio content visible (display: block) immediately
        portfolioContent.style.display = 'block';

        // Allow a very small delay for the browser to reflow, then apply opacity for fade-in
        // and concurrently initialize section animations
        setTimeout(() => {
            portfolioContent.classList.add('show-content'); // This triggers portfolio content's opacity: 1 transition
            setupFadeInObserver(); // Initialize section fade-in animations immediately after portfolio starts fading in

            // Trigger window scroll event to ensure sticky nav and back to top button update their state
            window.dispatchEvent(new Event('scroll'));

        }, 50); // Small delay to allow display:block to apply before opacity transition starts


        // After the splash screen's CSS transition completes (0.7s), completely remove it from layout
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 700); // This matches the splash-screen fade-out transition duration in CSS

    });

    // --- Map Enter key to Enter button click ---
    document.addEventListener('keydown', (event) => {
        // Check if the splash screen is currently active (not fading out or hidden)
        // and if the pressed key is 'Enter'
        if (!splashScreen.classList.contains('fade-out') && event.key === 'Enter') {
            event.preventDefault(); // Prevent default action (e.g., form submission if there was an implicit form)
            enterButton.click(); // Programmatically click the button
        }
    });


    // Smooth scrolling for navigation links (retained logic)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });

                document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Back to Top Button show/hide (retained logic)
    window.addEventListener('scroll', () => {
        // Only show if portfolio content is visible
        if (window.pageYOffset > 300 && portfolioContent.classList.contains('show-content')) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Scroll to top when the button is clicked (retained logic)
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initially hide body scrollbar while splash screen is active
    document.body.style.overflow = 'hidden';

    // --- NEW: Trigger splash screen fade-in on load ---
    // This makes the splash screen fade in smoothly when the page is first loaded.
    splashScreen.classList.add('show-splash');
});