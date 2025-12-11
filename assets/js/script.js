/* ============================================
   Upchar Diagnostic Center - JavaScript Functionality
   ============================================ */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });

        // Prevent menu from closing when clicking inside it
        navMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hero Background Slider
    initHeroSlider();

    // Upload Prescription Button
    initUploadPrescription();

    // Testimonials Slider
    initTestimonialSlider();

    // Popular Tests Slider
    initPopularTestsSlider();

    // Why Choose Us Slider
    initWhyChooseUsSlider();

    // Form Validation
    initFormValidation();

    // Logo Display Handler
    initLogoDisplay();
});

// Hero Background Slider
function initHeroSlider() {
    const allHeroSlides = document.querySelectorAll('.hero-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.hero .slider-nav.prev');
    const nextBtn = document.querySelector('.hero .slider-nav.next');
    let currentIndex = 0;
    let slideInterval;
    let validSlides = [];
    let validDots = [];

    if (allHeroSlides.length === 0) return;

    // Supported image formats
    const imageFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const heroSliderPath = 'assets/images/hero-slider/';

    // Function to check if an image exists by trying to load it
    function checkImageExists(imageNumber) {
        return new Promise((resolve) => {
            let formatIndex = 0;
            
            function tryNextFormat() {
                if (formatIndex >= imageFormats.length) {
                    resolve(null);
                    return;
                }
                
                const format = imageFormats[formatIndex];
                const imagePath = `${heroSliderPath}image${imageNumber}.${format}`;
                const img = new Image();
                
                img.onload = function() {
                    resolve(imagePath);
                };
                
                img.onerror = function() {
                    formatIndex++;
                    tryNextFormat();
                };
                
                img.src = imagePath;
            }
            
            tryNextFormat();
        });
    }

    // Check all slides and load available images
    async function loadAvailableSlides() {
        const checkPromises = [];
        
        allHeroSlides.forEach((slide) => {
            const imageNumber = slide.getAttribute('data-image');
            if (imageNumber) {
                checkPromises.push(
                    checkImageExists(imageNumber).then(imagePath => {
                        return { slide, imagePath };
                    })
                );
            }
        });

        const results = await Promise.all(checkPromises);
        
        // Filter and set up valid slides
        results.forEach(({ slide, imagePath }) => {
            if (imagePath) {
                slide.style.backgroundImage = `url('${imagePath}')`;
                validSlides.push(slide);
            } else {
                slide.style.display = 'none';
            }
        });

        // If no valid slides, return
        if (validSlides.length === 0) return;

        // Clear existing dots and create new ones based on valid slides
        if (sliderDotsContainer) {
            sliderDotsContainer.innerHTML = '';
            validSlides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.setAttribute('aria-label', `Slide ${index + 1}`);
                if (index === 0) {
                    dot.classList.add('active');
                }
                validDots.push(dot);
                sliderDotsContainer.appendChild(dot);
            });
        }

        // Set first valid slide as active
        validSlides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === 0) {
                slide.classList.add('active');
            }
        });

        // Initialize slider functionality
        initializeSlider();
    }

    // Initialize slider controls and functionality
    function initializeSlider() {
        function showSlide(index) {
            // Remove active class from all valid slides and dots
            validSlides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });

            validDots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % validSlides.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + validSlides.length) % validSlides.length;
            showSlide(currentIndex);
        }

        function goToSlide(index) {
            currentIndex = index;
            showSlide(currentIndex);
            resetAutoSlide();
        }

        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function resetAutoSlide() {
            clearInterval(slideInterval);
            startAutoSlide();
        }

        // Event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Event listeners for dots
        validDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });

        // Start auto-slide if more than one slide
        if (validSlides.length > 1) {
            startAutoSlide();
        } else if (validSlides.length === 1) {
            showSlide(0);
        }

        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', function() {
                clearInterval(slideInterval);
            });

            heroSection.addEventListener('mouseleave', function() {
                if (validSlides.length > 1) {
                    startAutoSlide();
                }
            });
        }
    }

    // Start loading available slides
    loadAvailableSlides();
}

// Upload Prescription Functionality
function initUploadPrescription() {
    const uploadBtn = document.getElementById('uploadPrescriptionBtn');
    const fileInput = document.getElementById('prescriptionUpload');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // You can handle the file upload here
                // For now, we'll show a success message
                alert('Prescription uploaded successfully! We will review it and contact you shortly.');
                
                // Optional: You can send the file to a server here
                // const formData = new FormData();
                // formData.append('prescription', file);
                // fetch('/upload-prescription', { method: 'POST', body: formData });
            }
        });
    }
}

// Testimonials Slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const sliderButtons = document.querySelectorAll('.slider-btn');
    let currentIndex = 0;

    if (testimonials.length === 0) return;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });

        sliderButtons.forEach((btn, i) => {
            btn.classList.remove('active');
            if (i === index) {
                btn.classList.add('active');
            }
        });
    }

    sliderButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });

    // Auto-slide testimonials
    if (testimonials.length > 1) {
        setInterval(function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);
    } else if (testimonials.length === 1) {
        showTestimonial(0);
    }
}

// Popular Tests Slider
function initPopularTestsSlider() {
    const slider = document.querySelector('.tests-slider');
    const prevBtn = document.querySelector('.test-slider-prev');
    const nextBtn = document.querySelector('.test-slider-next');
    const testCards = document.querySelectorAll('.test-card');
    
    if (!slider || testCards.length === 0) return;

    let currentIndex = 0;
    let slideInterval;

    function getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 4; // Show 4 cards on desktop
    }

    function updateSlider() {
        const cardsPerView = getCardsPerView();
        const cardWidth = testCards[0].offsetWidth + 16; // card width + gap (1rem = 16px)
        const wrapper = slider.parentElement;
        const wrapperWidth = wrapper ? wrapper.offsetWidth : window.innerWidth;
        
        if (window.innerWidth <= 768) {
            // On mobile, center the card
            const cardGap = 16; // 1rem gap
            const translateX = -currentIndex * (cardWidth + cardGap) + (wrapperWidth - cardWidth) / 2 - 32; // 32px for padding
            slider.style.transform = `translateX(${translateX}px)`;
        } else {
            const translateX = -currentIndex * cardWidth * cardsPerView;
            slider.style.transform = `translateX(${translateX}px)`;
        }
    }

    function nextSlide() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.ceil(testCards.length / cardsPerView) - 1;
        if (maxIndex > 0) {
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
        } else {
            currentIndex = 0;
        }
        updateSlider();
        resetAutoSlide();
    }

    function prevSlide() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.ceil(testCards.length / cardsPerView) - 1;
        if (maxIndex > 0) {
            currentIndex = (currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
        } else {
            currentIndex = 0;
        }
        updateSlider();
        resetAutoSlide();
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
        });
    }

    // Pause on hover
    const sliderContainer = document.querySelector('.tests-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });

        sliderContainer.addEventListener('mouseleave', function() {
            if (testCards.length > getCardsPerView()) {
                startAutoSlide();
            }
        });
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            currentIndex = 0;
            updateSlider();
            resetAutoSlide();
        }, 250);
    });

    // Start auto-slide if more cards than visible
    if (testCards.length > getCardsPerView()) {
        startAutoSlide();
    }

    // Initialize slider position
    updateSlider();
}

// Why Choose Us Slider
function initWhyChooseUsSlider() {
    const slider = document.querySelector('.features-slider');
    const prevBtn = document.querySelector('.feature-slider-prev');
    const nextBtn = document.querySelector('.feature-slider-next');
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (!slider || featureCards.length === 0) return;

    let currentIndex = 0;
    let slideInterval;

    function getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3; // Show 3 cards on desktop
    }

    function updateSlider() {
        const cardsPerView = getCardsPerView();
        const cardWidth = featureCards[0].offsetWidth + 16; // card width + gap (1rem = 16px)
        const wrapper = slider.parentElement;
        const wrapperWidth = wrapper ? wrapper.offsetWidth : window.innerWidth;
        
        if (window.innerWidth <= 768) {
            // On mobile, center the card
            const cardGap = 16; // 1rem gap
            const translateX = -currentIndex * (cardWidth + cardGap) + (wrapperWidth - cardWidth) / 2 - 32; // 32px for padding
            slider.style.transform = `translateX(${translateX}px)`;
        } else {
            const translateX = -currentIndex * cardWidth * cardsPerView;
            slider.style.transform = `translateX(${translateX}px)`;
        }
    }

    function nextSlide() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.ceil(featureCards.length / cardsPerView) - 1;
        if (maxIndex > 0) {
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
        } else {
            currentIndex = 0;
        }
        updateSlider();
        resetAutoSlide();
    }

    function prevSlide() {
        const cardsPerView = getCardsPerView();
        const maxIndex = Math.ceil(featureCards.length / cardsPerView) - 1;
        if (maxIndex > 0) {
            currentIndex = (currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1);
        } else {
            currentIndex = 0;
        }
        updateSlider();
        resetAutoSlide();
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
        });
    }

    // Pause on hover
    const sliderContainer = document.querySelector('.features-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });

        sliderContainer.addEventListener('mouseleave', function() {
            if (featureCards.length > getCardsPerView()) {
                startAutoSlide();
            }
        });
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            currentIndex = 0;
            updateSlider();
            resetAutoSlide();
        }, 250);
    });

    // Start auto-slide if more cards than visible
    if (featureCards.length > getCardsPerView()) {
        startAutoSlide();
    }

    // Initialize slider position
    updateSlider();
}

// Set minimum date to today for date inputs
document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
});

// Form Validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const bookingForm = document.getElementById('bookingForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(contactForm)) {
                // Form is valid - you can submit it here
                alert('Thank you! Your message has been sent. We will contact you soon.');
                contactForm.reset();
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(bookingForm)) {
                // Form is valid - you can submit it here
                alert('Thank you! Your booking request has been submitted. We will contact you shortly to confirm.');
                bookingForm.reset();
            }
        });
    }

    // Real-time validation
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }

    // Check if required field is empty
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit phone number';
        }
    }

    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }

    return isValid;
}

// WhatsApp Button Click Handler
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('.btn-success, .whatsapp-float');
    const phoneNumber = '919876543210'; // Replace with actual WhatsApp number

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('whatsapp-float') || this.classList.contains('btn-success')) {
                const message = encodeURIComponent('Hello! I would like to book a test with Upchar Diagnostic Center.');
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
            }
        });
    });
});

// Call Button Handler
document.addEventListener('DOMContentLoaded', function() {
    const callButtons = document.querySelectorAll('.btn-secondary');
    const phoneNumber = '+919876543210'; // Replace with actual phone number

    callButtons.forEach(button => {
        if (button.textContent.includes('Call')) {
            button.addEventListener('click', function(e) {
                window.location.href = `tel:${phoneNumber}`;
            });
        }
    });
});

// Scroll to Top Functionality
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        if (scrollTop > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});

// Logo Display Functionality
function initLogoDisplay() {
    const logoImages = document.querySelectorAll('#companyLogo, .logo-img');
    
    logoImages.forEach(function(logoImg) {
        if (logoImg) {
            const logoPath = logoImg.getAttribute('src') || 'assets/images/logo.png';
            const logoText = logoImg.nextElementSibling || logoImg.parentElement.querySelector('.logo-text');
            
            // Check if logo image exists
            const img = new Image();
            img.onload = function() {
                // Logo exists, show it and hide text
                logoImg.style.display = 'block';
                logoImg.classList.add('show');
                if (logoText) {
                    logoText.classList.add('hide');
                }
            };
            img.onerror = function() {
                // Logo doesn't exist, keep text visible and hide image
                logoImg.style.display = 'none';
                logoImg.classList.remove('show');
                if (logoText) {
                    logoText.classList.remove('hide');
                }
            };
            img.src = logoPath;
        }
    });
}

// Add scroll to top button if not exists
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('scrollTopBtn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'scrollTopBtn';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--primary-blue);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
            z-index: 998;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        `;
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        document.body.appendChild(scrollTopBtn);
    }
});

