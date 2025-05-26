// src/components/organizer/EventAnalytics.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const EventAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    axios.get('/api/organizer/events/analytics')
      .then(response => setAnalyticsData(response.data))
      .catch(error => console.error(error));
  }, []);

  if (!analyticsData) return <p>Loading analytics...</p>;

  const data = {
    labels: analyticsData.map(item => item.eventTitle),
    datasets: [
      {
        label: 'Tickets Sold',
        data: analyticsData.map(item => item.ticketsSold),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>Event Analytics</h2>
      <Bar data={data} />
    </div>
  );
};

export default EventAnalytics;
