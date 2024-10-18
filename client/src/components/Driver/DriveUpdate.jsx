import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function DriveUpdate() {
    const mapRef = useRef(null);

    const [timeEstimation, setTimeEstimation] = useState('');
    const [priceEstimation, setPriceEstimation] = useState('');
    const [journeyStatus, setJourneyStatus] = useState('Idle'); // Initial journey status

    useEffect(() => {
        const currentLatitude = 28.587624692530763;
        const currentLongitude = 77.30508393204065;
        const destinationLatitude = 28.7162092;
        const destinationLongitude = 77.1170743;

        // Function to calculate distance between two coordinates (Haversine formula)
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of the Earth in km
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                      Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
        };

        // Time Estimation Function (in minutes)
        const estimateTime = (distance) => {
            const speedKmPerHour = 40; // Assuming 40 km/h as average speed
            const timeInHours = distance / speedKmPerHour;
            const timeInMinutes = timeInHours * 60;
            return timeInMinutes.toFixed(2); // Return time in minutes
        };

        // Price Estimation Function
        const estimatePrice = (distance) => {
            const baseFare = 50; // ₹50 base fare
            const costPerKm = 10; // ₹10 per km
            const totalFare = baseFare + (costPerKm * distance);
            return totalFare.toFixed(2); // Return fare
        };

        const initializeMap = (latitude, longitude, pickupLatitude, pickupLongitude) => {
            if (mapRef.current) {
                mapRef.current.setView([latitude, longitude], 13);
                return;
            }

            mapRef.current = L.map('driveMap').setView([latitude, longitude], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
                maxZoom: 20,
                minZoom: 2,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(mapRef.current);

            L.marker([latitude, longitude]).addTo(mapRef.current)
                .bindPopup('Current Location')
                .openPopup();

            L.marker([pickupLatitude, pickupLongitude]).addTo(mapRef.current)
                .bindPopup('Destination Location')
                .openPopup();

            const latlngs = [
                [latitude, longitude],
                [pickupLatitude, pickupLongitude]
            ];

            const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(mapRef.current);
            mapRef.current.fitBounds(polyline.getBounds());

            // Calculate distance, time, and price
            const distance = calculateDistance(latitude, longitude, pickupLatitude, pickupLongitude);
            setTimeEstimation(estimateTime(distance));
            setPriceEstimation(estimatePrice(distance));
        };

        initializeMap(currentLatitude, currentLongitude, destinationLatitude, destinationLongitude);
    }, []);

    const startJourney = () => {
        setJourneyStatus('Pickup');
    };

    const updateJourneyStatus = (newStatus) => {
        setJourneyStatus(newStatus);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
            <h2 className="text-4xl font-bold text-yellow-500 mb-6">🚖 Drive Update</h2>
            
            <div id="driveMap" className="w-full h-96 mb-6 rounded-lg shadow-md" style={{ width: '80%', height: '500px' }}></div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-4/5 md:w-1/3">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Trip Details</h3>

                <p className="text-lg text-gray-600 mb-2">
                    <strong>Estimated Time:</strong> {timeEstimation} minutes
                </p>

                <p className="text-lg text-gray-600 mb-2">
                    <strong>Estimated Price:</strong> ₹{priceEstimation}
                </p>

                <p className="text-lg text-gray-600 mb-2">
                    <strong>Journey Status:</strong> {journeyStatus}
                </p>

                {/* Start Journey Button */}
                {journeyStatus === 'Idle' && (
                    <button 
                        onClick={startJourney}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded mt-4"
                    >
                        Start Journey
                    </button>
                )}

                {/* Update Status Buttons */}
                {journeyStatus !== 'Idle' && (
                    <div className="mt-4">
                        {journeyStatus !== 'Pickup' && (
                            <button 
                                onClick={() => updateJourneyStatus('Pickup')}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mx-2"
                            >
                                Pickup
                            </button>
                        )}
                        {journeyStatus !== 'Traveling' && (
                            <button 
                                onClick={() => updateJourneyStatus('Traveling')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mx-2"
                            >
                                Traveling
                            </button>
                        )}
                        {journeyStatus !== 'Drop Off' && (
                            <button 
                                onClick={() => updateJourneyStatus('Drop Off')}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mx-2"
                            >
                                Drop Off
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DriveUpdate;
