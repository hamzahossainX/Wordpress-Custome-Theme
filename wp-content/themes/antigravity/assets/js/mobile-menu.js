/* Mobile Menu Toggle Script */
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a menu item
        const menuLinks = document.querySelectorAll('.primary-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                body.classList.remove('menu-open');
            });
        });
    }
});
