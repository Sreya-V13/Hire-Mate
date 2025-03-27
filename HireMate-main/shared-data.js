// Shared data structures
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
        },
        availability: ["10:00 AM", "2:00 PM", "4:00 PM"]
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
        },
        availability: ["9:00 AM", "1:00 PM", "5:00 PM"]
    }
];

const servicesByCategory = {
    "Computer & IT Services": [
        "Computer Repair",
        "Network Setup",
        "Web Development",
        "IT Consulting"
    ],
    "Home Services": [
        "Plumbing",
        "Electrical Work",
        "Carpentry",
        "House Cleaning"
    ],
    "Professional Services": [
        "Legal Consultation",
        "Financial Advisory",
        "Business Consulting",
        "Tax Services"
    ]
};