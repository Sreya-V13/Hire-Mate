// Create a new file for shared maps functionality
function initializeServiceMap(service) {
    const mapElement = document.getElementById(`map-${service.id}`);
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
        center: { lat: service.location.lat || 19.0760, lng: service.location.lng || 72.8777 },
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
        position: { lat: service.location.lat || 19.0760, lng: service.location.lng || 72.8777 },
        map: map,
        title: service.serviceType,
        animation: google.maps.Animation.DROP
    });

    return { map, marker };
}

function getDirections(serviceId) {
    const service = findServiceById(serviceId);
    if (!service) return;

    const destination = `${service.location.lat},${service.location.lng}`;
    window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
        '_blank'
    );
} 