document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Effect for Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger animation
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });

    // 3. Highlight Active Nav Link
    const currentPath = window.location.pathname;
    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        // Handle index and exact matching
        if (currentPath === '/' && (href === 'index.html' || href === '/')) {
            anchor.classList.add('active');
        } else if (href && currentPath.endsWith(href)) {
            anchor.classList.add('active');
        }
    });

    // 4. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 5. Contact Form Submission (AJAX Formspree)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // UI Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '傳送中...';
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
            
            const formData = new FormData(contactForm);
            
            try {
                // Submit via Formspree API
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.innerHTML = '感謝您的來信！我們的資安顧問將於 24 小時內與您聯絡。';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        formStatus.innerHTML = data.errors.map(error => error.message).join(", ");
                    } else {
                        formStatus.innerHTML = '傳送失敗，請稍後再試，或直接來信聯絡我們！';
                    }
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.innerHTML = '網路連線異常，請確認網路狀態後再試！';
                formStatus.classList.add('error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
