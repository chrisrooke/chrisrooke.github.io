document.addEventListener('DOMContentLoaded', () => {
    const customCursor = document.getElementById('custom-cursor');
    // const customCursor2 = document.getElementById('custom-cursor2');

    // Move custom cursor according to mouse movement
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            // customCursor2.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });

    const contentElements = document.querySelectorAll('.rotate-identifier');
    // Loop through each .content-wrap element
    contentElements.forEach((contentEl) => {
        const hoverElement = contentEl.nextElementSibling;

        function setTransformOrigin(event) {
            const rect = contentEl.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
    
            const transformOriginX = (offsetX / rect.width) * 100;
            const transformOriginY = (offsetY / rect.height) * 100;
    
            hoverElement.style.setProperty('--transform-origin-x', `${transformOriginX}%`);
            hoverElement.style.setProperty('--transform-origin-y', `${transformOriginY}%`);
        }

        contentEl.addEventListener('mouseenter', setTransformOrigin);
        contentEl.addEventListener('mouseleave', function() {
            hoverElement.style.setProperty('--transform-origin-x', `50%`);
            hoverElement.style.setProperty('--transform-origin-y', `50%`);
        });

        function setChildRotate(event) {
            const rect = contentEl.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
    
            const transformRotateX = ((offsetX / rect.width) - 0.5) * 5;
            const transformRotateY = ((offsetY / rect.height) - 0.5) * -5;
    
            contentEl.style.setProperty('--rotate-x', `${transformRotateX}deg`);
            contentEl.style.setProperty('--rotate-y', `${transformRotateY}deg`);
        }
        contentEl.addEventListener('mousemove', setChildRotate);
    });
    
    const elementCursors = document.querySelectorAll('.element-cursor');
    elementCursors.forEach((cursor) => {
        const parentEl = cursor.closest('.article-card') || cursor.closest('.button-container') || cursor.closest('.nav-title'); // Finds the closest parent with the class 'parent'
        parentEl.addEventListener('mousemove', (e) => {
            const rect = parentEl.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            requestAnimationFrame(() => {
                cursor.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    });

    const articleLinks = document.querySelectorAll('.article-link');
    articleLinks.forEach((articleLink) => {
        articleLink.addEventListener('click', function(event) {
            // event.preventDefault();
            this.classList.add('view-transition');
        });
    });
});
