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


/* ============================================================
   AUTH SYSTEM
   Handles: Login, Register, Forgot Password (AJAX),
            Password strength, Real-time validation,
            Show/hide password toggle, Header dropdown
============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       Utility: set button loading state
    ---------------------------------------------------------- */
    function setButtonLoading(btn, loading) {
        if (!btn) return;
        if (loading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    /* ----------------------------------------------------------
       Utility: show global message on a form
    ---------------------------------------------------------- */
    function showMessage(el, text, type) {
        if (!el) return;
        el.className = 'auth-message auth-' + type;
        el.textContent = text;
    }

    function clearMessage(el) {
        if (!el) return;
        el.className = 'auth-message';
        el.textContent = '';
    }

    /* ----------------------------------------------------------
       Utility: set field feedback (inline below field)
    ---------------------------------------------------------- */
    function setFieldFeedback(el, text, type) {
        if (!el) return;
        el.className = 'field-feedback ' + (type || '');
        el.textContent = text || '';
    }

    /* ----------------------------------------------------------
       Utility: mark input state
    ---------------------------------------------------------- */
    function setInputState(input, state) {
        if (!input) return;
        input.classList.remove('input-error', 'input-success');
        if (state) input.classList.add('input-' + state);
    }

    /* ----------------------------------------------------------
       1. SHOW / HIDE PASSWORD TOGGLE
    ---------------------------------------------------------- */
    function initPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = btn.getAttribute('data-target');
                var input = document.getElementById(targetId);
                if (!input) return;

                var isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';

                // Swap SVG eye open/closed
                var svg = btn.querySelector('.eye-icon');
                if (svg) {
                    if (isPassword) {
                        // Show "eye-off" (line through)
                        svg.innerHTML =
                            '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>' +
                            '<path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>' +
                            '<line x1="1" y1="1" x2="23" y2="23"/>';
                    } else {
                        svg.innerHTML =
                            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>' +
                            '<circle cx="12" cy="12" r="3"/>';
                    }
                }
            });
        });
    }

    /* ----------------------------------------------------------
       2. PASSWORD STRENGTH CHECKER
    ---------------------------------------------------------- */
    function checkPasswordStrength(password) {
        var score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return 'weak';
        if (score <= 3) return 'medium';
        return 'strong';
    }

    function initPasswordStrength() {
        var passwordInput = document.getElementById('reg-password');
        var strengthBar = document.getElementById('password-strength-bar');
        var strengthWrap = document.getElementById('strength-bar-wrap');
        var strengthLabel = document.getElementById('strength-label');

        if (!passwordInput || !strengthBar) return;

        passwordInput.addEventListener('input', function () {
            var val = passwordInput.value;

            if (!val) {
                strengthWrap.classList.remove('visible');
                strengthBar.className = 'strength-bar';
                strengthLabel.textContent = '';
                return;
            }

            var level = checkPasswordStrength(val);
            strengthWrap.classList.add('visible');
            strengthBar.className = 'strength-bar ' + level;
            strengthLabel.textContent = level.charAt(0).toUpperCase() + level.slice(1);

            var feedback = document.getElementById('reg-password-feedback');
            if (val.length < 8) {
                setFieldFeedback(feedback, 'Minimum 8 characters required', 'error');
                setInputState(passwordInput, 'error');
            } else {
                setFieldFeedback(feedback, '', '');
                setInputState(passwordInput, 'success');
            }
        });
    }

    /* ----------------------------------------------------------
       3. REAL-TIME EMAIL VALIDATION
    ---------------------------------------------------------- */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function initEmailValidation() {
        var emailInput = document.getElementById('reg-email');
        var emailFeedback = document.getElementById('reg-email-feedback');

        if (!emailInput) return;

        emailInput.addEventListener('blur', function () {
            var val = emailInput.value.trim();
            if (!val) {
                setFieldFeedback(emailFeedback, '');
                setInputState(emailInput, null);
                return;
            }
            if (isValidEmail(val)) {
                setFieldFeedback(emailFeedback, '✓ Looks good', 'success');
                setInputState(emailInput, 'success');
            } else {
                setFieldFeedback(emailFeedback, 'Please enter a valid email address', 'error');
                setInputState(emailInput, 'error');
            }
        });
    }

    /* ----------------------------------------------------------
       4. REAL-TIME PASSWORD MATCH CHECK
    ---------------------------------------------------------- */
    function initPasswordMatchCheck() {
        var confirmInput = document.getElementById('reg-confirm-password');
        var passwordInput = document.getElementById('reg-password');
        var confirmFeedback = document.getElementById('reg-confirm-feedback');

        if (!confirmInput || !passwordInput) return;

        function check() {
            var pass = passwordInput.value;
            var confirm = confirmInput.value;
            if (!confirm) {
                setFieldFeedback(confirmFeedback, '');
                setInputState(confirmInput, null);
                return;
            }
            if (pass === confirm) {
                setFieldFeedback(confirmFeedback, '✓ Passwords match', 'success');
                setInputState(confirmInput, 'success');
            } else {
                setFieldFeedback(confirmFeedback, 'Passwords do not match', 'error');
                setInputState(confirmInput, 'error');
            }
        }

        confirmInput.addEventListener('input', check);
        passwordInput.addEventListener('input', check);
    }

    /* ----------------------------------------------------------
       5. AJAX LOGIN FORM
    ---------------------------------------------------------- */
    function initLoginForm() {
        var form = document.getElementById('amira-login-form');
        var msgEl = document.getElementById('login-message');
        var btnEl = document.getElementById('login-submit-btn');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            clearMessage(msgEl);

            var log = (document.getElementById('login-email') || {}).value || '';
            var pwd = (document.getElementById('login-password') || {}).value || '';

            if (!log || !pwd) {
                showMessage(msgEl, 'Please fill in both fields.', 'error');
                return;
            }

            setButtonLoading(btnEl, true);

            var data = new FormData();
            data.append('action', 'amira_ajax_login');
            data.append('nonce', (window.amiraAjax || {}).loginNonce || '');
            data.append('log', log);
            data.append('pwd', pwd);
            data.append('rememberme', document.getElementById('rememberme') && document.getElementById('rememberme').checked ? 'forever' : '');

            fetch((window.amiraAjax || {}).ajaxUrl || '/wp-admin/admin-ajax.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: data,
            })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (res.success) {
                        showMessage(msgEl, res.data.message, 'success');
                        setTimeout(function () {
                            window.location.href = res.data.redirectUrl || (window.amiraAjax || {}).homeUrl || '/';
                        }, 700);
                    } else {
                        showMessage(msgEl, (res.data && res.data.message) || 'An error occurred.', 'error');
                        setButtonLoading(btnEl, false);
                    }
                })
                .catch(function () {
                    showMessage(msgEl, 'Connection error. Please try again.', 'error');
                    setButtonLoading(btnEl, false);
                });
        });
    }

    /* ----------------------------------------------------------
       6. AJAX REGISTER FORM
    ---------------------------------------------------------- */
    function initRegisterForm() {
        var form = document.getElementById('amira-register-form');
        var msgEl = document.getElementById('register-message');
        var btnEl = document.getElementById('register-submit-btn');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            clearMessage(msgEl);

            var fullname = (document.getElementById('reg-fullname') || {}).value || '';
            var email = (document.getElementById('reg-email') || {}).value || '';
            var password = (document.getElementById('reg-password') || {}).value || '';
            var confirm = (document.getElementById('reg-confirm-password') || {}).value || '';

            // Client-side quick validation
            if (!fullname) {
                showMessage(msgEl, 'Please enter your full name.', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showMessage(msgEl, 'Please enter a valid email address.', 'error');
                return;
            }
            if (password.length < 8) {
                showMessage(msgEl, 'Password must be at least 8 characters.', 'error');
                return;
            }
            if (password !== confirm) {
                showMessage(msgEl, 'Passwords do not match.', 'error');
                return;
            }

            setButtonLoading(btnEl, true);

            var data = new FormData();
            data.append('action', 'amira_ajax_register');
            data.append('nonce', (window.amiraAjax || {}).registerNonce || '');
            data.append('fullname', fullname);
            data.append('email', email);
            data.append('password', password);
            data.append('confirm_password', confirm);

            fetch((window.amiraAjax || {}).ajaxUrl || '/wp-admin/admin-ajax.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: data,
            })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (res.success) {
                        showMessage(msgEl, res.data.message, 'success');
                        setTimeout(function () {
                            window.location.href = res.data.redirectUrl || (window.amiraAjax || {}).myAccountUrl || '/';
                        }, 800);
                    } else {
                        showMessage(msgEl, (res.data && res.data.message) || 'Registration failed.', 'error');

                        // Highlight specific field if server returned one
                        if (res.data && res.data.field) {
                            var fieldMap = {
                                fullname: 'reg-fullname',
                                email: 'reg-email',
                                password: 'reg-password',
                                confirm_password: 'reg-confirm-password',
                            };
                            var inputEl = document.getElementById(fieldMap[res.data.field]);
                            if (inputEl) setInputState(inputEl, 'error');
                        }

                        setButtonLoading(btnEl, false);
                    }
                })
                .catch(function () {
                    showMessage(msgEl, 'Connection error. Please try again.', 'error');
                    setButtonLoading(btnEl, false);
                });
        });
    }

    /* ----------------------------------------------------------
       7. AJAX FORGOT PASSWORD FORM
    ---------------------------------------------------------- */
    function initForgotPasswordForm() {
        var form = document.getElementById('amira-forgot-form');
        var msgEl = document.getElementById('forgot-message');
        var btnEl = document.getElementById('forgot-submit-btn');

        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            clearMessage(msgEl);

            var email = (document.getElementById('forgot-email') || {}).value || '';

            if (!isValidEmail(email)) {
                showMessage(msgEl, 'Please enter a valid email address.', 'error');
                return;
            }

            setButtonLoading(btnEl, true);

            var data = new FormData();
            data.append('action', 'amira_ajax_forgot_password');
            data.append('nonce', (window.amiraAjax || {}).forgotNonce || '');
            data.append('user_login', email);

            fetch((window.amiraAjax || {}).ajaxUrl || '/wp-admin/admin-ajax.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: data,
            })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (res.success) {
                        showMessage(msgEl, res.data.message, 'success');
                        form.style.display = 'none';
                    } else {
                        showMessage(msgEl, (res.data && res.data.message) || 'An error occurred.', 'error');
                    }
                    setButtonLoading(btnEl, false);
                })
                .catch(function () {
                    showMessage(msgEl, 'Connection error. Please try again.', 'error');
                    setButtonLoading(btnEl, false);
                });
        });
    }

    /* ----------------------------------------------------------
       8. AJAX LOGOUT BUTTON (in header dropdown)
    ---------------------------------------------------------- */
    function initLogoutBtn() {
        var logoutBtn = document.getElementById('amira-logout-btn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', function () {
            var data = new FormData();
            data.append('action', 'amira_ajax_logout');
            data.append('nonce', (window.amiraAjax || {}).logoutNonce || '');

            fetch((window.amiraAjax || {}).ajaxUrl || '/wp-admin/admin-ajax.php', {
                method: 'POST',
                credentials: 'same-origin',
                body: data,
            })
                .then(function (r) { return r.json(); })
                .then(function (res) {
                    if (res.success) {
                        window.location.href = res.data.redirectUrl || (window.amiraAjax || {}).homeUrl || '/';
                    } else {
                        // Fallback: WordPress native logout URL
                        window.location.href = '/wp-login.php?action=logout';
                    }
                })
                .catch(function () {
                    window.location.href = '/wp-login.php?action=logout';
                });
        });
    }

    /* ----------------------------------------------------------
       9. USER DROPDOWN (hover + click + keyboard)
    ---------------------------------------------------------- */
    function initUserDropdown() {
        // header-account is a class (no ID) — find it in the header
        var wrap = document.querySelector('header .header-account');
        var trigger = document.getElementById('user-account-trigger');
        var dropdown = document.getElementById('user-dropdown');

        if (!wrap || !trigger) return; // only rendered when logged in

        // Toggle .open on click (CSS :hover handles desktop, .open handles touch/keyboard)
        trigger.addEventListener('click', function (e) {
            e.stopPropagation(); // prevent immediate outside-click dismissal
            var isOpen = wrap.classList.contains('open');
            wrap.classList.toggle('open', !isOpen);
            trigger.setAttribute('aria-expanded', String(!isOpen));
        });

        // Close when clicking anywhere outside the wrap
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) {
                wrap.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard: Escape closes the dropdown
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && wrap.classList.contains('open')) {
                wrap.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });
    }

    /* ----------------------------------------------------------
       Boot all auth handlers on DOM ready
    ---------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initPasswordToggles();
        initPasswordStrength();
        initEmailValidation();
        initPasswordMatchCheck();
        initLoginForm();
        initRegisterForm();
        initForgotPasswordForm();
        initLogoutBtn();
        initUserDropdown();
    });

})();

/* ============================================================
   AMIRA SHOP PAGE INTERACTIONS
============================================================ */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // 1. Skeleton Loading removal
        window.addEventListener('load', function () {
            const skeletons = document.querySelectorAll('.amira-skeleton');
            skeletons.forEach(function (el) {
                el.style.display = 'none';
            });
            const actualImages = document.querySelectorAll('.amira-product-image-wrap img');
            actualImages.forEach(function (img) {
                if (img.classList.contains('amira-product-img--primary')) {
                    img.style.opacity = '1';
                }
            });
        });

        // 2. Scroll Reveal
        const reveals = document.querySelectorAll('.amira-reveal');
        if (reveals.length > 0 && 'IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry, index) {
                    if (entry.isIntersecting) {
                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, index * 80); // Stagger fade in
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "0px 0px -50px 0px" });

            reveals.forEach(function (el) { revealObserver.observe(el); });
        } else {
            reveals.forEach(function (el) { el.classList.add('visible'); });
        }

        // 3. Back to Top Button
        const backToTopBtn = document.querySelector('.amira-back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 400) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });
            backToTopBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // 4. Quick View Modal
        function bindQuickView() {
            const quickViewBtns = document.querySelectorAll('.amira-quickview-btn');
            const modal = document.querySelector('.amira-quick-view-modal');
            const modalClose = document.querySelector('.modal-close');
            const modalOverlay = document.querySelector('.modal-overlay');
            const modalBody = document.querySelector('.modal-body');

            if (modal && quickViewBtns.length > 0) {
                quickViewBtns.forEach(function (btn) {
                    if (btn.dataset.qvBound) return;
                    btn.dataset.qvBound = 'true';

                    btn.addEventListener('click', function (e) {
                        e.preventDefault();
                        modal.classList.add('active');
                        if (modalBody) {
                            modalBody.innerHTML = '<div class="amira-skeleton skeleton-img"></div><div class="amira-skeleton skeleton-text"></div>';
                            const productId = this.getAttribute('data-product-id');

                            const formData = new FormData();
                            formData.append('action', 'amira_quick_view');
                            formData.append('product_id', productId);

                            fetch((window.amiraShop && window.amiraShop.ajaxUrl) ? window.amiraShop.ajaxUrl : '/wp-admin/admin-ajax.php', {
                                method: 'POST',
                                body: formData
                            })
                                .then(function (res) { return res.json(); })
                                .then(function (data) {
                                    if (data.success) {
                                        modalBody.innerHTML = data.data;
                                        bindFlyingAnimation();
                                    } else {
                                        modalBody.innerHTML = '<p style="text-align:center;padding:40px;">Error loading product.</p>';
                                    }
                                })
                                .catch(function () {
                                    modalBody.innerHTML = '<p style="text-align:center;padding:40px;">Connection error.</p>';
                                });
                        }
                    });
                });

                const closeModal = function () { modal.classList.remove('active'); };
                if (modalClose) modalClose.addEventListener('click', closeModal);
                if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
                });
            }
        }
        bindQuickView();

        // 5. Add to Cart flying animation
        function bindFlyingAnimation() {
            const buttons = document.querySelectorAll('.ajax-atc');
            buttons.forEach(function (btn) {
                if (btn.dataset.flyingBound === 'true') return;
                btn.dataset.flyingBound = 'true';

                btn.addEventListener('click', function (e) {
                    const cartIcon = document.querySelector('.cart-link');
                    const productItem = this.closest('.amira-product-item') || this.closest('.amira-qv-wrapper');

                    if (cartIcon && productItem) {
                        const img = productItem.querySelector('img');
                        if (img) {
                            const flyingImg = img.cloneNode(true);
                            const rect = img.getBoundingClientRect();
                            flyingImg.style.position = 'fixed';
                            flyingImg.style.top = rect.top + 'px';
                            flyingImg.style.left = rect.left + 'px';
                            flyingImg.style.width = rect.width + 'px';
                            flyingImg.style.height = rect.height + 'px';
                            flyingImg.style.zIndex = '99999';
                            flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            flyingImg.style.borderRadius = '50%';
                            flyingImg.style.opacity = '0.9';
                            document.body.appendChild(flyingImg);

                            const cartRect = cartIcon.getBoundingClientRect();

                            setTimeout(function () {
                                flyingImg.style.top = cartRect.top + 'px';
                                flyingImg.style.left = cartRect.left + 'px';
                                flyingImg.style.width = '20px';
                                flyingImg.style.height = '20px';
                                flyingImg.style.opacity = '0';
                            }, 10);

                            setTimeout(function () {
                                flyingImg.remove();
                            }, 800);
                        }
                    }
                });
            });
        }
        bindFlyingAnimation();

        // 6. Sort dropdown (AJAX fetch)
        const sortSelects = document.querySelectorAll('.amira-sort-select, .amira-mobile-sort-select');
        sortSelects.forEach(function (select) {
            select.onchange = null;
            select.removeAttribute('onchange');

            select.addEventListener('change', function (e) {
                const url = this.value;
                const grid = document.querySelector('.amira-product-grid');
                if (grid) {
                    grid.style.opacity = '0.4';
                    grid.style.transition = 'opacity 0.3s';

                    fetch(url)
                        .then(function (res) { return res.text(); })
                        .then(function (html) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');

                            const newGrid = doc.querySelector('.amira-product-grid');
                            const newPagination = doc.querySelector('.amira-shop-pagination');
                            const oldPagination = document.querySelector('.amira-shop-pagination');
                            const newCount = doc.querySelector('.shop-top-bar-left');
                            const oldCount = document.querySelector('.shop-top-bar-left');

                            if (newGrid) {
                                grid.innerHTML = newGrid.innerHTML;
                                grid.style.opacity = '1';

                                if (newPagination && oldPagination) {
                                    oldPagination.innerHTML = newPagination.innerHTML;
                                }
                                if (newCount && oldCount) {
                                    oldCount.innerHTML = newCount.innerHTML;
                                }

                                bindFlyingAnimation();
                                bindQuickView();

                                const newReveals = grid.querySelectorAll('.amira-reveal');
                                newReveals.forEach(function (el) { el.classList.add('visible'); });
                            }
                            window.history.pushState({}, '', url);
                            sortSelects.forEach(function (s) { if (s !== select) s.value = url; });
                        })
                        .catch(function () {
                            window.location = url;
                        });
                } else {
                    window.location = url;
                }
            });
        });

        // 7. Recently Viewed (localStorage)
        function handleRecentlyViewed() {
            const isSingleProduct = document.body.classList.contains('single-product');

            let currentProductId = null;
            document.body.classList.forEach(function (cls) {
                if (cls.indexOf('postid-') === 0) {
                    currentProductId = cls.replace('postid-', '');
                }
            });

            let viewedProducts = JSON.parse(localStorage.getItem('amira_recently_viewed') || '[]');

            if (isSingleProduct && currentProductId) {
                viewedProducts = viewedProducts.filter(function (id) { return id !== currentProductId; });
                viewedProducts.unshift(currentProductId);
                if (viewedProducts.length > 4) {
                    viewedProducts = viewedProducts.slice(0, 4);
                }
                localStorage.setItem('amira_recently_viewed', JSON.stringify(viewedProducts));
            }

            const isShop = document.querySelector('.shop-page-wrapper');
            if (isShop && viewedProducts.length > 0) {
                const wrapper = document.querySelector('.shop-content-wrapper');
                if (!wrapper) return;

                let rvContainer = document.createElement('div');
                rvContainer.className = 'amira-recently-viewed amira-reveal visible';
                rvContainer.style.padding = '80px 0 0';
                rvContainer.style.textAlign = 'center';

                rvContainer.innerHTML = '<h3 style="margin-bottom:32px;font-family:\'Cormorant Garamond\', serif; font-size:2rem;font-weight:600;color:#1a1a1a;">Recently Viewed</h3><div class="amira-product-grid rv-grid" style="opacity:0.5;transition:opacity 0.3s;min-height:200px;"></div>';

                wrapper.appendChild(rvContainer);

                const rvGrid = rvContainer.querySelector('.rv-grid');

                const formData = new FormData();
                formData.append('action', 'amira_get_recently_viewed');
                formData.append('product_ids', JSON.stringify(viewedProducts));

                fetch((window.amiraShop && window.amiraShop.ajaxUrl) ? window.amiraShop.ajaxUrl : '/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (data.success && data.data) {
                            rvGrid.innerHTML = data.data;
                            rvGrid.style.opacity = '1';
                            bindFlyingAnimation();
                            bindQuickView();
                        } else {
                            rvContainer.style.display = 'none';
                        }
                    })
                    .catch(function () {
                        rvContainer.style.display = 'none';
                    });
            }
        }
        handleRecentlyViewed();

    });
})();


