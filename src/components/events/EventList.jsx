// src/components/events/EventList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
};

export default EventList;
