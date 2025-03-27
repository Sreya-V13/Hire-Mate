// Authentication check and DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    const userName = localStorage.getItem('userName');
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userName && userProfileBtn) {
        const displayName = userName === 'sampleuser@gmail.com' ? 
            'Demo User' : userName;
        userProfileBtn.innerHTML = `<i class="fas fa-user"></i> ${displayName}`;
    }

    // Adjust navbar height
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
    }

    // Add category card click listeners
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            showServices(category);
        });
    });

    // Only call these functions if the dashboard section exists
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        updateDashboard();
        updateUserDashboard();
    }
});

// Logout function
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}

// Menu toggle functions
function toggleMenu(event) {
    event.preventDefault();
    const menuDropdown = document.getElementById('menuDropdown');
    const dashboardItems = document.getElementById('dashboardItems');
    
    if (menuDropdown) {
        menuDropdown.classList.toggle('active');
    }
    if (dashboardItems) {
        dashboardItems.classList.remove('active');
    }
}

// Dashboard Toggle Function
function toggleDashboard(event) {
    if (event) {
        event.preventDefault();
    }
    
    const dashboard = document.getElementById('dashboard');
    const menuDropdown = document.getElementById('menuDropdown');
    
    // Toggle dashboard visibility
    if (dashboard.style.display === 'none' || !dashboard.style.display) {
        dashboard.style.display = 'block';
        // Scroll to dashboard
        dashboard.scrollIntoView({ behavior: 'smooth' });
    } else {
        dashboard.style.display = 'none';
    }
    
    // Close the menu dropdown if it's open
    if (menuDropdown) {
        menuDropdown.classList.remove('active');
    }
    
    // Update dashboard data when opened
    if (dashboard.style.display === 'block') {
        updateDashboardStats();
        updateBookingProgress();
        updateBookingLists();
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menuContainer = document.querySelector('.menu-container');
    const menuDropdown = document.getElementById('menuDropdown');
    
    if (menuContainer && menuDropdown && !menuContainer.contains(event.target)) {
        menuDropdown.classList.remove('active');
        const dashboardItems = document.getElementById('dashboardItems');
        if (dashboardItems) {
            dashboardItems.classList.remove('active');
        }
    }
});

// Close menu when scrolling
window.addEventListener('scroll', function() {
    const menuDropdown = document.getElementById('menuDropdown');
    if (menuDropdown) {
        menuDropdown.classList.remove('active');
    }
    document.getElementById('dashboardItems').classList.remove('active');
});

// Smooth scroll to categories
function scrollToCategories() {
    const categoriesSection = document.getElementById('categories');
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
}

// Service and professional data objects
const servicesByCategory = {
    'Technology': [
        { name: 'Computer Repair', price: '₹1500/hr', icon: 'fa-laptop', description: 'Professional computer repair and maintenance services' },
        { name: 'IT Consulting', price: '₹2000/hr', icon: 'fa-tasks', description: 'Expert IT consultation and solutions' },
        { name: 'Web Development', price: '₹2500/hr', icon: 'fa-code', description: 'Custom website development and maintenance' },
        { name: 'Network Setup', price: '₹2000/hr', icon: 'fa-network-wired', description: 'Professional network installation and configuration' },
        { name: 'Data Recovery', price: '₹1750/hr', icon: 'fa-database', description: 'Recovery of lost or corrupted data' },
        { name: 'Virus Removal', price: '₹1200/hr', icon: 'fa-shield-virus', description: 'Removal of viruses and malware' },
        { name: 'Software Installation', price: '₹1350/hr', icon: 'fa-download', description: 'Software installation and setup' },
        { name: 'Smart Home Setup', price: '₹1800/hr', icon: 'fa-home', description: 'Smart home device installation and configuration' },
        { name: 'Tech Training', price: '₹1550/hr', icon: 'fa-chalkboard-teacher', description: 'Personalized technology training sessions' }
    ],
    'Home Services': [
        { name: 'House Cleaning', price: '₹1000/hr', icon: 'fa-broom', description: 'Thorough and reliable house cleaning services' },
        { name: 'Plumbing', price: '₹1200/hr', icon: 'fa-wrench', description: 'Professional plumbing services for your home' },
        { name: 'Electrical Work', price: '₹1100/hr', icon: 'fa-bolt', description: 'Expert electrical installation and repair' },
        { name: 'Painting', price: '₹3000/hr', icon: 'fa-paint-roller', description: 'Interior and exterior painting services' },
        { name: 'Carpentry', price: '₹2500/hr', icon: 'fa-hammer', description: 'Custom carpentry and woodworking services' },
        { name: 'Garden Maintenance', price: '₹3500/hr', icon: 'fa-seedling', description: 'Professional gardening and landscaping services' },
        { name: 'Pest Control', price: '₹1300/visit', icon: 'fa-bug', description: 'Effective pest control solutions' },
        { name: 'Interior Design', price: '₹4500/hr', icon: 'fa-fan', description: 'Professional interior design consultation' },
        { name: 'Moving Services', price: '₹900/hr', icon: 'fa-truck', description: 'Professional moving and relocation services' }
    ],
    'Education': [
        { name: 'Math Tutoring', price: '₹2500/hr', icon: 'fa-square-root-alt', description: 'Personalized math tutoring for all levels' },
        { name: 'Science Tutoring', price: '₹2300/hr', icon: 'fa-flask', description: 'Expert science tutoring for students' },
        { name: 'Language Classes', price: '₹1900/hr', icon: 'fa-language', description: 'Language lessons for various languages' },
        { name: 'Test Preparation', price: '₹1200/hr', icon: 'fa-book', description: 'Comprehensive test preparation services' },
        { name: 'Music Lessons', price: '₹2000/hr', icon: 'fa-music', description: 'Private music lessons for different instruments' },
        { name: 'Art Classes', price: '₹2500/hr', icon: 'fa-palette', description: 'Creative art classes for all ages' },
        { name: 'Coding Classes', price: '₹6000/hr', icon: 'fa-code', description: 'Learn coding and programming skills' },
        { name: 'Business Tutoring', price: '₹3000/hr', icon: 'fa-chart-line', description: 'Business and finance tutoring' },
        { name: 'Writing Help', price: '₹1000/hr', icon: 'fa-pen', description: 'Professional writing assistance' }
    ],
    'Body & Hair Care': [
        { name: 'Haircut & Styling', price: '₹2000/service', icon: 'fa-cut', description: 'Professional haircut services' },
        { name: 'Hair Coloring', price: '₹2200/service', icon: 'fa-paint-brush', description: 'Expert hair coloring services' },
        { name: 'Massage Therapy', price: '₹2100/hr', icon: 'fa-spa', description: 'Relaxing massage therapy sessions' },
        { name: 'Facial Treatment', price: '₹2300/service', icon: 'fa-smile', description: 'Rejuvenating facial treatments' },
        { name: 'Manicure', price: '₹2500/service', icon: 'fa-hand-sparkles', description: 'Manicure and nail care services' },
        { name: 'Pedicure', price: '₹2500/service', icon: 'fa-foot', description: 'Pedicure and foot care services' },
        { name: 'Waxing', price: '₹2300/area', icon: 'fa-female', description: 'Professional waxing services' },
        { name: 'Hair Treatment', price: '₹3000/service', icon: 'fa-leaf', description: 'Advanced hair treatment services' },
        { name: 'Makeup Service', price: '₹3500/service', icon: 'fa-magic', description: 'Professional makeup services for events' }
    ]
};

const professionals = [
    {
        id: 'pro1',
        name: "Rajesh Kumar",
        title: "Home Renovation Expert",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3",
        rating: 4.8,
        reviews: 128,
        location: "Mumbai, Maharashtra",
        experience: "8 years",
        price: "₹1500/hour",
        badge: "Top Rated",
        services: ["Home Renovation", "Interior Design", "Carpentry"],
        coordinates: {
            lat: 19.0760,
            lng: 72.8777
        }
    },
    {
        id: 'pro2',
        name: "Priya Sharma",
        title: "Interior Designer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3",
        rating: 4.7,
        reviews: 95,
        location: "Delhi, NCR",
        experience: "6 years",
        price: "₹2000/hour",
        badge: "Featured",
        services: ["Interior Design", "Color Consultation", "Space Planning"],
        coordinates: {
            lat: 28.7041,
            lng: 77.1025
        }
    },
    // ... Add more professionals with Indian details ...
];

// Add demo professionals array
const demoProfessionals = [
    {
        id: 'pro1',
        name: "Rajesh Kumar",
        title: "Computer Repair Specialist",
        image: "https://randomuser.me/api/portraits/men/44.jpg",
        rating: 4.8,
        reviews: 128,
        location: "Andheri West, Mumbai",
        experience: "8 years",
        price: "₹1500/hour",
        badge: "Top Rated",
        services: ["Computer Repair", "Network Setup", "Virus Removal"],
        coordinates: {
            lat: 19.1136,
            lng: 72.8697
        }
    },
    {
        id: 'pro2',
        name: "Priya Sharma",
        title: "Web Developer",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 4.7,
        reviews: 95,
        location: "Powai, Mumbai",
        experience: "6 years",
        price: "₹2000/hour",
        badge: "Featured",
        services: ["Web Development", "IT Consulting", "Tech Training"],
        coordinates: {
            lat: 19.1176,
            lng: 72.9060
        }
    },
    {
        id: 'pro3',
        name: "Amit Patel",
        title: "Home Service Expert",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 4.9,
        reviews: 156,
        location: "Malad, Mumbai",
        experience: "10 years",
        price: "₹1200/hour",
        badge: "Premium",
        services: ["House Cleaning", "Plumbing", "Electrical Work"],
        coordinates: {
            lat: 19.1869,
            lng: 72.8484
        }
    },
    {
        id: 'pro4',
        name: "Sneha Verma",
        title: "Education Specialist",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        rating: 4.6,
        reviews: 82,
        location: "Bandra, Mumbai",
        experience: "5 years",
        price: "₹800/hour",
        badge: "Verified",
        services: ["Math Tutoring", "Science Tutoring", "Test Preparation"],
        coordinates: {
            lat: 19.0596,
            lng: 72.8295
        }
    },
    {
        id: 'pro5',
        name: "Kiran Shah",
        title: "Beauty Expert",
        image: "https://randomuser.me/api/portraits/women/22.jpg",
        rating: 4.8,
        reviews: 143,
        location: "Juhu, Mumbai",
        experience: "7 years",
        price: "₹1800/hour",
        badge: "Top Rated",
        services: ["Haircut & Styling", "Makeup Service", "Hair Treatment"],
        coordinates: {
            lat: 19.1075,
            lng: 72.8263
        }
    }
];

// Service display functions
function showServices(category) {
    const servicesSection = document.getElementById('servicesSection');
    const categoriesSection = document.getElementById('categories');
    const selectedCategory = document.getElementById('selectedCategory');
    const servicesGrid = document.getElementById('servicesGrid');
    
    selectedCategory.textContent = category + ' Services';
    servicesGrid.innerHTML = '';
    
    servicesByCategory[category].forEach(service => {
        const serviceCard = `
            <div class="service-card">
                <div class="service-icon">
                    <i class="fas ${service.icon}"></i>
                </div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-price">${service.price}</div>
                <button class="book-btn" onclick="showBookingModal('${service.name}', '${category}')">
                    Book Now
                </button>
            </div>
        `;
        servicesGrid.innerHTML += serviceCard;
    });
    
    categoriesSection.style.display = 'none';
    servicesSection.style.display = 'block';
    servicesSection.scrollIntoView({ behavior: 'smooth' });
}

function hideServices() {
    const servicesSection = document.getElementById('servicesSection');
    const categoriesSection = document.getElementById('categories');
    
    servicesSection.style.display = 'none';
    categoriesSection.style.display = 'block';
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
}

// Add new function to show available professionals with their slots
function showAvailableProfessionals(serviceName, category) {
    const servicesSection = document.getElementById('servicesSection');
    const professionalsSection = document.createElement('div');
    professionalsSection.className = 'professionals-booking-section';
    
    // Get professionals offering this service
    const availableProfessionals = professionals.filter(pro => 
        pro.services.includes(serviceName)
    );

    const currentDate = new Date();
    const nextWeek = new Array(7).fill().map((_, i) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        return date;
    });

    professionalsSection.innerHTML = `
        <div class="booking-header">
            <button class="back-btn" onclick="hideAvailableProfessionals()">
                <i class="fas fa-arrow-left"></i> Back to Services
            </button>
            <h2>Available Professionals for ${serviceName}</h2>
        </div>
        <div class="professionals-grid">
            ${availableProfessionals.map(pro => `
                <div class="professional-booking-card">
                    <div class="pro-info">
                        <img src="${pro.image}" alt="${pro.name}" class="pro-image">
                        <h3>${pro.name}</h3>
                        <div class="rating">
                            ${generateStars(pro.rating)}
                            <span>(${pro.reviews} reviews)</span>
                        </div>
                        <p><i class="fas fa-map-marker-alt"></i> ${pro.location}</p>
                        <p><i class="fas fa-briefcase"></i> ${pro.experience}</p>
                        <p><i class="fas fa-rupee-sign"></i> ${pro.price}</p>
                    </div>
                    <div class="availability-slots">
                        <h4>Available Slots</h4>
                        <div class="date-selector">
                            ${nextWeek.map((date, index) => `
                                <button class="date-btn ${index === 0 ? 'active' : ''}"
                                    onclick="showTimeSlots('${pro.id}', '${date.toISOString()}')"
                                    data-date="${date.toISOString()}">
                                    ${date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                                </button>
                            `).join('')}
                        </div>
                        <div class="time-slots" id="timeSlots-${pro.id}">
                            ${generateTimeSlots()}
                        </div>
                    </div>
                    <button class="book-slot-btn" onclick="initiateBooking('${pro.id}', '${serviceName}')">
                        Book Appointment
                    </button>
                </div>
            `).join('')}
        </div>
    `;

    servicesSection.appendChild(professionalsSection);
}

function generateTimeSlots() {
    const slots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    
    return `
        <div class="slots-grid">
            ${slots.map(time => `
                <button class="time-slot" onclick="selectTimeSlot(this)">
                    ${time}
                </button>
            `).join('')}
        </div>
    `;
}

function selectTimeSlot(button) {
    // Remove active class from all slots
    const allSlots = document.querySelectorAll('.time-slot');
    allSlots.forEach(slot => slot.classList.remove('active'));
    
    // Add active class to selected slot
    button.classList.add('active');
}

function initiateBooking(professionalId, serviceName) {
    const selectedDate = document.querySelector('.date-btn.active').dataset.date;
    const selectedTime = document.querySelector('.time-slot.active')?.textContent;
    
    if (!selectedTime) {
        alert('Please select a time slot');
        return;
    }

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                createBooking(professionalId, serviceName, selectedDate, selectedTime, userLocation);
            },
            (error) => {
                alert('Please enable location access to continue booking');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

async function createBooking(professionalId, serviceName, date, time, userLocation) {
    const professional = professionals.find(p => p.id === professionalId);
    
    // Get address from coordinates using Google Maps Geocoding
    try {
        const geocoder = new google.maps.Geocoder();
        const response = await new Promise((resolve, reject) => {
            geocoder.geocode({ location: userLocation }, (results, status) => {
                if (status === 'OK') {
                    resolve(results[0].formatted_address);
                } else {
                    reject('Geocoding failed');
                }
            });
        });

        const booking = {
            id: Date.now(),
            professionalId: professional.id,
            professionalName: professional.name,
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName'),
            service: serviceName,
            price: professional.price,
            status: 'Pending',
            date: new Date(date).toISOString().split('T')[0],
            time: time,
            location: {
                address: response,
                lat: userLocation.lat,
                lng: userLocation.lng
            }
        };

        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        alert(`Booking confirmed with ${professional.name}!\nBooking ID: ${booking.id}`);
        window.location.href = 'marketplace.html#dashboard';
    } catch (error) {
        alert('Error creating booking. Please try again.');
    }
}

// Professional display and booking functions
function showProfessionals(serviceName) {
    const professionalsList = professionals.filter(prof => prof.services.includes(serviceName));
    const professionalsContainer = document.getElementById('professionals-container');
    
    professionalsContainer.innerHTML = '';

    professionalsList.forEach(prof => {
        const mapContainerId = `map-${prof.id}`;
        const profCard = `
            <div class="professional-card" data-pro-id="${prof.id}">
                <div class="pro-image">
                    <img src="${prof.image}" alt="${prof.name}">
                    <div class="pro-badge">${prof.badge}</div>
                </div>
                <div class="pro-info">
                    <h3>${prof.name}</h3>
                    <p class="pro-title">${prof.title}</p>
                    <div class="rating">
                        ${generateStars(prof.rating)}
                        <span>(${prof.reviews} reviews)</span>
                    </div>
                    <div class="pro-details">
                        <p><i class="fas fa-map-marker-alt"></i> ${prof.location}</p>
                        <p><i class="fas fa-briefcase"></i> ${prof.experience}</p>
                        <p><i class="fas fa-rupee-sign"></i> ${prof.price}</p>
                    </div>
                    <div class="map-container" id="${mapContainerId}"></div>
                    <button class="directions-btn" onclick="getDirections('${prof.id}')">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                    <button class="book-btn" onclick="bookProfessional('${prof.id}')">Book Now</button>
                </div>
            </div>
        `;
        professionalsContainer.innerHTML += profCard;

        // Initialize map after the container is added to the DOM
        setTimeout(() => {
            initializeMap(prof, mapContainerId);
        }, 100);
    });

    professionalsContainer.style.display = 'block';
}

function bookService(professionalName) {
    // ... existing bookService function ...
}

// Function to generate star rating display
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Function to initialize map for a professional
function initializeMap(professional, containerId) {
    const map = new google.maps.Map(document.getElementById(containerId), {
        center: professional.coordinates,
        zoom: 12,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{ "color": "#f5f5f5" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#e9e9e9" }]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: professional.coordinates,
        map: map,
        title: professional.name,
        animation: google.maps.Animation.DROP
    });

    return { map, marker };
}

// Function to get directions to professional's location
function getDirections(professionalId) {
    const professional = professionals.find(p => p.id === professionalId);
    if (!professional) return;

    const destination = `${professional.coordinates.lat},${professional.coordinates.lng}`;
    window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
        '_blank'
    );
}

// Function to book a professional
function bookProfessional(professionalId) {
    const professional = professionals.find(p => p.id === professionalId);
    if (!professional) return;

    const booking = {
        id: Date.now(),
        professionalId: professional.id,
        professionalName: professional.name,
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        service: professional.services[0],
        price: professional.price,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        location: {
            address: professional.location,
            lat: professional.coordinates.lat,
            lng: professional.coordinates.lng
        }
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show confirmation
    alert(`Booking confirmed with ${professional.name}!\nBooking ID: ${booking.id}`);
    
    // Update dashboard
    updateDashboard();
}

// Function to update dashboard with bookings
function updateDashboard() {
    const userId = localStorage.getItem('userId');
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBookings = bookings.filter(booking => booking.userId === userId);

    const upcomingBookingsList = document.querySelector('.upcoming-bookings .booking-list');
    const pastBookingsList = document.querySelector('.past-bookings .booking-list');

    // Only proceed if the elements exist
    if (upcomingBookingsList && pastBookingsList) {
        // Clear existing bookings
        upcomingBookingsList.innerHTML = '';
        pastBookingsList.innerHTML = '';

        // Sort bookings by date
        userBookings.forEach(booking => {
            const bookingDate = new Date(booking.date);
            const isUpcoming = bookingDate >= new Date();
            const listElement = isUpcoming ? upcomingBookingsList : pastBookingsList;

            listElement.innerHTML += `
                <div class="booking-item">
                    <div class="booking-details">
                        <h4>${booking.professionalName}</h4>
                        <p>${booking.service}</p>
                        <p><i class="fas fa-calendar"></i> ${booking.date}</p>
                        <p><i class="fas fa-clock"></i> ${booking.time}</p>
                        <p><i class="fas fa-rupee-sign"></i> ${booking.price}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${booking.location.address}</p>
                    </div>
                    <div class="booking-status ${booking.status.toLowerCase()}">
                        ${booking.status}
                    </div>
                </div>
            `;
        });
    }
}

function updateBookingProgress() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const latestBooking = bookings[bookings.length - 1];
    
    if (latestBooking) {
        const progressContainer = document.getElementById('bookingProgressContainer');
        const steps = [
            { status: 'Pending', icon: 'fa-clock', text: 'Booking Placed' },
            { status: 'Confirmed', icon: 'fa-check', text: 'Professional Confirmed' },
            { status: 'In Progress', icon: 'fa-tools', text: 'Service in Progress' },
            { status: 'Completed', icon: 'fa-flag-checkered', text: 'Service Completed' }
        ];
        
        let progressHTML = '<div class="progress-steps">';
        let currentStepFound = false;
        
        steps.forEach((step, index) => {
            const isActive = !currentStepFound && 
                (latestBooking.status === step.status || 
                 (index === 0 && latestBooking.status === 'Pending'));
                 
            if (isActive) currentStepFound = true;
            
            progressHTML += `
                <div class="progress-step ${isActive ? 'active' : ''}">
                    <div class="step-icon">
                        <i class="fas ${step.icon}"></i>
                    </div>
                    <div class="step-text">${step.text}</div>
                </div>
            `;
        });
        
        progressHTML += '</div>';
        progressContainer.innerHTML = progressHTML;
    }
}

function updateUserDashboard() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userId = localStorage.getItem('userId');
    const userBookings = bookings.filter(booking => booking.userId === userId);

    const upcomingBookingsList = document.getElementById('upcomingBookingsList');
    const pastBookingsList = document.getElementById('pastBookingsList');

    // Show most recent booking progress
    if (userBookings.length > 0) {
        const latestBooking = userBookings[userBookings.length - 1];
        updateBookingProgress(latestBooking);
    }

    // Split bookings into upcoming and past
    const currentDate = new Date();
    const upcoming = userBookings.filter(booking => new Date(booking.date) >= currentDate);
    const past = userBookings.filter(booking => new Date(booking.date) < currentDate);

    // Display upcoming bookings
    upcomingBookingsList.innerHTML = upcoming.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <h4>${booking.service}</h4>
                <span class="booking-status status-${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <p><i class="fas fa-user"></i> ${booking.professionalName}</p>
                <p><i class="fas fa-calendar"></i> ${new Date(booking.date).toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> ${booking.time}</p>
                <p><i class="fas fa-rupee-sign"></i> ${booking.price}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${booking.location.address}</p>
            </div>
        </div>
    `).join('') || '<p>No upcoming bookings</p>';

    // Display past bookings
    pastBookingsList.innerHTML = past.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <h4>${booking.service}</h4>
                <span class="booking-status status-${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <p><i class="fas fa-user"></i> ${booking.professionalName}</p>
                <p><i class="fas fa-calendar"></i> ${new Date(booking.date).toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> ${booking.time}</p>
                <p><i class="fas fa-rupee-sign"></i> ${booking.price}</p>
                ${booking.status === 'Completed' && !booking.hasReview ? `
                    <button class="review-btn" onclick="addReview('${booking.id}')">
                        <i class="fas fa-star"></i> Add Review
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('') || '<p>No past bookings</p>';
}

function showBookingModal(serviceName, category) {
    const modal = document.getElementById('bookingModal');
    const serviceDetails = servicesByCategory[category].find(s => s.name === serviceName);
    
    modal.innerHTML = `
        <div class="modal-content booking-modal">
            <button class="modal-close-btn" onclick="closeBookingModal()">
                <span class="close-icon">×</span>
                <span class="close-text">Close</span>
            </button>
            
            <div class="booking-info-banner">
                <div class="service-details">
                    <h2>${serviceName}</h2>
                    <p class="service-category">${category}</p>
                    <p class="service-price">${serviceDetails.price}</p>
                </div>
                <div class="info-tooltip">
                    <i class="fas fa-info-circle"></i>
                    <div class="tooltip-content">
                        <h4>Booking Information:</h4>
                        <ul>
                            <li>Service will be confirmed after professional acceptance</li>
                            <li>Payment will be collected after service completion</li>
                            <li>You can reschedule up to 2 hours before appointment</li>
                            <li>Cancellation is free up to 4 hours before appointment</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="booking-form">
                <div class="location-section">
                    <h3>Your Location</h3>
                    <div class="location-input-group">
                        <input type="text" 
                            id="bookingAddress" 
                            placeholder="Enter your address" 
                            class="location-input">
                        <button onclick="getCurrentLocation()" 
                                class="get-location-btn">
                            <i class="fas fa-location-arrow"></i> Get Location
                        </button>
                    </div>
                    <div id="bookingMap" class="booking-map"></div>
                    <p class="location-note">
                        <i class="fas fa-info-circle"></i>
                        Click on the map to set your location or use the location button
                    </p>
                </div>

                <div class="professionals-list">
                    ${generateProfessionalsList(serviceName)}
                </div>

                <div class="booking-summary">
                    <h3>Booking Summary</h3>
                    <div class="summary-details">
                        <div class="summary-item">
                            <span>Service:</span>
                            <span>${serviceName}</span>
                        </div>
                        <div class="summary-item">
                            <span>Category:</span>
                            <span>${category}</span>
                        </div>
                        <div class="summary-item">
                            <span>Price:</span>
                            <span>${serviceDetails.price}</span>
                        </div>
                    </div>
                </div>

                <button onclick="confirmBooking('${serviceName}', '${category}')" 
                        class="confirm-booking-btn">
                    Confirm Booking
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    initializeBookingMap();
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showLocationError("Geolocation is not supported by your browser");
        return;
    }

    const locationButton = document.querySelector('.get-location-btn');
    locationButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(
        // Success callback
        async (position) => {
            const latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            try {
                const map = window.bookingMap;
                const marker = window.bookingMarker;
                
                if (map && marker) {
                    map.setCenter(latLng);
                    marker.setPosition(latLng);
                    
                    // Get address from coordinates
                    await getAddressFromCoordinates(latLng);
                }
            } catch (error) {
                showLocationError("Error updating location. Please try again.");
            } finally {
                // Reset button
                locationButton.innerHTML = '<i class="fas fa-location-arrow"></i> Get Location';
                locationButton.disabled = false;
            }
        },
        // Error callback
        (error) => {
            let errorMessage = "Unable to get your location. ";
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += "Please enable location access in your browser settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMessage += "Location request timed out.";
                    break;
                default:
                    errorMessage += "Please enter your location manually.";
            }
            
            showLocationError(errorMessage);
            
            // Reset button
            locationButton.innerHTML = '<i class="fas fa-location-arrow"></i> Get Location';
            locationButton.disabled = false;
        },
        // Options
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function getAddressFromCoordinates(latLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
            document.getElementById('bookingAddress').value = results[0].formatted_address;
        }
    });
}

function initializeBookingMap() {
    const defaultLocation = { lat: 19.0760, lng: 72.8777 }; // Mumbai coordinates
    const map = new google.maps.Map(document.getElementById('bookingMap'), {
        center: defaultLocation,
        zoom: 13,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    // Store references globally
    window.bookingMap = map;
    window.bookingMarker = marker;

    // Add click listener to map
    map.addListener('click', (e) => {
        marker.setPosition(e.latLng);
        getAddressFromCoordinates(e.latLng.toJSON());
    });

    // Update address when marker is dragged
    marker.addListener('dragend', () => {
        getAddressFromCoordinates(marker.getPosition().toJSON());
    });
}

function generateProfessionalsList(serviceName) {
    const availablePros = demoProfessionals.filter(pro => 
        pro.services.includes(serviceName)
    );
    
    return availablePros.map(pro => `
        <div class="professional-card" data-pro-id="${pro.id}" onclick="selectProfessional(this)">
            <img src="${pro.image}" alt="${pro.name}" class="pro-image">
            <div class="pro-info">
                <h4>${pro.name}</h4>
                <div class="rating">
                    ${generateStars(pro.rating)}
                    <span>(${pro.reviews} reviews)</span>
                </div>
                <p><i class="fas fa-map-marker-alt"></i> ${pro.location}</p>
                <p><i class="fas fa-briefcase"></i> ${pro.experience}</p>
                <p><i class="fas fa-rupee-sign"></i> ${pro.price}</p>
            </div>
        </div>
    `).join('');
}

function selectProfessional(card) {
    // Remove selection from all cards
    document.querySelectorAll('.professional-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
}

function confirmBooking(serviceName, category) {
    const address = document.getElementById('bookingAddress').value;
    const selectedCard = document.querySelector('.professional-card.selected');
    
    if (!selectedCard) {
        alert('Please select a professional to continue');
        return;
    }
    
    if (!address) {
        alert('Please enter your address');
        return;
    }

    const professionalId = selectedCard.dataset.proId;
    const professional = demoProfessionals.find(p => p.id === professionalId);

    if (!professional) {
        alert('Error finding professional details. Please try again.');
        return;
    }

    const booking = {
        id: Date.now(),
        professionalId: professional.id,
        professionalName: professional.name,
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        service: serviceName,
        category: category,
        price: professional.price,
        status: 'Pending',
        location: {
            address: address,
            coordinates: window.bookingMarker.getPosition().toJSON()
        },
        date: new Date().toLocaleDateString(),
        time: '10:00 AM', // You can make this dynamic if needed
        timestamp: new Date().toISOString(),
        statusHistory: [
            {
                status: 'Pending',
                timestamp: new Date().toISOString(),
                note: 'Booking placed'
            }
        ],
        notified: false
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show confirmation
    showBookingConfirmation(booking);
    closeBookingModal();
}

function showBookingConfirmation(booking) {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal confirmation-modal';
    confirmationModal.innerHTML = `
        <div class="modal-content">
            <div class="confirmation-header">
                <i class="fas fa-check-circle"></i>
                <h2>Booking Confirmed!</h2>
            </div>
            <div class="confirmation-details">
                <p><strong>Service:</strong> ${booking.service}</p>
                <p><strong>Professional:</strong> ${booking.professionalName}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Time:</strong> ${booking.time}</p>
                <p><strong>Location:</strong> ${booking.location.address}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
                <p class="booking-id">Booking ID: ${booking.id}</p>
            </div>
            <button onclick="this.closest('.modal').remove()" class="confirm-btn">
                OK
            </button>
        </div>
    `;
    document.body.appendChild(confirmationModal);
}

// Update Dashboard Statistics
function updateDashboardStats() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const activeBookings = bookings.filter(booking => booking.status === 'Pending' || booking.status === 'Confirmed');
    
    document.getElementById('activeBookingsCount').textContent = activeBookings.length;
    document.getElementById('totalBookingsCount').textContent = bookings.length;
    
    // For demo purposes, showing a random wallet balance
    const walletBalance = localStorage.getItem('walletBalance') || '5000';
    document.getElementById('walletBalance').textContent = '₹' + walletBalance;
}

// Update Booking Lists
function updateBookingLists() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const upcomingList = document.getElementById('upcomingBookingsList');
    const pastList = document.getElementById('pastBookingsList');
    
    const upcoming = bookings.filter(booking => 
        booking.status === 'Pending' || 
        booking.status === 'Confirmed' || 
        booking.status === 'In Progress'
    );
    
    const past = bookings.filter(booking => 
        booking.status === 'Completed' || 
        booking.status === 'Cancelled'
    );
    
    upcomingList.innerHTML = upcoming.map(booking => createBookingCard(booking)).join('');
    pastList.innerHTML = past.map(booking => createBookingCard(booking)).join('');
}

// Create Booking Card HTML
function createBookingCard(booking) {
    return `
        <div class="booking-card">
            <div class="booking-header">
                <h4>${booking.service}</h4>
                <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <p><i class="fas fa-user"></i> ${booking.professionalName}</p>
                <p><i class="fas fa-calendar"></i> ${booking.date}</p>
                <p><i class="fas fa-clock"></i> ${booking.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${booking.location.address}</p>
                <p><i class="fas fa-rupee-sign"></i> ${booking.price}</p>
            </div>
        </div>
    `;
}

// Add this new function to show location errors
function showLocationError(message) {
    const locationNote = document.querySelector('.location-note');
    locationNote.innerHTML = `
        <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
        <span style="color: #dc3545;">${message}</span>
    `;
    
    // Automatically hide the error after 5 seconds
    setTimeout(() => {
        locationNote.innerHTML = `
            <i class="fas fa-info-circle"></i>
            Click on the map to set your location or use the location button
        `;
    }, 5000);
}

// Booking System with Location Capture
const bookingSystem = {
    // Initialize booking system
    init() {
        this.loadDemoServices();
        this.initializeGeolocation();
        this.loadBookings();
    },

    // Load demo services and professionals
    loadDemoServices() {
        const demoServices = [
            {
                id: 'tech1',
                category: 'Technology',
                name: 'Computer Repair',
                price: '₹1500/hr',
                professionals: [
                    {
                        id: 'pro1',
                        name: 'Rajesh Kumar',
                        rating: 4.8,
                        reviews: 128,
                        image: 'https://randomuser.me/api/portraits/men/44.jpg',
                        location: 'Mumbai',
                        coordinates: { lat: 19.0760, lng: 72.8777 }
                    },
                    // Add more professionals
                ]
            },
            // Add more services
        ];
        localStorage.setItem('demoServices', JSON.stringify(demoServices));
    },

    // Initialize geolocation
    initializeGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.reverseGeocode(this.userLocation);
                },
                error => {
                    console.error('Geolocation error:', error);
                    this.showLocationPrompt();
                }
            );
        }
    },

    // Reverse geocode coordinates to address
    async reverseGeocode(location) {
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ location });
            if (response.results[0]) {
                this.userAddress = response.results[0].formatted_address;
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    },

    // Show booking modal with enhanced features
    async showBookingModal(service, category) {
        // First request location permission
        if (navigator.geolocation) {
            try {
                const position = await this.getCurrentPosition();
                const address = await this.getAddressFromCoordinates(position);
                this.showBookingForm(service, category, position, address);
            } catch (error) {
                // If geolocation fails, show manual address input
                this.showBookingForm(service, category);
            }
        } else {
            this.showBookingForm(service, category);
        }
    },

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => reject(error)
            );
        });
    },

    async getAddressFromCoordinates(position) {
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ location: position });
            if (response.results[0]) {
                return response.results[0].formatted_address;
            }
            return '';
        } catch (error) {
            console.error('Geocoding error:', error);
            return '';
        }
    },

    showBookingForm(service, category, position = null, address = '') {
        // Get service price from servicesByCategory
        const serviceDetails = this.getServiceDetails(service, category);
        const price = serviceDetails ? serviceDetails.price : 'Price not available';

        const modal = document.getElementById('bookingModal');
        modal.innerHTML = `
            <div class="modal-content booking-modal">
                <button class="modal-close-btn" onclick="bookingSystem.closeModal()">
                    <span class="close-icon">×</span>
                    <span class="close-text">Close</span>
                </button>
                
                <div class="booking-info-banner">
                    <div class="service-details">
                        <h2>Book ${service}</h2>
                        <p class="service-category">${category}</p>
                        <p class="service-price">${price}</p>
                    </div>
                    <div class="info-tooltip">
                        <i class="fas fa-info-circle"></i>
                        <div class="tooltip-content">
                            <h4>Booking Information:</h4>
                            <ul>
                                <li>Service will be confirmed after professional acceptance</li>
                                <li>Payment will be collected after service completion</li>
                                <li>You can reschedule up to 2 hours before appointment</li>
                                <li>Cancellation is free up to 4 hours before appointment</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="booking-form">
                    <div class="location-section">
                        <h3>Your Location</h3>
                        <div class="location-input-group">
                            <input type="text" 
                                id="bookingAddress" 
                                placeholder="Enter your address" 
                                value="${address}"
                                class="location-input">
                            <button onclick="bookingSystem.getCurrentLocation()" 
                                    class="get-location-btn">
                                <i class="fas fa-location-arrow"></i>
                            </button>
                        </div>
                        <div id="bookingMap" class="booking-map"></div>
                        <p class="location-note">
                            <i class="fas fa-info-circle"></i>
                            Click on the map to set your location or use the location button
                        </p>
                    </div>

                    <div class="datetime-section">
                        <h3>Select Date & Time</h3>
                        <div class="date-picker">
                            <label for="bookingDate">Preferred Date:</label>
                            <input type="date" 
                                id="bookingDate" 
                                min="${this.getMinDate()}" 
                                required>
                        </div>
                        <div class="time-picker">
                            <label for="bookingTime">Preferred Time:</label>
                            <select id="bookingTime" required>
                                ${this.generateTimeOptions()}
                            </select>
                        </div>
                    </div>

                    <div class="booking-summary">
                        <h3>Booking Summary</h3>
                        <div class="summary-details">
                            <div class="summary-item">
                                <span>Service:</span>
                                <span>${service}</span>
                            </div>
                            <div class="summary-item">
                                <span>Price:</span>
                                <span>${price}</span>
                            </div>
                            <div class="summary-item">
                                <span>Category:</span>
                                <span>${category}</span>
                            </div>
                        </div>
                    </div>

                    <button onclick="bookingSystem.confirmBooking('${service}', '${category}')" 
                            class="confirm-booking-btn">
                        Confirm Booking
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        this.initializeBookingMap(position);
    },

    getServiceDetails(serviceName, category) {
        const services = servicesByCategory[category];
        return services?.find(service => service.name === serviceName);
    },

    async getCurrentLocation() {
        try {
            const position = await this.getCurrentPosition();
            const address = await this.getAddressFromCoordinates(position);
            
            document.getElementById('bookingAddress').value = address;
            
            // Update map
            const map = this.currentMap;
            const marker = this.currentMarker;
            
            if (map && marker) {
                const latLng = new google.maps.LatLng(position.lat, position.lng);
                map.setCenter(latLng);
                marker.setPosition(latLng);
            }
        } catch (error) {
            alert('Unable to get your location. Please enter it manually.');
        }
    },

    initializeBookingMap(position) {
        const defaultPosition = { lat: 19.0760, lng: 72.8777 }; // Mumbai coordinates
        const mapPosition = position || defaultPosition;

        const map = new google.maps.Map(document.getElementById('bookingMap'), {
            center: mapPosition,
            zoom: 13,
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                }
            ]
        });

        const marker = new google.maps.Marker({
            position: mapPosition,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        // Store references
        this.currentMap = map;
        this.currentMarker = marker;

        // Update address when marker is dragged
        marker.addListener('dragend', async () => {
            const newPosition = marker.getPosition().toJSON();
            const address = await this.getAddressFromCoordinates(newPosition);
            document.getElementById('bookingAddress').value = address;
        });

        // Add click listener to map
        map.addListener('click', async (e) => {
            marker.setPosition(e.latLng);
            const newPosition = e.latLng.toJSON();
            const address = await this.getAddressFromCoordinates(newPosition);
            document.getElementById('bookingAddress').value = address;
        });
    },

    async confirmBooking(service, category) {
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const address = document.getElementById('bookingAddress').value;

        if (!date || !time || !address) {
            alert('Please fill in all required fields');
            return;
        }

        const booking = {
            id: Date.now(),
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName'),
            service,
            category,
            date,
            time,
            status: 'Pending',
            location: {
                address,
                coordinates: await this.getCoordinatesFromAddress(address)
            },
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Show confirmation
        this.showConfirmation(booking);
        
        // Update dashboards
        this.updateDashboards();
    },

    async getCoordinatesFromAddress(address) {
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ address });
            if (response.results[0]) {
                const location = response.results[0].geometry.location;
                return {
                    lat: location.lat(),
                    lng: location.lng()
                };
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    },

    // ... other existing functions ...
};

// Initialize booking system when page loads
document.addEventListener('DOMContentLoaded', () => {
    bookingSystem.init();
}); 

// In both booking.js and marketplace.js
function showMap(professional) {
    const mapData = initializeServiceMap({
        id: professional.id,
        location: professional.coordinates,
        serviceType: professional.title
    });
}