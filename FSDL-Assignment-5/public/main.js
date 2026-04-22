document.addEventListener('DOMContentLoaded', () => {
    
    // --- Loader Removal ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 1500); // simulate jump jump
    }

    // --- Particles JS Initialization ---
    if(typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
          "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#00f3ff", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
          },
          "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": { "enable": true, "mode": "grab" },
              "onclick": { "enable": true, "mode": "push" },
              "resize": true
            },
            "modes": {
              "grab": { "distance": 200, "line_linked": { "opacity": 1 } },
              "push": { "particles_nb": 4 }
            }
          },
          "retina_detect": true
        });
    }

    // --- 3D Parallax Effect on Mouse Move ---
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(el => {
            el.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
        });

        // Effect on Floating Cards
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;
            const angleX = (cardY - e.clientY) / 30;
            const angleY = (e.clientX - cardX) / 30;
            
            // Limit tilt
            const limit = 15;
            const finalAngleX = Math.max(-limit, Math.min(limit, angleX));
            const finalAngleY = Math.max(-limit, Math.min(limit, angleY));
            
            // Only apply tilt if hovering close
            const dist = Math.sqrt(Math.pow(e.clientX - cardX, 2) + Math.pow(e.clientY - cardY, 2));
            if(dist < 300) {
                card.style.transform = `perspective(1000px) rotateX(${finalAngleX}deg) rotateY(${finalAngleY}deg) translateY(-10px)`;
            } else {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
            }
        });
    });


    // --- Fetching Destinations ---
    const destGrid = document.getElementById('destinations-grid');
    const bookingSelect = document.getElementById('destination');

    // Hardcoded fallback data in case API fails
    const fallbackData = [
        { name: 'Mars Colony Alpha', price: 25000, description: 'Experience the red planet from our state-of-the-art dome city.', image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&auto=format&fit=crop&q=60' },
        { name: 'Lunar Gateway', price: 8000, description: 'The ultimate zero-gravity resort with spectacular Earth views.', image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=500&auto=format&fit=crop&q=60' },
        { name: 'Europa Ice Caves', price: 45000, description: 'Dive deep into the frozen subterranean oceans of Jupiter\'s moon.', image: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?w=500&auto=format&fit=crop&q=60' },
        { name: 'Saturn Rings Cruise', price: 60000, description: 'A magical journey orbiting through the rings of Saturn.', image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&auto=format&fit=crop&q=60' }
    ];

    async function loadDestinations() {
        let data = fallbackData;
        try {
            const res = await fetch('/api/destinations');
            if(res.ok) {
                data = await res.json();
            }
        } catch (err) {
            console.log("Using fallback mock data because backend isn't reachable.");
        }

        // Render Destinations
        if (destGrid) {
            destGrid.innerHTML = data.map(dest => `
                <div class="floating-card">
                    <div class="card-img" style="background-image: url('${dest.image || 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500'}')"></div>
                    <h3>${dest.name}</h3>
                    <div class="price">$${dest.price.toLocaleString()}</div>
                    <p>${dest.description}</p>
                    <a href="booking.html" class="neon-button" style="padding: 10px 20px; font-size: 1rem;">Select</a>
                </div>
            `).join('');
        }

        // Populate Select
        if (bookingSelect) {
            data.forEach(dest => {
                const opt = document.createElement('option');
                opt.value = dest.name;
                opt.textContent = `${dest.name} - $${dest.price.toLocaleString()}`;
                bookingSelect.appendChild(opt);
            });
        }
    }

    loadDestinations();

    // --- Handling Booking Form ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('date').value;
            const msgEl = document.getElementById('booking-message');

            try {
                const res = await fetch('/api/booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, destination, date })
                });

                if (res.ok) {
                    msgEl.textContent = "Coordinates locked! Your journey is confirmed.";
                    msgEl.style.color = "var(--neon-blue)";
                    bookingForm.reset();
                } else {
                    throw new Error('Server returned an error');
                }
            } catch (err) {
                // Mock success if backend is not running
                console.log("Mocking successful booking.");
                msgEl.textContent = "Coordinates locked! (Mock Mode - API unreachable)";
                msgEl.style.color = "var(--neon-blue)";
                bookingForm.reset();
            }
        });
    }
});
