import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import { Chart, registerables } from 'chart.js';

// Register all required components for Chart.js
Chart.register(...registerables);

function AdminHomePage() {
    const [bookings, setBookings] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
        vehicleUsage: {},
        avgBookingCost: 0,
    });
    let totalBookingsChartInstance = null;
    let vehicleUsageChartInstance = null;

    // Fetch bookings and compute analytics
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:5000/allbookings');
                if (!response.ok) {
                    const errorText = await response.text(); // Get the response text
                    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                }
                const data = await response.json();
                console.log('Fetched bookings data:', data);
                
                const bookings = data.bookings;

                // Log the bookings array to check its structure
                console.log('Bookings:', bookings); 

                const pending = bookings.filter(b => b.status === 'pending').length;
                const completed = bookings.filter(b => b.status === 'completed').length;

                // Check and log each estimated cost to verify it's in the expected format
                const estimatedCosts = bookings.map(b => {
                    const cost = b.estimatedCost; // Adjust according to the structure
                    console.log(`Estimated Cost for booking ${b._id}:`, cost);
                    return parseInt(cost, 10);
                });

                const avgCost = bookings.length > 0 
                    ? estimatedCosts.reduce((sum, cost) => sum + cost, 0) / bookings.length 
                    : 0; // Avoid division by zero

                // Log average cost for debugging
                console.log('Total Cost:', estimatedCosts.reduce((sum, cost) => sum + cost, 0)); 
                console.log('Average Booking Cost:', avgCost);

                // Get vehicle usage (small, medium, large)
                const vehicleUsage = bookings.reduce((acc, b) => {
                    acc[b.vehicleType] = (acc[b.vehicleType] || 0) + 1;
                    return acc;
                }, {});

                setBookings(bookings);
                setAnalyticsData({
                    totalBookings: bookings.length,
                    pendingBookings: pending,
                    completedBookings: completed,
                    avgBookingCost: avgCost,
                    vehicleUsage,
                });
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    // Chart.js setup for displaying total bookings analytics
    useEffect(() => {
        const ctx = document.getElementById('totalBookingsChart').getContext('2d');

        if (totalBookingsChartInstance) {
            totalBookingsChartInstance.destroy();
        }

        totalBookingsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total', 'Pending', 'Completed'],
                datasets: [
                    {
                        label: '# of Bookings',
                        data: [
                            analyticsData.totalBookings,
                            analyticsData.pendingBookings,
                            analyticsData.completedBookings
                        ],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Ensures chart adapts to the canvas size
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Cleanup on unmount
        return () => {
            if (totalBookingsChartInstance) {
                totalBookingsChartInstance.destroy();
            }
        };
    }, [analyticsData]);

    // Chart.js setup for displaying vehicle usage analytics
    useEffect(() => {
        const ctx = document.getElementById('vehicleUsageChart').getContext('2d');

        if (vehicleUsageChartInstance) {
            vehicleUsageChartInstance.destroy();
        }

        const vehicleLabels = Object.keys(analyticsData.vehicleUsage);
        const vehicleData = Object.values(analyticsData.vehicleUsage);

        vehicleUsageChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: vehicleLabels,
                datasets: [
                    {
                        label: 'Vehicle Usage',
                        data: vehicleData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Ensures chart adapts to the canvas size
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Vehicle Usage',
                    },
                },
            },
        });

        // Cleanup on unmount
        return () => {
            if (vehicleUsageChartInstance) {
                vehicleUsageChartInstance.destroy();
            }
        };
    }, [analyticsData.vehicleUsage]);

    return (
        <div>
            <AdminNavbar />
            <div className="min-h-screen flex flex-col bg-white">
                <main className="flex-grow px-8 py-6">
                    <h2 className="text-4xl font-semibold mb-6">Welcome, Admin</h2>

                    {/* Analytics Dashboard */}
                    <section className="border border-gray-300 rounded-md p-4">
                        <h3 className="text-xl font-semibold">Analytics</h3>

                        {/* Total Bookings Chart */}
                        <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                            <canvas id="totalBookingsChart"></canvas>
                        </div>

                        {/* Cards for Average Cost and Total Bookings */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-blue-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
                                <h4 className="text-3xl font-bold mb-2">Average Booking Cost</h4>
                                <p className="text-2xl">₹{analyticsData.avgBookingCost.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
                                <h4 className="text-3xl font-bold mb-2">Total Bookings</h4>
                                <p className="text-2xl">{analyticsData.totalBookings}</p>
                            </div>
                        </div>

                        {/* Pie Chart for Vehicle Usage */}
                        <div style={{ position: 'relative', height: '200px', width: '100%', marginTop: '16px' }}>
                            <canvas id="vehicleUsageChart"></canvas>
                        </div>

                        {/* Vehicle Usage Details */}
                        <div className="mt-4">
                            <p><strong>Small Vehicles:</strong> {analyticsData.vehicleUsage.small || 0}</p>
                            <p><strong>Medium Vehicles:</strong> {analyticsData.vehicleUsage.medium || 0}</p>
                            <p><strong>Large Vehicles:</strong> {analyticsData.vehicleUsage.large || 0}</p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default AdminHomePage;
