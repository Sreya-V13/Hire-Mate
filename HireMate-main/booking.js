// Import shared data
document.write('<script src="shared-data.js"></script>');

document.addEventListener('DOMContentLoaded', function() {
    // Get service details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('service');
    const category = urlParams.get('category');

    // Display professionals for the selected service
    displayProfessionals(serviceName, category);
});

function displayProfessionals(serviceName, category) {
    const container = document.getElementById('availableProfessionals');
    // Use only the professional profile for all services
    const professionalUser = demoProfessionals.find(pro => pro.email === 'professional@gmail.com');
    const filteredPros = professionalUser ? [professionalUser] : [];

    container.innerHTML = filteredPros.map(pro => `
        <div class="professional-booking-card">
            <div class="pro-info">
                <img src="${pro.image}" alt="${pro.name}" class="pro-image">
                <div class="pro-badge">${pro.badge}</div>
                <h3>${pro.name}</h3>
                <p class="pro-title">${pro.title}</p>
                <div class="rating">
                    ${generateStars(pro.rating)}
                    <span>(${pro.reviews} reviews)</span>
                </div>
                <div class="pro-details">
                    <p><i class="fas fa-map-marker-alt"></i> ${pro.location}</p>
                    <p><i class="fas fa-briefcase"></i> ${pro.experience}</p>
                    <p><i class="fas fa-rupee-sign"></i> ${pro.price}</p>
                </div>
            </div>
            <div class="availability-slots">
                <h4>Available Slots</h4>
                <div class="slots-grid">
                    ${pro.availability.map(time => `
                        <button class="time-slot" onclick="selectTimeSlot(this)">
                            ${time}
                        </button>
                    `).join('')}
                </div>
            </div>
            <button class="book-slot-btn" onclick="confirmBooking('${pro.id}', '${serviceName}')">
                Book Appointment
            </button>
        </div>
    `).join('');
}

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

function selectTimeSlot(button) {
    // Remove active class from all slots in this professional's card
    const card = button.closest('.professional-booking-card');
    card.querySelectorAll('.time-slot').forEach(slot => 
        slot.classList.remove('active')
    );
    
    // Add active class to selected slot
    button.classList.add('active');
}

let map;
let marker;

function initMap(lat, lng) {
    const location = { lat, lng };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: location,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            }
        ]
    });

    marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Service Location'
    });
}

function showBookingDetails(professionalId, serviceName) {
    const professional = demoProfessionals.find(p => p.id === professionalId);
    const selectedTime = document.querySelector('.time-slot.active');

    if (!selectedTime) {
        alert('Please select a time slot');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeBookingModal()">&times;</span>
            <div class="booking-details">
                <div class="map-container">
                    <div id="map" style="height: 300px; width: 100%; border-radius: 12px;"></div>
                </div>
                <div class="booking-summary">
                    <h3>Booking Summary</h3>
                    <div id="summaryContent"></div>
                    <button class="confirm-booking-btn" onclick="finalizeBooking('${professionalId}', '${serviceName}')">Confirm Booking</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    initMap(professional.coordinates.lat, professional.coordinates.lng);

    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = `
        <div class="summary-item">
            <h4>Professional</h4>
            <p>${professional.name}</p>
        </div>
        <div class="summary-item">
            <h4>Service</h4>
            <p>${serviceName}</p>
        </div>
        <div class="summary-item">
            <h4>Date & Time</h4>
            <p>${new Date().toLocaleDateString()} at ${selectedTime.textContent.trim()}</p>
        </div>
        <div class="summary-item">
            <h4>Location</h4>
            <p>${professional.location}</p>
        </div>
        <div class="summary-item">
            <h4>Price</h4>
            <p>${professional.price}</p>
        </div>
    `;
}

function closeBookingModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function confirmBooking(professionalId, serviceName) {
    const selectedTime = document.querySelector('.time-slot.active');
    
    if (!selectedTime) {
        alert('Please select a time slot');
        return;
    }

    // Request user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                proceedWithBooking(professionalId, serviceName, selectedTime, userLocation);
            },
            error => {
                console.error('Error getting location:', error);
                const useDefaultLocation = confirm('Could not get your location. Would you like to proceed with manual location entry?');
                if (useDefaultLocation) {
                    proceedWithBooking(professionalId, serviceName, selectedTime);
                }
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter location manually.');
        proceedWithBooking(professionalId, serviceName, selectedTime);
    }
}

function proceedWithBooking(professionalId, serviceName, selectedTime, userLocation = null) {
    // Always use the professional user for bookings
    const professional = demoProfessionals.find(p => p.email === 'professional@gmail.com');
    
    const booking = {
        id: Date.now(),
        professionalId: professional.id,
        professionalName: professional.name,
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
        service: serviceName,
        price: professional.price,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        time: selectedTime.textContent.trim(),
        location: userLocation ? {
            address: 'Current Location',
            lat: userLocation.lat,
            lng: userLocation.lng
        } : {
            address: professional.location,
            lat: professional.coordinates.lat,
            lng: professional.coordinates.lng
        }
    };

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'booking-notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Booking confirmed successfully!</p>
        <p>Professional: ${professional.name}</p>
        <p>Service: ${serviceName}</p>
        <p>Date: ${booking.date} at ${booking.time}</p>
    `;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
        window.location.href = 'marketplace.html#dashboard';
    }, 5000);

    // Update dashboard in marketplace
    const dashboardBookings = document.getElementById('upcomingBookingsList');
    if (dashboardBookings) {
        const bookingElement = document.createElement('div');
        bookingElement.className = 'booking-item';
        bookingElement.innerHTML = `
            <div class="booking-info">
                <h4>${professional.name}</h4>
                <p>${serviceName}</p>
                <p><i class="fas fa-calendar"></i> ${booking.date} at ${booking.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${booking.location.address}</p>
                <div class="booking-status pending">${booking.status}</div>
            </div>
            <div class="map-container" id="map-${booking.id}" style="height: 200px; margin-top: 10px;"></div>
        `;
        dashboardBookings.appendChild(bookingElement);

        // Initialize map for the booking
        const map = new google.maps.Map(document.getElementById(`map-${booking.id}`), {
            zoom: 14,
            center: booking.location,
            styles: [{
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            }]
        });

        new google.maps.Marker({
            position: booking.location,
            map: map,
            title: 'Service Location'
        });
    }
}
}