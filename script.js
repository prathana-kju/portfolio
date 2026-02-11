// Portfolio Interactivity
import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    // Note: The .fade-in class in CSS already has animation, but we can control it here if we want 
    // strictly "on scroll" behavior by defaulting opacity to 0 in CSS and adding a class here.
    // However, the CSS animation 'fadeIn' runs on load. 
    // Let's create a specific 'reveal-on-scroll' logic for sections.

    const sections = document.querySelectorAll('section');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // You can add a .active class to sections if needed

                // Animate children with .reveal class
                const reveals = entry.target.querySelectorAll('.reveal');
                reveals.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, index * 100);
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            try {
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                const docRef = await addDoc(collection(db, "messages"), {
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date()
                });

                console.log("Document written with ID: ", docRef.id);
                alert(`Thank you, ${name}! Your message has been sent.`);
                contactForm.reset();
            } catch (e) {
                console.error("Error adding document: ", e);
                alert("Sorry, something went wrong. Please try again later.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
