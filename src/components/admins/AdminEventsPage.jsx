// src/components/admin/AdminEventsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = () => {
    const url = filter === 'all' ? '/api/admin/events' : `/api/admin/events?status=${filter}`;
    axios.get(url)
      .then(response => setEvents(response.data))
      .catch(error => console.error(error));
  };
  const updateEventStatus = (eventId, status) => {
    axios.put(`/api/admin/events/${eventId}`, { status })
      .then(() => fetchEvents())
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>All Events</h2>
      <div>
        <label>Filter by Status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </div>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} - {event.status}
            {event.status === 'pending' && (
              <>
                <button onClick={() => updateEventStatus(event.id, 'approved')}>Approve</button>
                <button onClick={() => updateEventStatus(event.id, 'declined')}>Decline</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEventsPage;
