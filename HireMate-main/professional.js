function updateBookingStatus(bookingId, newStatus) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingIndex = bookings.findIndex(b => b.id.toString() === bookingId);
    
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = newStatus;
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Show status update notification
        const notification = document.createElement('div');
        notification.className = `booking-notification ${newStatus.toLowerCase()}`;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <p>Booking status updated to: ${newStatus}</p>
            <p>Booking ID: ${bookingId}</p>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
        
        // Update UI
        const bookingElement = document.querySelector(`[data-booking-id="${bookingId}"]`);
        if (bookingElement) {
            const statusElement = bookingElement.querySelector('.booking-status');
            statusElement.className = `booking-status ${newStatus.toLowerCase()}`;
            statusElement.textContent = newStatus;
            
            // Update action buttons
            const actionsContainer = bookingElement.querySelector('.booking-actions');
            if (actionsContainer) {
                if (newStatus === 'Accepted') {
                    actionsContainer.innerHTML = `
                        <button class="action-btn progress" onclick="updateBookingStatus('${bookingId}', 'In Progress')">Start Service</button>
                    `;
                } else if (newStatus === 'In Progress') {
                    actionsContainer.innerHTML = `
                        <button class="action-btn complete" onclick="updateBookingStatus('${bookingId}', 'Completed')">Complete Service</button>
                    `;
                } else if (newStatus === 'Completed' || newStatus === 'Rejected') {
                    actionsContainer.innerHTML = '';
                }
            }
        }
        
        // Initialize map for the booking
        const mapElement = document.getElementById(`map-${bookingId}`);
        if (mapElement && bookings[bookingIndex].location) {
            const location = bookings[bookingIndex].location;
            const map = new google.maps.Map(mapElement, {
                zoom: 14,
                center: { lat: location.lat, lng: location.lng },
                styles: [{
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }]
                }]
            });
            
            new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: 'Service Location'
            });
        }
    }
}

// Load and display bookings with real-time updates
document.addEventListener('DOMContentLoaded', function() {
    loadBookings();
    // Set up interval to check for new bookings every 30 seconds
    setInterval(loadBookings, 30000);
});

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const upcomingBookings = document.querySelector('.upcoming-bookings');
    const pastBookings = document.querySelector('.past-bookings');
    
    // Clear existing bookings
    upcomingBookings.innerHTML = '';
    pastBookings.innerHTML = '';
    
    bookings.forEach(booking => {
        const bookingElement = document.createElement('div');
        bookingElement.className = 'booking-item';
        bookingElement.setAttribute('data-booking-id', booking.id);
        
        // Create booking HTML
        bookingElement.innerHTML = `
            <div class="booking-info">
                <div class="client-info">
                    <i class="fas fa-user-circle"></i>
                    <p>Client: ${booking.userName || 'Anonymous'}</p>
                </div>
                <div class="booking-details">
                    <p><i class="fas fa-briefcase"></i> Service: ${booking.service}</p>
                    <p><i class="fas fa-calendar"></i> Date: ${booking.date}</p>
                    <p><i class="fas fa-clock"></i> Time: ${booking.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Location: ${booking.location.address}</p>
                </div>
                <div class="map-view" id="map-${booking.id}" style="height: 200px; width: 100%; border-radius: 8px; margin: 10px 0;"></div>
                <div class="booking-actions">
                    ${booking.status === 'Pending' ? `
                        <button class="action-btn accept" onclick="updateBookingStatus('${booking.id}', 'Accepted')">Accept</button>
                        <button class="action-btn reject" onclick="updateBookingStatus('${booking.id}', 'Rejected')">Reject</button>
                    ` : booking.status === 'Accepted' ? `
                        <button class="action-btn progress" onclick="updateBookingStatus('${booking.id}', 'In Progress')">Start Service</button>
                    ` : booking.status === 'In Progress' ? `
                        <button class="action-btn complete" onclick="updateBookingStatus('${booking.id}', 'Completed')">Complete Service</button>
                    ` : ''}
                </div>
                <div class="booking-status ${booking.status.toLowerCase()}">${booking.status}</div>
            </div>
        `;
        
        // Add to appropriate section
        if (['Completed', 'Rejected'].includes(booking.status)) {
            pastBookings.appendChild(bookingElement);
        } else {
            upcomingBookings.appendChild(bookingElement);
        }
        
        // Initialize map
        if (booking.location) {
            const map = new google.maps.Map(document.getElementById(`map-${booking.id}`), {
                zoom: 14,
                center: { lat: booking.location.lat, lng: booking.location.lng },
                styles: [{
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#f5f5f5' }]
                }]
            });
            
            new google.maps.Marker({
                position: { lat: booking.location.lat, lng: booking.location.lng },
                map: map,
                title: 'Service Location'
            });
        }
    });
});

// In both booking.js and marketplace.js
// Import shared maps functionality
document.write('<script src="shared-maps.js"></script>');

function showMap(professional) {
    const mapData = initializeServiceMap({
        id: professional.id,
        location: professional.coordinates,
        serviceType: professional.title
    });
}