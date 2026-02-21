/**
 * AMIRA Theme — main.js
 *
 * Handles:
 *   1. Navbar transparent → solid on scroll (.scrolled class)
 *   2. Hero text staggered animation trigger on DOMContentLoaded
 *   3. Swiper autoplay synced to a progress-bar animation
 */

(function () {
    'use strict';

    /* =====================================================
       1. NAVBAR SCROLL EFFECT
       Adds / removes .scrolled on #site-header
    ===================================================== */
    const header = document.getElementById('site-header');

    if (header) {
        const SCROLL_THRESHOLD = 60; // px before nav solidifies

        function onScroll() {
            if (window.scrollY > SCROLL_THRESHOLD) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load in case page is already scrolled
    }

    /* =====================================================
       2. HERO TEXT STAGGERED ANIMATION
       Adds .is-animated to .hero-static-content on load
       CSS handles the individual element delays via nth-child
    ===================================================== */
    document.addEventListener('DOMContentLoaded', function () {
        const heroContent = document.querySelector('.hero-static-content');
        if (heroContent) {
            // Small delay so the transition is visible even on fast loads
            requestAnimationFrame(function () {
                setTimeout(function () {
                    heroContent.classList.add('is-animated');
                }, 150);
            });
        }

        /* =====================================================
           3. SWIPER PROGRESS BAR
           Synced to the Swiper autoplay delay (5000ms)
        ===================================================== */
        const progressFill = document.querySelector('.hero-progress-fill');
        const SLIDE_DURATION = 5000; // ms — must match Swiper autoplay delay

        function resetProgress() {
            if (!progressFill) return;
            // Force a reflow to restart the CSS transition cleanly
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
            // eslint-disable-next-line no-void
            void progressFill.offsetWidth; // trigger reflow
            progressFill.style.transition = 'width ' + SLIDE_DURATION + 'ms linear';
            progressFill.style.width = '100%';
        }

        // Try to hook into Swiper after it initialises
        function initSwiperProgress() {
            // Swiper stores its instance on the DOM element
            const swiperEl = document.querySelector('.hero-swiper');
            if (!swiperEl || !swiperEl.swiper) {
                // Swiper not ready yet — retry
                setTimeout(initSwiperProgress, 200);
                return;
            }

            const swiper = swiperEl.swiper;

            // Start progress on the first slide
            resetProgress();

            // Reset & restart on every slide change
            swiper.on('slideChange', resetProgress);

            // Pause fill when autoplay is paused (e.g. hover)
            swiper.on('autoplayStop', function () {
                if (progressFill) {
                    progressFill.style.transition = 'none';
                    // Freeze at current width by reading computed style
                    const computed = window.getComputedStyle(progressFill).width;
                    const parentWidth = progressFill.parentElement.offsetWidth;
                    progressFill.style.width = computed;
                    void progressFill.offsetWidth;
                }
            });

            swiper.on('autoplayStart', function () {
                resetProgress();
            });
        }

        initSwiperProgress();

        /* =====================================================
           3. PRODUCT CARD SCROLL-REVEAL (IntersectionObserver)
           Staggered fade-in as cards enter the viewport
        ===================================================== */
        const productCards = document.querySelectorAll('.product-card[data-animate="fade-up"]');

        if (productCards.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        // Calculate stagger delay based on column position (0-indexed)
                        const index = parseInt(card.dataset.cardIndex || 0, 10);
                        card.style.transitionDelay = (index * 0.08) + 's';
                        card.classList.add('is-visible');
                        observer.unobserve(card); // animate once
                    }
                });
            }, {
                threshold: 0.08,
                rootMargin: '0px 0px -40px 0px'
            });

            productCards.forEach(function (card, index) {
                card.dataset.cardIndex = index;
                observer.observe(card);
            });
        } else {
            // Fallback: reveal all immediately (old browsers / no support)
            productCards.forEach(function (card) {
                card.classList.add('is-visible');
            });
        }

    });
})();
