/* Mobile Menu Toggle Script */
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavWrapper = document.querySelector('.header-left');

    if (mobileToggle && mobileNavWrapper) {
        // Toggle menu on click
        mobileToggle.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent immediate document click trigger
            mobileNavWrapper.classList.toggle('menu-open');
            const isExpanded = mobileNavWrapper.classList.contains('menu-open');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a menu item
        const menuLinks = document.querySelectorAll('.primary-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileNavWrapper.classList.remove('menu-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            // If the menu is open and the click target is NOT inside the nav container
            if (mobileNavWrapper.classList.contains('menu-open') && !mobileNavWrapper.contains(e.target) && e.target !== mobileToggle) {
                mobileNavWrapper.classList.remove('menu-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
