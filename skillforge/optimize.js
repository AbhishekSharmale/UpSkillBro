// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Scroll logic here
        }, 16); // 60fps
    }, { passive: true });

    // Preload critical resources
    const preloadLinks = [
        '/modules/auth.js',
        '/modules/skilltree.js'
    ];
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = href;
        document.head.appendChild(link);
    });
});