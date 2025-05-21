// src/components/organizer/MyEventsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get('/api/organizer/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  };

  const handleDelete = (eventId) => {
    axios.delete(`/api/events/${eventId}`)
      .then(() => fetchEvents())
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>My Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title}
            <button onClick={() => {/* Navigate to edit page */}}>Edit</button>
            <button onClick={() => setEventToDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {eventToDelete && (
        <ConfirmationDialog
          message="Are you sure you want to delete this event?"
          onConfirm={() => {
            handleDelete(eventToDelete);
            setEventToDelete(null);
          }}
          onCancel={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
};

export default MyEventsPage;
