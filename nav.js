// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Sync nav dictionary toggle with main toggle
    const navDictToggle = document.getElementById('nav-dict-toggle');
    const mainDictToggle = document.getElementById('dict-toggle');

    if (navDictToggle && mainDictToggle) {
        // Sync state on load
        navDictToggle.checked = mainDictToggle.checked;

        // Sync when either changes
        navDictToggle.addEventListener('change', () => {
            mainDictToggle.checked = navDictToggle.checked;
        });

        mainDictToggle.addEventListener('change', () => {
            navDictToggle.checked = mainDictToggle.checked;
        });
    }

    // Dropdown hover/click behavior
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');

        // Desktop: hover
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', () => {
                dropdown.classList.add('show');
            });

            item.addEventListener('mouseleave', () => {
                dropdown.classList.remove('show');
            });
        } else {
            // Mobile: click
            link.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('show');
            });
        }
    });
});
